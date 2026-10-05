// Typebite activity counter + overload mail - a Cloudflare Worker with one Durable Object (free plan is enough).
// Every open game tab POSTs a tiny heartbeat (random tab id, mode, number of humans, host step time, ping) about once a minute.
// The object counts who is active, keeps daily numbers and sends a mail to the owner when something looks overloaded.
// Not stored: IP address, name, anything that identifies a person. Setup guide (German): docs/statistik.md
//
// Pages (only with the key, secret KEY):   /?k=KEY   the stats page (refreshes itself)     /json?k=KEY   the same as JSON
//                                          /test?k=KEY   sends a test mail and shows if it worked
// The game sends to:                       POST /hb   (text/plain JSON, answer: {next: seconds until the next heartbeat})
import { DurableObject } from 'cloudflare:workers';
import { EmailMessage } from 'cloudflare:email';

const DAILY_LIMIT = 50000;        // free plan: 100000 rows written per day (UTC) for the Durable Object, a heartbeat writes about 2 of them -> about 50000 heartbeats per day
const QUOTA_WARN = 40000;         // mail when today's heartbeats reach this
const SLOW_MS = 14;               // a host whose server step takes longer than this on average cannot keep 60 steps/s (budget 16.7 ms)
const SLOW_MINUTES = 3;           // ... for this many checks in a row (one check per minute)
const NET_RTT = 500;              // ping (ms) of the middle client ... with at least NET_MIN clients measured
const NET_MIN = 3;
const MAIL_COOLDOWN = 3 * 3600e3; // the same kind of mail at most every 3 hours
const MIN_GAP = 15000;            // one tab may not beat faster than this
const KEEP_DAYS = 30, MAX_SEEN = 3000;

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const nextSec = reqs => reqs < 15000 ? 60 : reqs < 30000 ? 120 : reqs < 42000 ? 300 : 900;   // heartbeats slow down on their own when the day gets busy
const dayOf = t => new Date(t).toISOString().slice(0, 10);
const num = (v, hi) => { v = +v; return isFinite(v) && v >= 0 ? Math.min(hi, v) : -1 };   // -1 = not known
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const b64 = s => { const b = new TextEncoder().encode(s); let x = ''; for (let i = 0; i < b.length; i += 0x8000) x += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(x) };

export class Stats extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.live = new Map(); this.today = { day: dayOf(Date.now()), reqs: 0, peak: 0, seen: new Set(), played: new Set() };
    this.days = {}; this.mail = {}; this.slow = new Map(); this.alarmSet = false; this.mailErr = ''; this.savedAt = 0;
    // a Durable Object is thrown out of memory a few seconds after its last request: the tab, the day counter and the first sighting of a tab are written at once (about 2 rows per heartbeat), the rest by the minute alarm
    this.ready = ctx.blockConcurrencyWhile(async () => {
      const g = await ctx.storage.get(['today', 'days', 'mail', 'slow', 'mailErr']);
      for (const [k, v] of await ctx.storage.list({ prefix: 'l:' })) this.live.set(k.slice(2), v);
      const t = g.get('today'); if (t) this.today = { day: t.day, reqs: t.reqs, peak: t.peak, seen: new Set(), played: new Set() };
      for (const k of (await ctx.storage.list({ prefix: 's:' })).keys()) this.today.seen.add(k.slice(2));
      for (const k of (await ctx.storage.list({ prefix: 'p:' })).keys()) this.today.played.add(k.slice(2));
      this.days = g.get('days') || {}; this.mail = g.get('mail') || {}; this.slow = new Map(g.get('slow') || []); this.mailErr = g.get('mailErr') || '';
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
    await this.ctx.storage.put({ today: { day: t.day, reqs: t.reqs, peak: t.peak }, days: this.days, mail: this.mail, slow: [...this.slow], mailErr: this.mailErr });
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
  count() { const t = Date.now(); let n = 0, play = 0, hosts = 0; for (const e of this.live.values()) if (e.exp > t) { n++; if (e.st === 'play') play++; if (e.r === 'host') hosts++ } return { n, play, hosts } }
  async alarm() {
    await this.ready; this.roll(); this.alarmSet = false;
    const t = Date.now();
    const gone = [];
    for (const [k, e] of this.live) if (e.exp < t) { this.live.delete(k); gone.push('l:' + k) }
    for (let i = 0; i < gone.length; i += 120) await this.ctx.storage.delete(gone.slice(i, i + 120));
    const c = this.count(); if (c.n > this.today.peak) this.today.peak = c.n;
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
  async snapshot() {
    await this.ready; this.roll();
    const t = Date.now(), c = this.count(), rows = [], builds = {};
    for (const [sid, e] of this.live) if (e.exp > t) { rows.push({ sid, ago: Math.round((t - e.t) / 1000), r: e.r, st: e.st, h: e.h, ms: e.ms, rtt: e.rtt }); builds[e.b] = (builds[e.b] || 0) + 1 }
    const T = this.today, days = Object.entries(this.days).sort().reverse().map(([d, v]) => ({ day: d, ...v }));
    return { now: c, today: { day: T.day, reqs: T.reqs, peak: Math.max(T.peak, c.n), tabs: T.seen.size, play: T.played.size }, limit: DAILY_LIMIT, days, builds, hosts: rows.filter(r => r.r === 'host'), mail: this.mail, mailErr: this.mailErr };
  }
  async testMail() { await this.ready; return this.sendMail('Typebite: Testmail', 'Wenn du das liest, funktioniert die Warn-Mail.') }
}

function page(s) {
  const row = (a, b) => `<tr><td>${a}</td><td><b>${b}</b></td></tr>`;
  const days = [{ day: s.today.day + ' (heute)', reqs: s.today.reqs, peak: s.today.peak, tabs: s.today.tabs, play: s.today.play }, ...s.days].map(d => `<tr><td>${esc(d.day)}</td><td>${d.peak}</td><td>${d.tabs}</td><td>${d.play}</td><td>${d.reqs}</td></tr>`).join('');
  const hosts = s.hosts.map(h => `<tr><td>${esc(h.sid)}</td><td>${h.h}</td><td>${h.ms >= 0 ? (+h.ms).toFixed(1) + ' ms' : '-'}</td><td>${h.ago} s</td></tr>`).join('') || '<tr><td colspan=4>gerade keine</td></tr>';
  const m = Object.entries(s.mail).map(([k, v]) => `${esc(k)}: ${new Date(v).toISOString().slice(0, 16).replace('T', ' ')} UTC`).join(' · ') || 'noch keine Warnung verschickt';
  return `<!doctype html><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><meta http-equiv=refresh content=20><title>Typebite live</title>
<style>body{font:16px system-ui,sans-serif;background:#fff8e8;color:#2b2140;margin:0;padding:20px}main{max-width:640px;margin:auto}h1{margin:0 0 4px}.big{font-size:64px;font-weight:800;color:#ff6b3d;line-height:1;margin:14px 0 4px}
table{border-collapse:collapse;width:100%;margin:8px 0 22px;background:#fff;border:2px solid #2b2140}td,th{padding:6px 10px;border-bottom:1px solid #e4dcef;text-align:left}small{opacity:.7}</style>
<main><h1>Typebite live</h1><small>aktualisiert sich alle 20 s · ein "Tab" ist ein offenes Spielfenster, nicht unbedingt eine Person</small>
<p class=big>${s.now.n}</p><p>offene Tabs gerade (${s.now.play} im Spiel, ${s.now.hosts} hosten)</p>
<table>${row('Spitze heute', s.today.peak)}${row('Tabs heute insgesamt', s.today.tabs)}${row('davon im Spiel (Play gedrückt)', s.today.play)}${row('Herzschläge heute', s.today.reqs + ' von ' + s.limit)}</table>
<h3>Hosts</h3><table><tr><th>Tab</th><th>Spieler</th><th>Schrittzeit</th><th>zuletzt</th></tr>${hosts}</table>
<h3>Letzte Tage (UTC)</h3><table><tr><th>Tag</th><th>Spitze</th><th>Tabs</th><th>im Spiel</th><th>Herzschläge</th></tr>${days}</table>
<h3>Versionen</h3><p>${Object.entries(s.builds).map(([b, n]) => esc(b) + ': ' + n).join(' · ') || '-'}</p>
<h3>Warn-Mails</h3><p>${m}</p>${s.mailErr ? '<p><b>Letzter Mail-Fehler:</b> ' + esc(s.mailErr) + '</p>' : ''}</main>`;
}

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
    if (u.pathname === '/json') return new Response(JSON.stringify(await stub.snapshot(), null, 1), { headers: { 'Content-Type': 'application/json' } });
    if (u.pathname === '/test') { const r = await stub.testMail(); return new Response(r === 'ok' ? 'Testmail wurde abgeschickt: schau in dein Postfach (und Spam).' : 'Fehler beim Senden: ' + r, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }) }
    return new Response(page(await stub.snapshot()), { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
};
