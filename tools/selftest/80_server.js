/* ---------- part 7: the game server: joining, names, looks, snapshots, hand-over checkpoints, bad messages, quests, a full lobby ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'server', async run(env, R) {
  const { X } = env, S = SUITE.stat;
  const opts = { x: 0, y: 0 };

  R.group('Server: names, looks, joining');
  await R.test('names: insults, links and tricks are replaced, normal names stay', t => {
    const bad = ['fuck', 'f u c k', 'fuuuuck', 'f_u_c_k you', 'sh1t', 'Hitler', 'h1tl3r', 'Heil Hitler', 'arschloch', 'Du Hurensohn', 'nigger', 'n1gg3r', 'faggot', 'whore', 'http://evil.example', 'www.x.com', 'discord.gg/abc', 'kys', 'KILLYOURSELF', 'scheiße', 'Fotze', 'bitch', 'pussy', 'dickhead', 'wichser', 'spasti', 'Nazi', 'rape', 'sieg heil'];
    const good = ['Anna', 'Ben', 'Niger', 'Nigel', 'Night', 'Class', 'Massimo', 'Scunthorpe', 'Cassandra', 'Dickens', 'Pro Typer', 'Snackfan 99', 'Ali', 'Léa', 'Müller', 'Sam_01', 'Cookie', 'The Eater', 'Typebite'];
    let missed = [], wrong = [];
    for (const n of bad) if (!X.safeName(n, 'P').bad) missed.push(n); for (const n of good) { const r = X.safeName(n, 'P'); if (r.bad) wrong.push(n); }
    t.eq(missed.length, 0, 'bad names that got through: ' + missed.join(' | ')); t.eq(wrong.length, 0, 'good names that were refused: ' + wrong.join(' | '));
    const r = X.safeName('<script>alert(1)</script>Bob', 'P'); t.ok(!/[<>]/.test(r.name), 'no tags in a name (' + r.name + ')'); t.ok(X.safeName('x'.repeat(100), 'P').name.length <= 14, 'at most 14 characters'); t.eq(X.safeName('', 'Player').name, 'Player', 'an empty name becomes Player');
    t.ok(/^Snacker\d{4}$/.test(X.safeName('Hitler', 'P').name), 'a refused name becomes SnackerNNNN');
    t.ok(!X.safeName('Anna\u0000‮Ben', 'P').name.match(/[\u0000-\u001f‮]/), 'control and direction characters are removed');
    t.info('checked', bad.length + ' bad and ' + good.length + ' good names');
  });
  await R.test('joining: the server applies the name filter itself', t => {
    env.clean(); const a = env.human('Hitler 88'); t.ok(/^Snacker\d{4}$/.test(a.h.name), 'the server renamed "Hitler 88" to ' + a.h.name); const b = env.human('  Anna   '); t.eq(b.h.name, 'Anna', 'spaces are trimmed'); X.srvLeave(a.cid); X.srvLeave(b.cid);
  });
  await R.test('looks: nonsense from a client cannot change anything but the look', t => {
    SUITE.seed(121); env.clean(); const evil = { skin: { x: 1 }, shirt: 'url(javascript:alert(1))', hair: 99999, hs: '__proto__', acc: ['a'], sty: -5, pst: 1e9, shoes: null, face: 'x'.repeat(5000), ex: undefined, x: 99999, y: -5, lvl: 9999, state: 'eaten', protect: 1e9, perks: { gourmet: 99 }, items: ['crystal'], __proto__: { polluted: 1 }, constructor: { prototype: { polluted2: 1 } } };
    const cid = 7777; const h = X.srvJoin(cid, 'Evil', JSON.parse(JSON.stringify(evil)), '', null); const e = h.e;
    t.ok(e.lvl === 1 && e.state === 'move' && !e.perks.gourmet && !e.items.includes('crystal'), 'level, state, perks and items are not taken from the look'); t.ok(e.x > 0 && e.x < X.WORLD && e.protect < env.clock() + 10, 'position and protection are not taken from the look');
    t.ok(({}).polluted === undefined && ({}).polluted2 === undefined, 'no prototype pollution'); for (const k of ['skin', 'shirt', 'hair', 'pants', 'shoes']) t.ok(typeof e[k] === 'string' && e[k].length < 40, k + ' is a short text (' + String(e[k]).slice(0, 12) + ')');
    const lk = X.cleanLook(JSON.parse('{"__proto__":{"a":1},"skin":"#ffcc99"}')); t.ok(!('a' in lk) || lk.a === undefined, 'cleanLook drops unknown keys'); X.srvLeave(cid);
  });
  await R.test('50 players join: all land on free ground, protected, with different ids', t => {
    SUITE.seed(122); env.clean(true); const hs = []; for (let i = 0; i < 50; i++) hs.push(env.human('P' + i, { keep: 1 }));
    let bad = 0; for (const { e } of hs) if (env.inWall(e) || X.waterAt(e.x, e.y) || e.x < 0 || e.y < 0 || e.x > X.WORLD || e.y > X.WORLD) bad++;
    t.eq(bad, 0, 'players placed in a wall, in water or outside'); t.eq(new Set(hs.map(h => h.e.id)).size, 50, 'unique ids'); t.ok(hs.every(h => h.e.protect > env.clock() + X.CFG.players.onlineSpawnProtection - .5), 'all protected for ' + X.CFG.players.onlineSpawnProtection + ' s');
    t.ok(hs.every(h => h.h.key && h.h.key.length > 10), 'every player has a resume key'); for (const h of hs) X.srvLeave(h.cid); t.eq(X.humans.size, 0, 'all gone after leaving'); t.eq(X.ents.filter(e => e.human).length, 0, 'no ghost entities left');
  });

  R.group('Server: what is sent to the players');
  await R.test('snapshots: own data, nearby players only, no secrets', t => {
    SUITE.seed(123); env.clean(true); const p = env.open(300); const A = env.human('Anna', { x: p.x, y: p.y }), B = env.human('Ben', { x: p.x + 300, y: p.y }); const far = env.ent(Math.min(X.WORLD - 100, p.x + X.CFG.network.viewRadius + 400), p.y, 3, { name: 'Far (BOT)' });
    A.e.items = ['crystal', null, null, null, null, null, null]; A.e.perks = { gourmet: 2 }; B.e.items = ['nova', null, null, null, null, null, null]; X.calcStats(A.e); A.h.perksDirty = true;
    const out = env.srv(.5); const snaps = out.filter(m => m[0] === A.cid && m[1].t === 's'); t.ok(snaps.length >= 5, 'about 20 snapshots a second (' + snaps.length + ' in 0.5 s)'); const s = snaps[snaps.length - 1][1], first = snaps[0][1];
    t.ok(s.me && s.me.lvl === +A.e.lvl.toFixed(3) && s.me.it[0] === 'crystal', 'the player gets his own level and items'); t.ok(first.me.perks && first.me.perks.gourmet === 2, 'and his perks (when they change)');
    const ids = s.e.map(r => r.i); t.ok(ids.includes(A.e.id) && ids.includes(B.e.id), 'the nearby player is included'); t.ok(!ids.includes(far.id), 'a bot far outside the view is not sent');
    const rb = s.e.find(r => r.i === B.e.id); const allowed = new Set(['i', 'x', 'y', 'vx', 'vy', 'd', 's', 'l', 'da', 'sl', 'sp', 'ch', 'h', 'ef', 'ep', 'et', 'er', 'pr', 'b', 'bn', 'fl', 'dl', 'f']); t.ok(Object.keys(rb).every(k => allowed.has(k)), 'a record of another player only has public fields: ' + Object.keys(rb).join(','));
    t.ok(!JSON.stringify(rb).includes('nova') && !JSON.stringify(s.e).includes('crystal'), 'other players\' items are not in the data'); t.ok(!JSON.stringify(s).includes(B.h.key) && !JSON.stringify(s).includes(A.h.key), 'no resume keys in snapshots');
    const bytes = JSON.stringify(s).length; t.range('size of one snapshot', bytes, 100, 6000, ' bytes'); X.srvLeave(A.cid); X.srvLeave(B.cid);
  });
  await R.test('snack and box lists on the player\'s screen stay in step with the world (delta messages)', t => {
    SUITE.seed(124); env.clean(true); env.quiet(false); X.foods = []; for (let i = 0; i < 2500; i++) X.spawnFood(false); X.fgBuild(); const hs = []; for (let i = 0; i < 6; i++) hs.push(env.human('D' + i, { keep: 1 })); const A = hs[0]; const R2 = X.CFG.network.dataRadius;
    const client = new Map(); let full = 0, delta = 0, maxStreak = 0, streak = 0, checks = 0, mism = 0; const key = a => a[0] * 16384 + a[1];
    for (const h of hs) { h.e.want = { ux: Math.cos(h.cid), uy: Math.sin(h.cid), f: 1, sprint: false, dash: false }; }
    env.srv(40, (s, out) => { for (const [c, m] of out) { if (c !== A.cid || m.t !== 's') continue;
        if (m.f) { client.clear(); for (const a of m.f) client.set(key(a), a); full++; } else if (m.fa || m.fr) { delta++; if (m.fr) for (const k of m.fr) client.delete(k); if (m.fa) for (const a of m.fa) client.set(key(a), a); }
        const truth = new Set(); for (const f of X.foods) if (Math.abs(f.x - A.e.x) < R2 && Math.abs(f.y - A.e.y) < R2 && !f.gone) truth.add((f.x | 0) * 16384 + (f.y | 0)); let diff = 0; for (const k of truth) if (!client.has(k)) diff++; for (const k of client.keys()) if (!truth.has(k)) diff++;
        checks++; if (diff) { mism++; streak++; maxStreak = Math.max(maxStreak, streak); } else streak = 0; } });
    t.ok(full >= 3 && delta > 20, 'full lists every few seconds (' + full + '), changes in between (' + delta + ')'); t.ok(maxStreak <= 4, 'the lists differ for at most ' + maxStreak + ' snapshots in a row (a new snack shows up one grid update later)'); t.info('snapshots compared', checks + ' (' + mism + ' with a short difference)');
    for (const h of hs) X.srvLeave(h.cid); env.quiet(true);
  });
  await R.test('a hand-over copy of the game: save, restore, players come back as they were', t => {
    SUITE.seed(125); env.clean(true); env.quiet(false); for (let i = 0; i < 40; i++) X.spawnBot(env.clock()); for (let i = 0; i < 1200; i++) X.spawnFood(false); X.fgBuild();
    const hs = []; for (let i = 0; i < 8; i++) { const h = env.human('Q' + i, { keep: 1 }); h.e.lvl = 5 + i * 3.3; h.e.items = ['shield', null, null, null, null, null, null]; h.e.perks = { swift: 1, gourmet: 2 }; X.calcStats(h.e); hs.push(h); } env.srv(8);
    const t0 = SUITE.util.now(); const str = X.srvCheckpoint(); const ms = SUITE.util.now() - t0; const ck = JSON.parse(str); t.range('size of the copy', str.length / 1024, 20, 400, ' KB'); t.range('time to make it', ms, 0, 60, ' ms');
    const before = hs.map(h => ({ key: h.h.key, lvl: h.e.lvl, x: h.e.x, y: h.e.y, items: h.e.items.slice(), perks: Object.assign({}, h.e.perks), name: h.h.name })); const bots = X.ents.filter(e => !e.human && e.state !== 'eaten').map(e => ({ id: e.id, bt: e.bt, spd: e.spd, skill: e.skill, lvl: e.lvl }));
    X.srvRestore(str); t.eq(X.ents.filter(e => e.human).length, 8, 'all 8 players are in the restored world'); t.ok(X.ents.filter(e => !e.human).length >= bots.length - 3, 'the bots are there too (' + X.ents.filter(e => !e.human).length + ' of ' + bots.length + ')');
    let ok = 0; for (const b of before) { const h = X.srvJoin(8800 + ok, b.name, {}, '', b.key); const e = h.e; if (e && e.hkey === b.key && Math.abs(e.lvl - b.lvl) < .01 && Math.hypot(e.x - b.x, e.y - b.y) < 2 && e.items[0] === 'shield' && e.perks.gourmet === 2) ok++; }
    t.eq(ok, 8, 'players that came back with the same level, place, items and perks'); const rb = X.ents.filter(e => !e.human).find(e => bots.find(b => b.id === e.id)); const ob = bots.find(b => b.id === rb.id); t.ok(rb.bt === ob.bt && Math.abs(rb.spd - ob.spd) < 1e-9 && Math.abs(rb.skill - ob.skill) < 1e-9, 'a bot keeps its kind, speed and typing skill');
    env.run(10); t.ok(X.ents.every(e => Number.isFinite(e.x + e.y + e.lvl)), 'the restored world runs without broken numbers'); for (const k of [...X.humans.keys()]) X.srvLeave(k); env.quiet(true);
  });
  await R.test('bad messages: garbage, huge numbers, wrong types never break the server', t => {
    SUITE.seed(126); env.clean(true); const hs = [env.human('F1', { keep: 1 }), env.human('F2', { keep: 1 }), env.human('F3', { keep: 1 })]; let errors = 0, first = null;
    const junk = [null, undefined, 0, 1, 'str', [], {}, { t: null }, { t: 'in' }, { t: 'in', ux: 'a', uy: {}, f: [] }, { t: 'in', ux: 1e308, uy: -1e308, f: 1e9 }, { t: 'in', ux: NaN, uy: Infinity, f: -Infinity }, { t: 'use', s: 1e9 }, { t: 'use', s: {} }, { t: 'choose', i: 'x' }, { t: 'choose', i: -1 }, { t: 'choose', i: 1e9 }, { t: 'prog', x: { a: 1 } }, { t: 'prog', x: 'a'.repeat(1e5) }, { t: 'prog', n: -5 },
      { t: 'respawn' }, { t: '__proto__' }, { t: 'constructor' }, { t: 'ping', c: {} }, { t: 'ping', c: 'x'.repeat(1000) }, { t: 'done' }, JSON.parse('{"t":"in","__proto__":{"ux":5}}'), { t: 'join', name: 'x' }, { t: 'welcome' }];
    for (let i = 0; i < 3000; i++) { const h = hs[i % 3], m = junk[(Math.random() * junk.length) | 0]; try { X.srvMsg(h.cid, m); if (i % 20 === 0) env.srv(.05); } catch (x) { errors++; first = first || x.message + ' for ' + JSON.stringify(m).slice(0, 60); } }
    t.eq(errors, 0, 'messages that threw an error' + (first ? ' (first: ' + first + ')' : '')); t.ok(hs.every(h => h.e && Number.isFinite(h.e.x + h.e.y + h.e.vx + h.e.vy + h.e.stamina)), 'all players still have clean numbers'); t.ok(hs.every(h => h.e.x >= 0 && h.e.x <= X.WORLD), 'and are still inside the map');
    t.ok(({}).ux === undefined, 'no prototype pollution'); for (const h of hs) X.srvLeave(h.cid);
  });
  await R.test('input: direction is a unit vector, huge or NaN input is harmless', t => {
    env.clean(); const p = env.open(300); const a = env.human('Dir', { x: p.x, y: p.y }); X.srvMsg(a.cid, { t: 'in', ux: 1e6, uy: 1e6, f: 5, sp: 1 }); env.srv(.1); const i = a.h.inp; t.near(Math.hypot(i.ux, i.uy), 1, 1e-6, 'direction length 1'); t.ok(i.f <= 1, 'strength at most 1');
    X.srvMsg(a.cid, { t: 'in', ux: NaN, uy: NaN, f: NaN }); env.srv(.2); t.ok(Number.isFinite(a.e.x + a.e.y), 'NaN input leaves a clean position'); X.srvLeave(a.cid);
  });

  R.group('Server: quests and respawn');
  await R.test('quests: arrive on time, can be completed, pay out, expire', t => {
    SUITE.seed(127); env.clean(true); const p = env.open(300); const a = env.human('Quest', { x: p.x, y: p.y }); a.e.questNext = undefined; let started = null; const t0 = env.clock(); env.srv(X.QU.firstDelay[1] + 15, (s, out) => { for (const [c, m] of out) if (c === a.cid && m.t === 's' && m.me.q && started === null) started = env.clock() - t0; if (started !== null) return false; });
    t.ok(started !== null, 'a quest arrived'); t.range('first quest after', started, X.QU.firstDelay[0] - 5, X.QU.firstDelay[1] + 8, ' s'); const q = a.e.quest; t.ok(q && ['snack', 'box', 'water'].includes(q.type) && q.n >= 1 && q.end > env.clock(), 'a valid quest: ' + (q && q.type));
    a.e.quest = { type: 'snack', kind: 'apple', n: 2, have: 0, mult: 1.5, end: env.clock() + 60, total: 60 }; a.e.protect = 1e9; a.e.state = 'move'; X.foods = [{ x: a.e.x, y: a.e.y + 4, t: 'apple', bob: 0, inside: false }, { x: a.e.x + 5, y: a.e.y + 4, t: 'burger', bob: 0, inside: false }]; X.fgBuild(); env.srv(2);
    t.eq(a.e.quest && a.e.quest.have, 1, 'eating the right snack counts, a different one does not'); const l0 = X.xpOf(a.e.lvl); X.foods = [{ x: a.e.x, y: a.e.y + 4, t: 'apple', bob: 0, inside: false }]; X.fgBuild(); env.srv(2);
    t.eq(a.e.quest, null, 'completed'); t.ok(X.xpOf(a.e.lvl) - l0 > X.lvlCost(a.e.lvl) * 1.0, 'the reward is about ' + 1.5 + ' x the cost of a level'); a.e.quest = { type: 'box', n: 2, have: 0, mult: 1, end: env.clock() + 1, total: 1 }; env.srv(1.5); t.eq(a.e.quest, null, 'an expired quest is removed'); X.srvLeave(a.cid);
  });

  R.group('Server: a full lobby');
  const NP = R.deep ? 50 : 30, SEC = R.deep ? 60 : 30;
  await R.test(NP + ' players and the bots for ' + SEC + ' s: speed of the host, traffic, nothing breaks', t => {
    SUITE.seed(128); env.clean(true); env.quiet(false); for (let i = 0; i < 60; i++) X.spawnBot(env.clock()); for (let i = 0; i < 2500; i++) X.spawnFood(false); for (let i = 0; i < 700; i++) X.spawnFood(true); X.fgBuild();
    const hs = []; for (let i = 0; i < NP; i++) hs.push(env.human('L' + i, { keep: 1 })); const bytes = new Map(), steps = []; let nan = 0, msgs = 0, errors = 0;
    for (let s = 0; s < SEC * 60; s++) { if (s % 40 === 0) for (const h of hs) if (h.h.e && h.h.e.state === 'move') { const a = Math.random() * 6.28; X.srvMsg(h.cid, { t: 'in', ux: Math.cos(a), uy: Math.sin(a), f: 1, sp: Math.random() < .3 }); }
      env.advance(1 / 60); const t0 = SUITE.util.now(); let out; try { out = X.srvStep(1 / 60); } catch (x) { errors++; t.note('error: ' + x.message); continue; } steps.push(SUITE.util.now() - t0);
      if (s > 300) for (const [cid, m] of out) { const l = JSON.stringify(m).length; bytes.set(cid, (bytes.get(cid) || 0) + l); msgs++; }
      for (const [, m] of out) if (m.t === 'dead') { /* nobody respawns here, the lobby shrinks a little */ } }
    for (const e of X.ents) if (!Number.isFinite(e.x + e.y + e.lvl)) nan++;
    steps.sort((a, b) => a - b); const avg = S.mean(steps), p99 = steps[Math.floor(steps.length * .99)], el = SEC - 5, perClient = S.mean([...bytes.values()]) / el / 1024;
    t.eq(errors, 0, 'errors in the server step'); t.eq(nan, 0, 'entities with broken numbers'); t.range('average step of the host on this device', avg, 0, R.deep ? 14 : 12, ' ms'); t.range('slowest 1 % of steps', p99, 0, 40, ' ms'); t.range('traffic to every player', perClient, 1, 40, ' KB/s'); t.range('upload of the host for all players', perClient * NP, 1, NP * 40, ' KB/s');
    const t1 = SUITE.util.now(), ck = X.srvCheckpoint(); t.range('hand-over copy at this size', ck.length / 1024, 20, 600, ' KB'); t.range('time to make the copy', SUITE.util.now() - t1, 0, 80, ' ms'); t.info('players alive at the end', X.ents.filter(e => e.human && e.state !== 'eaten').length + ' of ' + NP);
    for (const k of [...X.humans.keys()]) X.srvLeave(k); env.clean(); env.quiet(true);
  });
} });
})(typeof self !== 'undefined' ? self : globalThis);
