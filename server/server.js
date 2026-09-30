#!/usr/bin/env node
/*
  Snackdown LAN server. No npm packages needed, just Node 18+.

    node server/server.js            (port 8080)
    node server/server.js 3000       (other port)

  It runs the real game rules (the same code as game.html) without a screen, including the bots,
  and serves the page. Friends open http://<your-ip>:8080 in their browser.
*/
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const vm = require('vm');
const os = require('os');

const PORT = +process.argv[2] || +process.env.PORT || 8080;
const ROOT = path.join(__dirname, '..');
const GAME = path.join(ROOT, 'game.html');
const PAGE = process.env.SNACK_PAGE || (fs.existsSync(path.join(ROOT, 'index.html')) ? path.join(ROOT, 'index.html') : GAME);

/* ---------- load the game code into a sandbox with a fake browser ---------- */
function stub() {
  const f = function () {};
  return new Proxy(f, {
    get(t, k) {
      if (k === Symbol.toPrimitive) return () => '';
      if (k === 'then') return undefined;
      if (k in t) return t[k];
      return stub();
    },
    set(t, k, v) { t[k] = v; return true; },
    apply() { return stub(); },
    construct() { return stub(); },
  });
}
const html = fs.readFileSync(GAME, 'utf8');
const code = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const sandbox = {
  __SERVER__: true, console, Math, Date, JSON, Object, Array, Set, Map, Number, String, Symbol, Promise, Proxy,
  performance, setTimeout, clearTimeout, setInterval, clearInterval,
  innerWidth: 1280, innerHeight: 720, devicePixelRatio: 1,
  requestAnimationFrame: () => 0, addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false }),
  localStorage: { getItem: () => null, setItem() {} },
  document: stub(), Audio: stub(),
};
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'game.js' });
const sim = sandbox.__sim;
if (!sim) throw new Error('game.html did not expose the server API');

/* ---------- tiny WebSocket implementation (RFC 6455, text frames only) ---------- */
const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
function frame(str) {
  const data = Buffer.from(str, 'utf8'), n = data.length;
  let head;
  if (n < 126) head = Buffer.from([0x81, n]);
  else if (n < 65536) { head = Buffer.alloc(4); head[0] = 0x81; head[1] = 126; head.writeUInt16BE(n, 2); }
  else { head = Buffer.alloc(10); head[0] = 0x81; head[1] = 127; head.writeBigUInt64BE(BigInt(n), 2); }
  return Buffer.concat([head, data]);
}
const clients = new Map();
let nextCid = 1;

function onUpgrade(req, socket) {
  const key = req.headers['sec-websocket-key'];
  if (!key || (req.headers.upgrade || '').toLowerCase() !== 'websocket') { socket.destroy(); return; }
  const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');
  socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ' + accept + '\r\n\r\n');
  socket.setNoDelay(true);
  const cid = nextCid++;
  const c = { cid, socket, open: true, buf: Buffer.alloc(0), joined: false };
  clients.set(cid, c);
  socket.on('data', (d) => {
    c.buf = Buffer.concat([c.buf, d]);
    if (c.buf.length > 1 << 20) { socket.destroy(); return; }
    for (;;) {
      const b = c.buf;
      if (b.length < 2) return;
      const op = b[0] & 15, masked = !!(b[1] & 128);
      let len = b[1] & 127, off = 2;
      if (len === 126) { if (b.length < 4) return; len = b.readUInt16BE(2); off = 4; }
      else if (len === 127) { if (b.length < 10) return; len = Number(b.readBigUInt64BE(2)); off = 10; }
      if (len > 65536) { socket.destroy(); return; }
      const need = off + (masked ? 4 : 0) + len;
      if (b.length < need) return;
      let payload = b.subarray(off + (masked ? 4 : 0), need);
      if (masked) { const mk = b.subarray(off, off + 4); payload = Buffer.from(payload); for (let i = 0; i < payload.length; i++) payload[i] ^= mk[i & 3]; }
      c.buf = b.subarray(need);
      if (op === 8) { socket.end(); return; }
      if (op === 9) { socket.write(Buffer.concat([Buffer.from([0x8a, payload.length]), payload])); continue; }
      if (op !== 1) continue;
      let m; try { m = JSON.parse(payload.toString('utf8')); } catch (_) { continue; }
      if (m.t === 'join' && !c.joined) { c.joined = true; sim.join(cid, m.name, m.look); console.log('+ ' + String(m.name || 'Player').slice(0, 14) + ' joined (' + sim.count().humans + ' online)'); }
      else if (c.joined) sim.msg(cid, m);
    }
  });
  const bye = (why) => { if (!c.open) return; if (process.env.SNACK_DEBUG) console.log('socket closed:', typeof why === 'object' && why ? why.message : why); c.open = false; clients.delete(cid); if (c.joined) { sim.leave(cid); console.log('- a player left (' + sim.count().humans + ' online)'); } };
  socket.on('close', () => bye('close')); socket.on('error', (e) => bye(e)); socket.on('end', () => bye('end'));
}

/* ---------- http ---------- */
const server = http.createServer((req, res) => {
  const url = req.url.split('?')[0];
  if (url === '/' || url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
    fs.createReadStream(PAGE).pipe(res);
  } else if (url.startsWith('/music/') && /^[\w.\-]+$/.test(url.slice(7))) {
    const f = path.join(ROOT, 'music', url.slice(7));
    if (fs.existsSync(f)) { res.writeHead(200, { 'Content-Type': 'audio/mpeg' }); fs.createReadStream(f).pipe(res); } else { res.writeHead(404); res.end(); }
  } else if (url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(sim.count()));
  } else { res.writeHead(404); res.end('not found'); }
});
server.on('upgrade', onUpgrade);

/* ---------- game loop: 60 simulation steps per second ---------- */
let last = performance.now();
setInterval(() => {
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  let out;
  try { out = sim.step(dt); } catch (e) { console.error('sim error:', e); return; }
  for (const [cid, obj] of out) {
    const c = clients.get(cid);
    if (!c || !c.open || !c.socket.writable) continue;
    if (obj.t === 's' && c.socket.writableLength > 262144) continue;   // slow connection: drop snapshots instead of piling up
    c.socket.write(frame(JSON.stringify(obj)));
  }
}, 1000 / 60);

module.exports = { sim, server };
if (require.main === module || process.env.SNACK_LISTEN) server.listen(PORT, '0.0.0.0', () => {
  console.log('Snackdown server is running on port ' + PORT);
  console.log('  you:      http://localhost:' + PORT);
  for (const list of Object.values(os.networkInterfaces()))
    for (const i of list || []) if (i.family === 'IPv4' && !i.internal) console.log('  friends:  http://' + i.address + ':' + PORT + '   (same Wi-Fi or Tailscale)');
});
