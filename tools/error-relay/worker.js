// Snackdown error relay - a Cloudflare Worker (free plan is enough).
// The game POSTs error reports here; the worker appends one JSON line per report to errors/YYYY-MM-DD.jsonl
// in a PRIVATE GitHub repo. The GitHub token lives only here (as a secret), never in index.html.
//
// Worker settings (Cloudflare dashboard -> your worker -> Settings -> Variables and Secrets):
//   GITHUB_TOKEN  secret  fine-grained token, only the log repo, permission "Contents: Read and write"
//   REPO          text    e.g. JustRealTime/smackdown-errors   (must be a private repo)
//   BRANCH        text    optional, default main
// Setup guide (German): docs/fehler-upload.md
//
// What is stored: time, build, a random per-tab id, browser (user agent), screen, mode (host/client/solo, room), fps line, error messages
// with code lines, and the tester's own note for manual reports. Not stored: IP address, player name.

const MAX_BODY = 16000;            // bytes per report
const PER_IP_PER_MIN = 20;         // best effort, counted per worker instance (testers at one place share an IP)
const PER_INSTANCE_PER_HOUR = 300; // hard stop against floods (each report is one commit in the log repo)
const ROTATE_AT = 200000;          // start errors/<day>-2.jsonl etc. when a day file gets bigger than this (keeps CPU time low)

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
const hits = new Map();
let hour = { start: 0, n: 0 };

const reply = (status, text) => new Response(text, { status, headers: { ...CORS, 'Content-Type': 'text/plain' } });
const str = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f\u007f]/g, ' ').slice(0, n);

function clean(p) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
  const errors = (Array.isArray(p.errors) ? p.errors : []).slice(0, 12).filter(e => e && typeof e === 'object').map(e => ({
    t: str(e.t, 30), src: str(e.src, 20), m: str(e.m, 300), at: str(e.at, 200), n: Math.min(1e6, Math.max(1, Math.floor(+e.n) || 1))
  }));
  const kind = p.kind === 'report' ? 'report' : 'error';
  if (kind === 'error' && !errors.length) return null;
  return {
    at: new Date().toISOString(), kind, build: str(p.build, 12), sid: str(p.sid, 12), ua: str(p.ua, 300), screen: str(p.screen, 120),
    mode: str(p.mode, 240), game: str(p.game, 120), speed: str(p.speed, 200), note: str(p.note, 600), errors
  };
}

const b64enc = s => { const b = new TextEncoder().encode(s); let x = ''; for (let i = 0; i < b.length; i += 0x8000) x += String.fromCharCode(...b.subarray(i, i + 0x8000)); return btoa(x); };
const b64dec = c => { const x = atob(String(c).replace(/\s/g, '')); const b = new Uint8Array(x.length); for (let i = 0; i < x.length; i++) b[i] = x.charCodeAt(i); return new TextDecoder().decode(b); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function append(env, rec) {
  const branch = String(env.BRANCH || 'main').trim(), day = rec.at.slice(0, 10), repo = String(env.REPO).trim();
  const hd = { Authorization: 'Bearer ' + String(env.GITHUB_TOKEN).trim(), Accept: 'application/vnd.github+json', 'User-Agent': 'snackdown-error-relay', 'X-GitHub-Api-Version': '2022-11-28' };
  const line = JSON.stringify(rec) + '\n';
  for (let attempt = 0; attempt < 5; attempt++) {
    let path, sha, old = '';
    for (let part = 1; part <= 20; part++) {   // find today's file that still has room
      path = 'errors/' + day + (part > 1 ? '-' + part : '') + '.jsonl';
      const g = await fetch('https://api.github.com/repos/' + repo + '/contents/' + path + '?ref=' + encodeURIComponent(branch), { headers: hd });
      if (g.status === 404) { sha = undefined; old = ''; break; }
      if (!g.ok) throw new Error(await explain(g, repo, branch, hd, 'read'));
      const j = await g.json();
      if (j.size > ROTATE_AT) continue;
      sha = j.sha; old = b64dec(j.content || ''); break;
    }
    const body = { message: 'error report ' + rec.build + ' ' + rec.kind + ' ' + rec.sid, content: b64enc(old + line), branch };
    if (sha) body.sha = sha;
    const r = await fetch('https://api.github.com/repos/' + repo + '/contents/' + path, { method: 'PUT', headers: { ...hd, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (r.ok) return path;
    if (r.status !== 409 && r.status !== 422) throw new Error(await explain(r, repo, branch, hd, 'write'));
    await sleep(150 + Math.random() * 500 * (attempt + 1));   // somebody else wrote the file in between: read again and retry
  }
  throw new Error('GitHub write: too many conflicts');
}

// turns GitHub's short answers (a private repo the token cannot see is just "404 Not Found") into a message that says what to fix
async function explain(res, repo, branch, hd, what) {
  const raw = 'GitHub ' + what + ' ' + res.status + ': ' + (await res.text()).slice(0, 160);
  try {
    if (res.status === 401) return raw + ' -> the token is wrong or expired: create a new one and replace the secret GITHUB_TOKEN.';
    const rr = await fetch('https://api.github.com/repos/' + repo, { headers: hd });
    if (rr.status === 404) {
      const u = await fetch('https://api.github.com/user', { headers: hd });
      const who = u.ok ? (await u.json()).login : 'unknown';
      return raw + ' -> the token (account ' + who + ') cannot see the repo "' + repo + '". Check the variable REPO, and in the token: Repository access = Only select repositories with this repo, then Update.';
    }
    if (!rr.ok) return raw + ' -> repo check returned ' + rr.status;
    const br = await fetch('https://api.github.com/repos/' + repo + '/branches/' + encodeURIComponent(branch), { headers: hd });
    if (br.status === 404) return raw + ' -> the repo has no branch "' + branch + '". Add a README on GitHub or set the variable BRANCH.';
    const perm = (await rr.json()).permissions;
    return raw + ' -> the repo is visible but writing is refused' + (perm ? ' (permissions ' + JSON.stringify(perm) + ')' : '') + '. Give the token "Contents: Read and write".';
  } catch (_) { return raw; }
}

export default {
  async fetch(req, env) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
    if (req.method !== 'POST') return reply(200, 'snackdown error relay is running');
    if (!env.GITHUB_TOKEN || !env.REPO) return reply(500, 'relay not configured: set GITHUB_TOKEN and REPO');
    const now = Date.now(), ip = req.headers.get('CF-Connecting-IP') || 'local';
    const h = (hits.get(ip) || []).filter(t => now - t < 60000);
    if (h.length >= PER_IP_PER_MIN) return reply(429, 'too many reports, slow down');
    h.push(now); hits.set(ip, h); if (hits.size > 5000) hits.clear();   // only kept in memory for the rate limit, never written
    if (now - hour.start > 3600000) hour = { start: now, n: 0 };
    if (++hour.n > PER_INSTANCE_PER_HOUR) return reply(429, 'relay is busy');
    const text = await req.text();
    if (text.length > MAX_BODY) return reply(413, 'report too big');
    let p; try { p = JSON.parse(text); } catch (_) { return reply(400, 'not JSON'); }
    const rec = clean(p);
    if (!rec) return reply(400, 'not a report');
    try { return reply(200, 'saved ' + await append(env, rec)); }
    catch (e) { return reply(502, String(e && e.message || e)); }
  }
};
