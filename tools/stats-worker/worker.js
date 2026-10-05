// Typebite activity counter + overload mail - a Cloudflare Worker with one Durable Object (free plan is enough).
// Every open game tab POSTs a tiny heartbeat (random tab id, mode, number of humans, host step time, ping) about once a minute.
// The object counts who is active, keeps daily numbers and sends a mail to the owner when something looks overloaded.
// Not stored: IP address, name, anything that identifies a person. Setup guide (German): docs/statistik.md
//
// Pages (only with the key, secret KEY):   /?k=KEY   the status page for the phone (page.html, fetches /json itself)     /json?k=KEY   the same as JSON (&h=0 without the history)
//                                          /test?k=KEY   sends a test mail and shows if it worked
// The game sends to:                       POST /hb   (text/plain JSON, answer: {next: seconds until the next heartbeat})
import { DurableObject } from 'cloudflare:workers';
import { EmailMessage } from 'cloudflare:email';
import PAGE from './page.html';   // the status page (wrangler loads .html files as text)

const DAILY_LIMIT = 50000;        // free plan: 100000 rows written per day (UTC) for the Durable Object, a heartbeat writes about 2 of them -> about 50000 heartbeats per day
const QUOTA_WARN = 40000;         // mail when today's heartbeats reach this
const SLOW_MS = 14;               // a host whose server step takes longer than this on average cannot keep 60 steps/s (budget 16.7 ms)
const SLOW_MINUTES = 3;           // ... for this many checks in a row (one check per minute)
const NET_RTT = 500;              // ping (ms) of the middle client ... with at least NET_MIN clients measured
const NET_MIN = 3;
const MAIL_COOLDOWN = 3 * 3600e3; // the same kind of mail at most every 3 hours
const MIN_GAP = 15000;            // one tab may not beat faster than this
const KEEP_DAYS = 30, MAX_SEEN = 3000;
const BUCKET = 300000, HIST_MAX = 576;   // history: one sample per 5 minutes, 48 hours

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const nextSec = reqs => reqs < 15000 ? 60 : reqs < 30000 ? 120 : reqs < 42000 ? 300 : 900;   // heartbeats slow down on their own when the day gets busy
const dayOf = t => new Date(t).toISOString().slice(0, 10);
const num = (v, hi) => { v = +v; return isFinite(v) && v >= 0 ? Math.min(hi, v) : -1 };   // -1 = not known
const b64 = s => { const b = new TextEncoder().encode(s); let x = ''; for (let i = 0; i < b.length; i += 0x8000) x += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(x) };

export class Stats extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.live = new Map(); this.today = { day: dayOf(Date.now()), reqs: 0, peak: 0, seen: new Set(), played: new Set() };
    this.days = {}; this.mail = {}; this.slow = new Map(); this.alarmSet = false; this.mailErr = ''; this.savedAt = 0; this.hist = [];
    // a Durable Object is thrown out of memory a few seconds after its last request: the tab, the day counter and the first sighting of a tab are written at once (about 2 rows per heartbeat), the rest by the minute alarm
    this.ready = ctx.blockConcurrencyWhile(async () => {
      const g = await ctx.storage.get(['today', 'days', 'mail', 'slow', 'mailErr', 'hist']);
      for (const [k, v] of await ctx.storage.list({ prefix: 'l:' })) this.live.set(k.slice(2), v);
      const t = g.get('today'); if (t) this.today = { day: t.day, reqs: t.reqs, peak: t.peak, seen: new Set(), played: new Set() };
      for (const k of (await ctx.storage.list({ prefix: 's:' })).keys()) this.today.seen.add(k.slice(2));
      for (const k of (await ctx.storage.list({ prefix: 'p:' })).keys()) this.today.played.add(k.slice(2));
      this.days = g.get('days') || {}; this.mail = g.get('mail') || {}; this.slow = new Map(g.get('slow') || []); this.mailErr = g.get('mailErr') || ''; this.hist = g.get('hist') || [];
    });
  }
  roll() {
    const d = dayOf(Date.now());
    if (this.today.day === d) return;
    const old = [...this.today.seen].map(x => 's:' + x).concat([...this.today.played].map(x => 'p:' + x));
    this.ctx.waitUntil((async () => { for (let i = 0; i < old.length; i += 120) await this.ctx.storage.delete(old.slice(i, i + 120)) })());
    this.days[this.today.day] = { reqs: this.today.reqs, peak: this.today.peak, tabs: this.today.seen.size, play: this.today.played.size };
    for (const k of Object.keys(this.days).sort().slice(0, -KEEP_DAYS)) delete this.days[k];
    this.today = { day: d, reqs: 0, peak: 0, seen: new Set(), played: new Set() };
  }
  async save() {
    const t = this.today;
    await this.ctx.storage.put({ today: { day: t.day, reqs: t.reqs, peak: t.peak }, days: this.days, mail: this.mail, slow: [...this.slow], mailErr: this.mailErr, hist: this.hist });
  }
  async hb(b) {
    await this.ready; this.roll();
    const t = Date.now(), T = this.today; T.reqs++;
    const next = nextSec(T.reqs), old = this.live.get(b.sid);
    if (old && t - old.t < MIN_GAP) return next;
    if (!old && this.live.size >= 5000) return next;
    this.live.set(b.sid, { t, exp: t + next * 2200, r: b.r, st: b.st, h: b.h, ms: b.ms, rtt: b.rtt, b: b.b });
    const w = { ['l:' + b.sid]: this.live.get(b.sid), today: { day: T.day, reqs: T.reqs, peak: T.peak } };   // rows: this tab and the day counter, written at once
    if (!T.seen.has(b.sid) && T.seen.size < MAX_SEEN) { T.seen.add(b.sid); w['s:' + b.sid] = 1 }
    if (b.st === 'play' && !T.played.has(b.sid) && T.played.size < MAX_SEEN) { T.played.add(b.sid); w['p:' + b.sid] = 1 }
    await this.ctx.storage.put(w);
    if (!this.alarmSet) { this.alarmSet = true; if (!(await this.ctx.storage.getAlarm())) await this.ctx.storage.setAlarm(t + 60000) }
    return next;
  }
  // how busy is it: three values in percent, 100 % = the limit where a warning mail is sent; the total is the worst of them
  loadNow(t) {
    let hostMs = -1, rtts = [];
    for (const e of this.live.values()) {
      if (e.exp <= t) continue;
      if (e.r === 'host' && e.ms >= 0) hostMs = Math.max(hostMs, e.ms);
      if (e.r === 'client' && e.rtt >= 0) rtts.push(e.rtt);
    }
    rtts.sort((a, b) => a - b);
    const netMs = rtts.length ? Math.round(rtts[rtts.length >> 1]) : -1;
    const host = hostMs >= 0 ? Math.round(hostMs / SLOW_MS * 100) : 0, net = netMs >= 0 ? Math.round(netMs / NET_RTT * 100) : 0, quota = Math.round(this.today.reqs / QUOTA_WARN * 100);
    const total = Math.max(host, net, quota);
    return { total, host, net, quota, hostMs, netMs, netN: rtts.length, status: total >= 100 ? 'over' : total >= 60 ? 'busy' : 'ok' };
  }
  count() { const t = Date.now(); let n = 0, play = 0, hosts = 0; for (const e of this.live.values()) if (e.exp > t) { n++; if (e.st === 'play') play++; if (e.r === 'host') hosts++ } return { n, play, hosts } }
  async alarm() {
    await this.ready; this.roll(); this.alarmSet = false;
    const t = Date.now();
    const gone = [];
    for (const [k, e] of this.live) if (e.exp < t) { this.live.delete(k); gone.push('l:' + k) }
    for (let i = 0; i < gone.length; i += 120) await this.ctx.storage.delete(gone.slice(i, i + 120));
    const c = this.count(); if (c.n > this.today.peak) this.today.peak = c.n;
    const last = this.hist[this.hist.length - 1];
    if (!last || t - last.t >= BUCKET - 5000 || (c.n === 0 && last.n > 0)) {
      this.hist.push({ t, n: c.n, p: c.play, l: this.loadNow(t).total });
      if (this.hist.length > HIST_MAX) this.hist.splice(0, this.hist.length - HIST_MAX);
    }
    const alerts = [];
    if (this.today.reqs >= QUOTA_WARN) alerts.push(['quota', 'Das Tageslimit von Cloudflare wird knapp', `Heute wurden schon ${this.today.reqs} von ${DAILY_LIMIT} Herzschlägen gezählt. Die Spiele schicken jetzt seltener (alle ${nextSec(this.today.reqs)} s). Bei ${DAILY_LIMIT} hört die Zählung für heute auf; das Spiel selbst läuft weiter.`]);
    const slow = [];
    for (const [sid, e] of this.live) {
      if (e.r === 'host' && e.ms > SLOW_MS && t - e.t < 90000) { const n = (this.slow.get(sid) || 0) + 1; this.slow.set(sid, n); if (n >= SLOW_MINUTES) slow.push(`Host ${sid}: Schritt ${e.ms.toFixed(1)} ms (Ziel unter 16.7), ${e.h} Spieler`) }
      else this.slow.delete(sid);
    }
    for (const sid of [...this.slow.keys()]) if (!this.live.has(sid)) this.slow.delete(sid);
    if (slow.length) alerts.push(['host', 'Ein Host ist überlastet', 'Mindestens ein Spieler, der eine Lobby hostet, schafft die 60 Spielschritte pro Sekunde nicht mehr:\n' + slow.join('\n') + '\nDie Mitspieler dieser Lobby merken das als Ruckeln. Hilfe: weniger Bots (players.bots in site/config.js) oder ein eigener Server.']);
    const rtts = [...this.live.values()].filter(e => e.r === 'client' && e.rtt >= 0 && t - e.t < 90000).map(e => e.rtt).sort((a, b) => a - b);
    if (rtts.length >= NET_MIN && rtts[rtts.length >> 1] > NET_RTT) alerts.push(['net', 'Die Verbindungen sind sehr langsam', `${rtts.length} Spieler haben gerade im Mittel ${Math.round(rtts[rtts.length >> 1])} ms Ping zu ihrem Host (Ziel unter ${NET_RTT}). Meist ist dann die Leitung des Hosts voll.`]);
    for (const [kind, subject, text] of alerts) {
      if (t - (this.mail[kind] || 0) < MAIL_COOLDOWN) continue;
      this.mail[kind] = t;
      await this.sendMail('Typebite: ' + subject, text + `\n\nJetzt aktiv: ${c.n} Tabs (${c.play} spielen, ${c.hosts} hosten).\nSpitze heute: ${this.today.peak}.\nStatistik: ${this.env.PUBLIC_URL || ''}`);
    }
    await this.save();
    if (this.live.size) { this.alarmSet = true; await this.ctx.storage.setAlarm(t + 60000) }
  }
  async sendMail(subject, text) {
    try {
      const from = this.env.MAIL_FROM, to = this.env.MAIL_TO;
      const raw = [`From: Typebite <${from}>`, `To: ${to}`, `Subject: =?UTF-8?B?${b64(subject)}?=`, `Message-ID: <${crypto.randomUUID()}@typebite.io>`, `Date: ${new Date().toUTCString()}`,
        'MIME-Version: 1.0', 'Content-Type: text/plain; charset=utf-8', 'Content-Transfer-Encoding: base64', '', b64(text).replace(/(.{76})/g, '$1\r\n')].join('\r\n');
      await this.env.MAIL.send(new EmailMessage(from, to, raw));
      this.mailErr = ''; return 'ok';
    } catch (e) { this.mailErr = String(e && e.message || e).slice(0, 300); return this.mailErr }
  }
  async snapshot(withHist = true) {
    await this.ready; this.roll();
    const t = Date.now(), c = this.count(), L = this.loadNow(t), rows = [], builds = {};
    for (const [sid, e] of this.live) if (e.exp > t) { rows.push({ sid, h: e.h, ms: e.ms, load: e.ms >= 0 ? Math.round(e.ms / SLOW_MS * 100) : 0, ago: Math.round((t - e.t) / 1000), r: e.r }); builds[e.b] = (builds[e.b] || 0) + 1 }
    const T = this.today, days = Object.entries(this.days).sort().reverse().map(([d, v]) => ({ day: d, ...v }));
    const peak7 = Math.max(T.peak, c.n, ...days.slice(0, 6).map(d => d.peak || 0));
    let hist;
    if (withHist) {   // 48 hours in 5 minute steps, empty steps are 0 (nobody was online)
      const b0 = Math.floor(t / BUCKET) - (HIST_MAX - 1), n = new Array(HIST_MAX).fill(0), p = new Array(HIST_MAX).fill(0), l = new Array(HIST_MAX).fill(0);
      for (const h of this.hist) { const k = Math.floor(h.t / BUCKET) - b0; if (k >= 0 && k < HIST_MAX) { n[k] = Math.max(n[k], h.n); p[k] = Math.max(p[k], h.p); l[k] = Math.max(l[k], h.l) } }
      n[HIST_MAX - 1] = Math.max(n[HIST_MAX - 1], c.n); p[HIST_MAX - 1] = Math.max(p[HIST_MAX - 1], c.play); l[HIST_MAX - 1] = Math.max(l[HIST_MAX - 1], L.total);
      hist = { t0: b0 * BUCKET, step: BUCKET, n, p, l };
    }
    return { ts: t, now: c, load: L, limits: { slowMs: SLOW_MS, netRtt: NET_RTT, quotaWarn: QUOTA_WARN }, today: { day: T.day, reqs: T.reqs, peak: Math.max(T.peak, c.n), tabs: T.seen.size, play: T.played.size }, peak7, days, builds, hosts: rows.filter(r => r.r === 'host'), mail: this.mail, mailErr: this.mailErr, hist };
  }
  async testMail() { await this.ready; return this.sendMail('Typebite: Testmail', 'Wenn du das liest, funktioniert die Warn-Mail.') }
}

const page = snap => PAGE.replace('__INIT__', JSON.stringify(snap).replace(/</g, '\\u003c'));

export default {
  async fetch(req, env) {
    const u = new URL(req.url), stub = env.STATS.get(env.STATS.idFromName('main'));
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (u.pathname === '/hb' && req.method === 'POST') {
      const txt = await req.text();
      if (txt.length > 600) return new Response('too big', { status: 413, headers: CORS });
      let p; try { p = JSON.parse(txt) } catch (_) { return new Response('bad', { status: 400, headers: CORS }) }
      if (!p || typeof p.sid !== 'string' || !/^[a-z0-9]{4,12}$/.test(p.sid)) return new Response('bad', { status: 400, headers: CORS });
      const b = { sid: p.sid, r: ['host', 'client', 'solo'].includes(p.r) ? p.r : 'solo', st: p.st === 'play' ? 'play' : 'menu', h: num(p.h, 99), ms: num(p.ms, 1000), rtt: num(p.rtt, 60000), b: String(p.b || '').slice(0, 12).replace(/[^\w.-]/g, '') };
      const next = await stub.hb(b);
      return new Response(JSON.stringify({ next }), { headers: { ...CORS, 'Content-Type': 'application/json' } });
    }
    const key = String(env.KEY || ''), given = u.searchParams.get('k') || '';
    if (!key || given.length !== key.length || [...key].reduce((a, c, i) => a | (c.charCodeAt(0) ^ given.charCodeAt(i)), 0)) return new Response('Typebite stats', { status: 403, headers: { 'Content-Type': 'text/plain' } });
    if (u.pathname === '/json') return new Response(JSON.stringify(await stub.snapshot(u.searchParams.get('h') !== '0')), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
    if (u.pathname === '/test') { const r = await stub.testMail(); return new Response(r === 'ok' ? 'Testmail wurde abgeschickt: schau in dein Postfach (und Spam).' : 'Fehler beim Senden: ' + r, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }) }
    return new Response(page(await stub.snapshot()), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
};
