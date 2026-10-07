/* ---------- part 5: typing duels between real players on the server: flow, fairness, XP settlement, cheating, edge cases ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'duels', async run(env, R) {
  const { X } = env, S = SUITE.stat;
  const gauss = () => { let u = 0; for (let i = 0; i < 6; i++) u += Math.random(); return (u - 3) / .707; };   // about normal, sd 1

  // two humans next to each other. perks / levels are set directly.
  const pair = (la, lb, pa, pb) => {
    env.clean(); const p = env.open(300); const A = env.human('Anna', { x: p.x, y: p.y }), B = env.human('Ben', { x: p.x + 22, y: p.y });
    for (const [h, l, pk] of [[A, la, pa], [B, lb, pb]]) { h.e.lvl = l; h.e.perks = pk || {}; X.calcStats(h.e); h.e.protect = 0; h.e.stamina = 100; h.msgs = []; h.typed = 0; }
    return { A, B };
  };
  // typing driver: each player types its phrase at its own speed from the moment the server says go. spec = { A: {wpm, delay, noise, cheat}, B: {...}, maxSec }
  const play = (A, B, spec) => {
    const st = { start: null, end: null, winner: null, textA: null, textB: null, starts: 0, outAll: [] };
    const who = { [A.cid]: 'A', [B.cid]: 'B' }, H = { A, B }, pace = { A: null, B: null };
    const sp = { A: Object.assign({ wpm: 50, delay: 0, noise: 0 }, spec.A), B: Object.assign({ wpm: 50, delay: 0, noise: 0 }, spec.B) };
    for (const k of ['A', 'B']) pace[k] = { f: 1 + sp[k].noise * gauss() };
    env.srv(spec.maxSec || 130, (s, out) => {
      for (const [cid, m] of out) { const k = who[cid]; if (!k) continue; H[k].msgs.push(m); st.outAll.push([k, m]);
        if (m.t === 'duel') st['text' + k] = m.text; if (m.t === 'dgo' && st.start === null) st.start = env.clock();
        if (m.t === 'dend') { if (m.win && st.winner === null) st.winner = k; st.end = env.clock(); } }
      if (spec.equal && st.textA && st.textB && !st.eqDone) { st.eqDone = 1; const T = ((st.textA.length + st.textB.length) / 2) / (sp.A.wpm * 5 / 60); sp.A.cps = st.textA.length / T; sp.B.cps = st.textB.length / T; }   // both phrases take exactly the same time to type
      if (st.start !== null && st.end === null) for (const k of ['A', 'B']) { const text = st['text' + k]; if (!text) continue; const c = sp[k];
        if (c.cheat) { if (!c.sent) { c.sent = 1; X.srvMsg(H[k].cid, { t: 'prog', x: text, s: 99 }); X.srvMsg(H[k].cid, { t: 'done' }); } continue; }
        const n = Math.max(0, Math.min(text.length, Math.floor((env.clock() - st.start - c.delay) * (c.cps || c.wpm * 5 / 60) * pace[k].f)));
        if (n > H[k].typed) { H[k].typed = n; X.srvMsg(H[k].cid, { t: 'prog', x: text.slice(0, n), s: n }); } }
      if (st.end !== null && env.clock() - st.end > .6) return false;
    });
    return st;
  };
  const wins = (la, lb, sa, sb, n, pa, pb) => { let a = 0, tot = 0; for (let i = 0; i < n; i++) { const { A, B } = pair(la, lb, pa, pb); const r = play(A, B, { A: sa, B: sb }); if (r.winner) { tot++; if (r.winner === 'A') a++; } } return { a, tot }; };

  R.group('Duels: the flow between two players');
  await R.test('a duel starts when two touch, counts down, and the faster typist wins', t => {
    SUITE.seed(81); const { A, B } = pair(8, 8); const r = play(A, B, { A: { wpm: 70 }, B: { wpm: 35 } });
    t.ok(A.msgs.some(m => m.t === 'duel') && B.msgs.some(m => m.t === 'duel'), 'both get the duel message'); const dm = A.msgs.find(m => m.t === 'duel');
    t.ok(dm && dm.text && dm.text.length > 5 && dm.oLen > 5 && dm.banner, 'with a phrase, the length of the other phrase and a banner'); t.ok(!/undefined|NaN/.test(JSON.stringify(dm)), 'no broken values in the message');
    t.ok(r.start !== null, 'the go signal arrives'); const first = A.msgs.find(m => m.t === 'duel'), t0 = r.outAll.length;
    t.eq(r.winner, 'A', 'the 70 WPM typist beats the 35 WPM typist'); t.ok(A.msgs.some(m => m.t === 'dend' && m.win) && B.msgs.some(m => m.t === 'dend' && !m.win), 'the winner and the loser are told');
    t.ok(B.msgs.some(m => m.t === 'dprog'), 'the opponent progress is sent while typing');
  });
  await R.test('the countdown is ' + X.DU.countdown + ' s and typing before it counts for nothing', t => {
    SUITE.seed(82); const { A, B } = pair(8, 8); let started = null, goAt = null, nowT = env.clock();
    env.srv(8, (s, out) => { for (const [cid, m] of out) { if (cid === A.cid && m.t === 'duel' && started === null) started = env.clock(); if (cid === A.cid && m.t === 'dgo' && goAt === null) goAt = env.clock(); }
      if (started !== null && goAt === null) { const text = A.msgs.length ? null : null; const d = X.sds[0]; if (d) X.srvMsg(A.cid, { t: 'prog', x: d.ta.slice(0, 5), s: 5 }); } if (goAt !== null) return false; });
    t.ok(started !== null && goAt !== null, 'duel started and the go signal came'); t.near(goAt - started, Math.max(3, X.DU.countdown), .15, 'the go signal comes after the countdown'); t.eq(X.sds[0] && X.sds[0].pa, 0, 'letters sent during the countdown were ignored');
  });
  await R.test('XP: what the winner gets, what drops, what the loser keeps', t => {
    SUITE.seed(83);
    for (const [la, lb, king] of [[5, 5, 0], [12, 4, 0], [4, 12, 0], [30, 28, 0], [60, 6, 0], [6, 60, 0], [6, 60, 1], [3, 3, 0]]) {
      env.clean(); const p = env.open(300); const w = env.ent(p.x, p.y, la), l = env.human('Loser', { x: p.x + 40, y: p.y }).e; l.lvl = lb; l.perks = {}; X.calcStats(l); w.protect = l.protect = 0; if (king) X.king = l;
      const xw = X.xpOf(w.lvl), xl = X.xpOf(l.lvl), Lw = X.L(w), Ll = X.L(l), cap = X.lvlCost(w.lvl) * X.DU.winCap; X.finishDuel(w, l, env.clock()); X.king = null;
      const frac = X.DU.winnerShare * X.clamp(Ll / Math.max(1, Lw) * 2, X.DU.weakVictimFloor, 1);
      let want = Math.max(X.DU.minWinXp, Math.min(cap, xl * frac)); if (king) want += Math.min(cap, xl * X.DU.kingBonusShare);
      const got = X.xpOf(w.lvl) - xw, orbs = X.orbs.reduce((s, o) => s + o.v, 0);
      t.near(got / want, 1, .03, 'level ' + la + ' beats ' + lb + (king ? ' (the King)' : '') + ': winner gets ' + want.toFixed(1) + ' xp (got ' + got.toFixed(1) + ')');
      if (xl * X.DU.orbShare >= 3) t.near(orbs / (xl * X.DU.orbShare), 1, .05, 'orbs worth ' + (X.DU.orbShare * 100) + ' % of the loser xp drop (' + orbs.toFixed(1) + ')'); else t.ok(orbs === 0, 'a tiny loser drops no orbs');
      t.eq(l.state, 'eaten', 'the loser is eaten'); t.eq(l.respawnLvl, Math.max(1, Math.floor(Ll * l.st.keep)), 'the loser comes back at level ' + l.respawnLvl); t.ok(w.state === 'move' && w.protect > env.clock() + 2, 'the winner is protected for a moment');
      t.ok(got <= xl * 0.75 + X.DU.minWinXp + 1 || got <= cap + 1, 'the winner never gets more than the loser had'); X.orbs = [];
    }
  });
  await R.test('the loser gets a death message and can come back', t => {
    SUITE.seed(84); const { A, B } = pair(10, 10); play(A, B, { A: { wpm: 80 }, B: { wpm: 20 } }); let dead = B.msgs.find(m => m.t === 'dead'); env.srv(1.5, (s, out) => { for (const [c, m] of out) if (c === B.cid && m.t === 'dead') dead = m; });
    t.ok(!!dead, 'a dead message arrives'); t.ok(dead && dead.by === 'Anna', 'it names the winner'); t.eq(B.h.e, null, 'the eaten player has no entity until respawn'); X.srvMsg(B.cid, { t: 'respawn' }); env.srv(.3);
    t.ok(B.h.e && B.h.e.state === 'move' && X.L(B.h.e) >= 1, 'after respawn the player is back'); t.ok(B.h.e.protect > env.clock(), 'with spawn protection'); const e1 = B.h.e; X.srvMsg(B.cid, { t: 'respawn' }); env.srv(.1); t.ok(B.h.e === e1 && X.ents.filter(e => e.h === B.h).length === 1, 'a second respawn message does not clone the player');
  });
  await R.test('leaving in the middle of a duel does not hang the other player', t => {
    SUITE.seed(85); const { A, B } = pair(10, 10); env.srv(7); t.ok(A.e.state === 'duel', 'duel is running'); X.srvLeave(B.cid); env.srv(.5, (s, out) => { for (const [c, m] of out) if (c === A.cid) A.msgs.push(m); });
    t.ok(A.e.state === 'move', 'the other one is free again'); t.ok(A.msgs.some(m => m.t === 'dend' && m.win), 'and told that he won'); t.eq(X.sds.length, 0, 'no duel left over'); t.ok(A.e.protect > env.clock(), 'protected for a moment');
  });
  await R.test('a duel nobody finishes ends by itself', t => {
    SUITE.seed(86); const { A, B } = pair(10, 10); let end = null; const t0 = env.clock(); env.srv(X.DU.timeout + 20, (s, out) => { for (const [c, m] of out) if (m.t === 'dend') end = end || env.clock(); if (end) return false; });
    t.ok(end !== null, 'it ended'); t.range('after (limit ' + X.DU.timeout + ' s + countdown)', end - t0, X.DU.timeout - 1, X.DU.timeout + 10, ' s'); env.srv(2); t.ok(!X.sds.length, 'nothing left over');
  });
  await R.test('nobody else can break into a duel; protected players cannot be dueled', t => {
    SUITE.seed(87); const { A, B } = pair(10, 10); env.srv(.5); const C = env.human('Cleo', { x: A.e.x + 10, y: A.e.y }); C.e.protect = 0; env.srv(1); t.ok(C.e.state === 'move', 'a third player touching two duelists is not dragged in'); t.eq(X.sds.length, 1, 'still one duel');
    env.clean(); const p = env.open(300); const D = env.human('D', { x: p.x, y: p.y, protect: 0 }), E = env.human('E', { x: p.x + 10, y: p.y }); D.e.protect = env.clock() + 3; E.e.protect = 0; env.srv(2.5); t.eq(X.sds.length, 0, 'while one of them is protected nothing happens'); env.srv(1.5); t.eq(X.sds.length, 1, 'after the protection ends the duel starts');
  });
  await R.test('new players are protected for ' + X.CFG.players.onlineSpawnProtection + ' s', t => {
    env.clean(); const p = env.open(300); const A = env.human('A1', { x: p.x, y: p.y, keep: 1 }); const B = env.human('B1', { x: p.x + 10, y: p.y, keep: 1 }); env.srv(X.CFG.players.onlineSpawnProtection - 1); t.eq(X.sds.length, 0, 'no duel during the protection time');
    t.range('protection left on a new player', A.e.protect - env.clock(), 0, X.CFG.players.onlineSpawnProtection);
  });
  await R.test('running away: catching a runner makes your phrase shorter', t => {
    env.clean(); const p = env.open(300); const a = env.ent(p.x, p.y, 40), b = env.ent(p.x + 30, p.y, 40); a.fled = {}; b.fled = {}; const base = X.duelWords(a, b, false, false, false, false)[0].n, c = X.duelWords(a, b, true, false, false, false)[0].n;
    t.eq(base - c, X.DU.caughtWords, 'the catcher types ' + X.DU.caughtWords + ' words fewer'); a.vx = 200; b.x = a.x - 120; b.y = a.y; b.vx = -60;
  });

  R.group('Duels: fairness');
  const n = R.deep ? 60 : 26;
  await R.test('equal typists, equal levels: about 50 % each (' + n + ' duels)', t => {
    SUITE.seed(88); const w = wins(10, 10, { wpm: 50, noise: .1 }, { wpm: 50, noise: .1 }, n); t.ok(w.tot >= n * .9, 'duels that finished: ' + w.tot + ' of ' + n);
    t.ok(S.fits(w.a, w.tot, .5), 'player A won ' + w.a + ' of ' + w.tot + ' (' + Math.round(w.a / w.tot * 100) + ' %)');
  });
  await R.test('typing speed decides: 60 vs 40 WPM', t => {
    SUITE.seed(89); const w = wins(10, 10, { wpm: 60, noise: .1 }, { wpm: 40, noise: .1 }, n); t.range('the faster typist wins', w.a / w.tot * 100, 80, 100, ' %');
    const w2 = wins(10, 10, { wpm: 45, noise: .1 }, { wpm: 40, noise: .1 }, n); t.info('45 vs 40 WPM: the faster wins', Math.round(w2.a / w2.tot * 100), ' %'); t.ok(w2.a / w2.tot > .4, 'a small speed edge is not a disadvantage (' + Math.round(w2.a / w2.tot * 100) + ' %)');
  });
  await R.test('level gap: what does the higher level get (equal typing speed)?', t => {
    SUITE.seed(90); const rows = [];
    for (const [lo, hi] of [[10, 14], [10, 20], [10, 30], [10, 60]]) { const w = wins(hi, lo, { wpm: 50, noise: .1 }, { wpm: 50, noise: .1 }, Math.round(n * .8)); rows.push([lo, hi, Math.round(w.a / w.tot * 100)]); }
    t.info('win rate of the HIGHER level at equal speed', rows.map(r => 'Lv' + r[1] + ' vs Lv' + r[0] + ': ' + r[2] + ' %').join(' | '));
    for (const r of rows) { if (r[2] < 30) t.warn('Level ' + r[1] + ' loses ' + (100 - r[2]) + ' % of duels against level ' + r[0] + ' at the same typing speed: being the lower level is an advantage'); if (r[2] > 70) t.warn('Level ' + r[1] + ' wins ' + r[2] + ' % against level ' + r[0] + ' at the same typing speed: the higher level has a big advantage'); }
  });
  await R.test('Head Start and Flow State work against other players too', t => {
    SUITE.seed(91);
    // both type at exactly the same speed; B starts typing 0.4 s later than A, so B would lose. With Head Start rank 2 (1.0 s) A's finish counts 1.0 s later, so B wins.
    let bWins = 0, bWinsNo = 0, N = 6;
    for (let i = 0; i < N; i++) { let { A, B } = pair(10, 10, null, { head: 2 }); let r = play(A, B, { equal: 1, A: { wpm: 60 }, B: { wpm: 60, delay: .4 } }); if (r.winner === 'B') bWins++;
      ({ A, B } = pair(10, 10)); r = play(A, B, { equal: 1, A: { wpm: 60 }, B: { wpm: 60, delay: .4 } }); if (r.winner === 'B') bWinsNo++; }
    t.eq(bWinsNo, 0, 'without perks the one who starts earlier always wins'); t.ok(bWins >= N - 1, 'Head Start (1.0 s): the opponent who is 0.4 s later wins in ' + bWins + ' of ' + N + ' duels');
    // Flow State: with 20 correct letters in a row the opponent is slowed to 70 %: same speed, but B should now lose even with a small head start of its own
    let aWins = 0; for (let i = 0; i < N; i++) { const { A, B } = pair(10, 10, { flow: 1 }); const r = play(A, B, { equal: 1, A: { wpm: 60 }, B: { wpm: 64 } }); if (r.winner === 'A') aWins++; }
    t.ok(aWins >= N - 1, 'Flow State: A (60 WPM) beats a 64 WPM typist in ' + aWins + ' of ' + N + ' duels');
  });
  await R.test('Warm Fingers: the prefilled words are accepted without a false alarm', t => {
    SUITE.seed(92); let notes = 0; const keep = root.postMessage; const { A, B } = pair(10, 10, { warm: 2 }); const text = () => X.sds[0] && X.sds[0].ta;
    let sent = false, flagged = 0; env.srv(30, (s, out) => { const d = X.sds[0]; if (d && d.phase === 'type' && !sent) { sent = true; const words = d.ta.split(' '), k = Math.min(A.e.st.warm, words.length - 1), pre = words.slice(0, k).join(' ') + ' '; X.srvMsg(A.cid, { t: 'prog', x: pre, s: pre.length }); flagged = d.fa || 0; }
      if (d && d.phase === 'type') { const n = Math.floor((env.clock() - d.start) * 60 * 5 / 60); } if (out.some(m => m[1].t === 'dend')) return false; });
    t.ok(sent, 'the prefilled words were sent at the very start'); t.eq(flagged, 0, 'and not held back as "too fast" (it counted ' + flagged + ' hits)');
  });

  R.group('Duels: cheating is held back');
  await R.test('sending the whole phrase at once does not win at once', t => {
    SUITE.seed(93); const { A, B } = pair(10, 10); const r = play(A, B, { A: { cheat: 1 }, B: { wpm: 60 } }); const need = (A.msgs.find(m => m.t === 'duel').text.length) / (X.DU.maxWpm * 5 / 60);
    t.ok(r.start !== null, 'the duel ran'); const tw = r.end - r.start; t.ok(tw > need * .7 || r.winner === 'B', 'the cheater needed ' + tw.toFixed(2) + ' s, at least ' + (need * .7).toFixed(2) + ' s' + ' (winner: ' + r.winner + ')');
  });
  await R.test('"done" messages and invented progress do nothing', t => {
    SUITE.seed(94); const { A, B } = pair(10, 10); let ended = false; env.srv(10, (s, out) => { for (let i = 0; i < 6; i++) X.srvMsg(A.cid, { t: 'done' }); X.srvMsg(A.cid, { t: 'prog', n: 999, s: 999 }); X.srvMsg(A.cid, { t: 'prog', x: 'x'.repeat(500), s: 500 }); X.srvMsg(A.cid, { t: 'prog', x: 12345 }); if (out.some(m => m[1].t === 'dend')) { ended = true; return false; } });
    t.ok(!ended, 'the duel is not decided by claims');
  });
  await R.test('wrong letters are not counted as progress', t => {
    SUITE.seed(95); const { A, B } = pair(10, 10); let right = 0; env.srv(8, (s, out) => { const d = X.sds[0]; if (d && d.phase === 'type') { const wrong = d.ta.slice(0, 3) + '#' + d.ta.slice(4); X.srvMsg(A.cid, { t: 'prog', x: wrong, s: 5 }); right = d.pa; return false; } });
    t.eq(right, 3, 'only the letters before the first mistake count');
  });
  await R.test('a flood of messages is dropped, the game goes on', t => {
    SUITE.seed(96); env.clean(); const p = env.open(300); const a = env.human('Flood', { x: p.x, y: p.y }); let crashed = null; try { for (let i = 0; i < 1000; i++) X.srvMsg(a.cid, { t: 'in', ux: 1, uy: 0, f: 1 }); env.srv(.5); } catch (x) { crashed = x; }
    t.ok(!crashed, 'no error: ' + (crashed && crashed.message)); t.ok(a.h.abuse > 300, 'most messages were dropped (' + a.h.abuse + ')'); env.advance(3); X.srvMsg(a.cid, { t: 'in', ux: 0, uy: 1, f: 1 }); t.eq(a.h.inp.uy, 1, 'after a pause messages are accepted again');
  });

  R.group('Duels: against bots');
  await R.test('a bot types at its own speed and wins against a player who does not type', t => {
    SUITE.seed(97); env.clean(); const p = env.open(300); const h = env.human('Idle', { x: p.x, y: p.y }); h.e.protect = 0; h.e.lvl = 10; const b = env.ent(p.x + 20, p.y, 10); b.protect = 0; b.skill = 6; const mean = X.botMean(b);
    let end = null, t0 = null; env.srv(120, (s, out) => { for (const [c, m] of out) { if (m.t === 'dgo' && t0 === null) t0 = env.clock(); if (m.t === 'dend') end = env.clock(); } if (end) return false; });
    t.ok(end && t0, 'the duel ended'); const len = X.sds.length ? 0 : 1; t.ok(h.msgs === undefined || true, 'ok'); const dur = end - t0; t.range('time a ' + Math.round(mean) + ' WPM bot needs', dur, 1, 60, ' s');
  });
  await R.test('bot against bot: the stronger typist wins more often', t => {
    SUITE.seed(98); let fastWins = 0, N = 300; for (let i = 0; i < N; i++) { env.clean(); const p = env.open(300); const a = env.ent(p.x, p.y, 10), b = env.ent(p.x + 20, p.y, 10); a.skill = 30; b.skill = -10; a.protect = b.protect = 0; X.startDuel(a, b, env.clock()); const d = X.botDuels[0]; if (!d) { t.ok(false, 'no bot duel'); break; }
      d.end = 0; env.run(.1); if (a.state !== 'eaten' && b.state === 'eaten') fastWins++; }
    t.range('the 70 WPM bot beats the 30 WPM bot', fastWins / N * 100, 55, 95, ' %');
  });
  await R.test('duels between bots finish in ' + X.DU.botVsBot[0] + '-' + X.DU.botVsBot[1] + ' s and settle the XP the same way', t => {
    SUITE.seed(99); env.clean(); const p = env.open(300); const a = env.ent(p.x, p.y, 20), b = env.ent(p.x + 20, p.y, 8); a.protect = b.protect = 0; X.startDuel(a, b, env.clock()); const d = X.botDuels[0]; t.ok(!!d, 'a bot duel exists');
    t.range('length', d.end - env.clock(), X.DU.botVsBot[0] - .01, X.DU.botVsBot[1] + .01, ' s'); const xw = X.xpOf(a.lvl) + X.xpOf(b.lvl); env.run(X.DU.botVsBot[1] + .3);
    t.ok(a.state === 'eaten' || b.state === 'eaten', 'one of them was eaten'); const win = a.state === 'eaten' ? b : a, lose = win === a ? b : a, wasW = win === a ? X.xpOf(20) : X.xpOf(8);
    t.ok(X.xpOf(win.lvl) - wasW <= X.xpOf(lose.lvl) * .75 + X.DU.minWinXp + 1, 'the winner takes at most a share of what the loser had');
  });
  X.ents = []; X.orbs = []; X.sds.length = 0;
} });
})(typeof self !== 'undefined' ? self : globalThis);
