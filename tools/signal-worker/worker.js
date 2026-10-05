// Typebite signalling server: speaks the PeerJS server protocol (so the game keeps using PeerJS) on a Cloudflare Durable Object with hibernating WebSockets,
// and hands out ICE servers (STUN and, with the secrets TURN_KEY_ID + TURN_API_TOKEN, TURN credentials of Cloudflare Realtime).
// It only passes the small connection set-up messages (OFFER, ANSWER, CANDIDATE, LEAVE) between players; game data never touches it.
// Not stored: nothing is written to disk. Peer ids are random strings or lobby names, no names or addresses are kept.
//
//   GET  /peerjs/id          a random peer id (the PeerJS client asks for one when it has none)
//   WS   /peerjs?key&id&token   the signalling socket (messages: OPEN, ID-TAKEN, ERROR, EXPIRE and the relayed OFFER/ANSWER/CANDIDATE/LEAVE)
//   GET  /ice                {iceServers:[...], turn:true|false}  (cached for an hour)
//   GET  /status             {sockets:N}
import { DurableObject } from 'cloudflare:workers';

const KEY = 'peerjs', MAX_SOCKETS = 4000, MAX_MSG = 24000, STALE_MS = 30000, ICE_TTL = 86400;
const ORIGINS = /^(https:\/\/(www\.)?typebite\.io|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?|https:\/\/typebite[\w-]*\.alikesan2004\.workers\.dev)$/;
const RELAY = new Set(['OFFER', 'ANSWER', 'CANDIDATE', 'LEAVE', 'EXPIRE']);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const json = (o, status = 200, extra) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json', ...CORS, ...extra } });
const text = (s, status = 200) => new Response(s, { status, headers: { 'content-type': 'text/plain', ...CORS } });
const rid = () => Array.from(crypto.getRandomValues(new Uint8Array(9)), b => (b % 36).toString(36)).join('');

export default {
  async fetch(req, env, ctx) {
    const u = new URL(req.url);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (u.pathname === '/peerjs/id' || u.pathname === '/' + KEY + '/id') return text(rid());
    if (u.pathname === '/ice') return ice(env, ctx);
    if (u.pathname === '/peerjs' || u.pathname === '/status') return env.HUB.get(env.HUB.idFromName('hub')).fetch(req);
    return text('Typebite signalling server', u.pathname === '/' ? 200 : 404);
  }
};

async function ice(env, ctx) {
  const stun = [{ urls: 'stun:stun.cloudflare.com:3478' }];
  if (!env.TURN_KEY_ID || !env.TURN_API_TOKEN) return json({ iceServers: stun, turn: false }, 200, { 'cache-control': 'public, max-age=300' });
  const ck = new Request('https://typebite-signal.internal/ice-v1'), cache = caches.default;
  const hit = await cache.match(ck);
  if (hit) return new Response(hit.body, { headers: { 'content-type': 'application/json', ...CORS, 'cache-control': 'public, max-age=1800' } });
  try {
    const r = await fetch('https://rtc.live.cloudflare.com/v1/turn/keys/' + env.TURN_KEY_ID + '/credentials/generate-ice-servers', {
      method: 'POST', headers: { Authorization: 'Bearer ' + env.TURN_API_TOKEN, 'content-type': 'application/json' }, body: JSON.stringify({ ttl: ICE_TTL })
    });
    if (!r.ok) throw new Error('turn ' + r.status);
    const d = await r.json(), servers = (d.iceServers || []).map(s => ({ ...s, urls: [].concat(s.urls).filter(x => !/:53(\?|$)/.test(x)) }));   // port 53 is blocked in browsers
    const body = JSON.stringify({ iceServers: servers.length ? servers : stun, turn: servers.some(s => s.credential) });
    ctx.waitUntil(cache.put(ck, new Response(body, { headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=21600' } })));   // one set of credentials for everybody, renewed every 6 hours
    return new Response(body, { headers: { 'content-type': 'application/json', ...CORS, 'cache-control': 'public, max-age=1800' } });
  } catch (e) { return json({ iceServers: stun, turn: false, error: String(e.message || e) }, 200, { 'cache-control': 'no-store' }) }
}

export class Hub extends DurableObject {
  rl = new Map();   // per socket: message budget (in memory only)

  async fetch(req) {
    const u = new URL(req.url);
    if (u.pathname === '/status') return json({ sockets: this.ctx.getWebSockets().length });
    if (req.headers.get('Upgrade') !== 'websocket') return text('expected a websocket', 426);
    const origin = req.headers.get('Origin');
    const pair = new WebSocketPair(), [client, server] = Object.values(pair);
    const refuse = (type, msg) => { server.accept(); server.send(JSON.stringify({ type, payload: { msg } })); server.close(1008, msg); return new Response(null, { status: 101, webSocket: client }) };
    if (origin && !ORIGINS.test(origin)) return refuse('ERROR', 'Origin not allowed');
    const id = u.searchParams.get('id') || '', token = u.searchParams.get('token') || '', key = u.searchParams.get('key');
    if (!id || !token || id.length > 80 || token.length > 80 || !/^[\w.\-]+$/.test(id)) return refuse('ERROR', 'No id or token supplied to websocket server');
    if (key !== KEY) return refuse('ERROR', 'Invalid key provided');
    const all = this.ctx.getWebSockets();
    for (const old of this.ctx.getWebSockets(id)) {
      const a = old.deserializeAttachment() || {};
      if (a.token !== token && Date.now() - (a.seen || 0) < STALE_MS) return refuse('ID-TAKEN', 'ID is taken');   // somebody else has this id and is alive
      try { old.close(1000, 'replaced') } catch (_) {}   // same token = reconnect; a silent old socket (no heartbeat for 30 s) is dead
    }
    if (all.length >= MAX_SOCKETS) return refuse('ERROR', 'Server has reached its concurrent user limit');
    this.ctx.acceptWebSocket(server, [id]);
    server.serializeAttachment({ id, token, seen: Date.now() });
    server.send(JSON.stringify({ type: 'OPEN' }));
    return new Response(null, { status: 101, webSocket: client });
  }

  webSocketMessage(ws, data) {
    if (typeof data !== 'string' || data.length > MAX_MSG) return;
    const a = ws.deserializeAttachment() || {};
    const t = Date.now(), r = this.rl.get(ws) || { n: 60, t };
    r.n = Math.min(60, r.n + (t - r.t) * 0.03); r.t = t; this.rl.set(ws, r);
    if (--r.n < 0) return;   // more than about 30 messages a second from one socket: dropped
    let m; try { m = JSON.parse(data) } catch (_) { return }
    if (!m || typeof m.type !== 'string') return;
    if (m.type === 'HEARTBEAT') { if (t - (a.seen || 0) > 4000) { a.seen = t; ws.serializeAttachment(a) } return }
    if (!RELAY.has(m.type) || typeof m.dst !== 'string') return;
    a.seen = t; ws.serializeAttachment(a);
    const out = JSON.stringify({ type: m.type, src: a.id, dst: m.dst, payload: m.payload });
    const dst = this.ctx.getWebSockets(m.dst);
    if (dst.length) { try { dst[0].send(out) } catch (_) {} return }
    // the other side is not connected: somebody who wants to connect is told at once (the PeerJS server waits 5 s), everything else is dropped
    if (m.type === 'OFFER') { try { ws.send(JSON.stringify({ type: 'EXPIRE', src: m.dst, dst: a.id })) } catch (_) {} }
  }

  webSocketClose(ws, code) { this.rl.delete(ws); try { ws.close(code === 1005 ? 1000 : code) } catch (_) {} }
  webSocketError(ws) { this.rl.delete(ws) }
}
