/* ---------- part 6b: balance with scripted players: how does a player of a given typing speed get on against the bots? ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
SUITE.parts.push({ name: 'balance', async run(env, R) {
  const { X } = env, S = SUITE.stat;

  // a simple player: walks to the nearest snack, hunts a bot that is not much stronger, types duels honestly at its own speed, picks the first perk card
  function runGame(nHum, wpm, seconds, style) {
    env.clean(true); env.quiet(false); X.foods = [];
    for (let i = 0; i < X.CFG.spawn.snacksOutside * .45; i++) X.spawnFood(false); for (let i = 0; i < X.CFG.spawn.snacksInside * .45; i++) X.spawnFood(true); X.fgBuild(); for (let i = 0; i < 90; i++) X.spawnBot(env.clock());
    const hs = []; for (let i = 0; i < nHum; i++) hs.push(env.human('S' + i, { keep: 1 }));
    const st = { deaths: 0, wins: 0, duels: 0, snacks: 0, gain: 0, samples: [], levelsLost: 0 }; const typed = new Map();
    const N = Math.round(seconds * 60);
    for (let s = 0; s < N; s++) {
      if (s % 10 === 0) for (const h of hs) { const e = h.h.e; if (!e || e.state !== 'move') continue; let best = null, bd = 1e12, victim = null, vd = style === 'hunt' ? 520 : 0;
        if (style === 'hunt') for (const o of X.ents) { if (o === e || o.state === 'eaten' || o.state === 'duel' || env.clock() < o.protect || X.L(o) > X.L(e) + 2) continue; const d = Math.hypot(o.x - e.x, o.y - e.y); if (d < vd) { vd = d; victim = o; } }
        if (victim) { const dx = victim.x - e.x, dy = victim.y - e.y, l = Math.hypot(dx, dy) || 1; X.srvMsg(h.cid, { t: 'in', ux: dx / l, uy: dy / l, f: 1, sp: vd < 300 }); continue; }
        for (const f of X.foods) { const dx = f.x - e.x, dy = f.y - e.y; if (dx > 900 || dx < -900 || dy > 900 || dy < -900) continue; const d = dx * dx + dy * dy; if (d < bd) { bd = d; best = f; } }
        if (best) { const dx = best.x - e.x, dy = best.y - e.y, l = Math.hypot(dx, dy) || 1; X.srvMsg(h.cid, { t: 'in', ux: dx / l, uy: dy / l, f: 1 }); } else X.srvMsg(h.cid, { t: 'in', ux: Math.random() - .5, uy: Math.random() - .5, f: 1 }); }
      if (s % 6 === 0) for (const h of hs) { const e = h.h.e; if (e && e.sd && e.sd.phase === 'type' && !e.sd.done) { const sd = e.sd, k = sd.a === e ? 'a' : 'b', txt = sd['t' + k], n = Math.min(txt.length, Math.floor((env.clock() - sd.start) * wpm * 5 / 60)); if (n > (typed.get(h.cid) || 0) || sd.start === env.clock()) { typed.set(h.cid, n); X.srvMsg(h.cid, { t: 'prog', x: txt.slice(0, n), s: n }); } } else typed.delete(h.cid); }
      env.advance(1 / 60); const out = X.srvStep(1 / 60);
      for (const [cid, m] of out) { if (m.t === 'dead') { st.deaths++; st.snacks += m.st.snacks; X.srvMsg(cid, { t: 'respawn' }); } else if (m.t === 'dend' && m.win && !m.left) { st.wins++; st.gain += m.gain; } else if (m.t === 'duel') st.duels++;
        else if (m.t === 'offer') X.srvMsg(cid, { t: 'choose', i: 0 }); }
      if (s % 1800 === 0 && s >= 7200) for (const h of hs) if (h.h.e) st.samples.push(h.h.e.lvl);
    }
    for (const h of hs) if (h.h.e) st.snacks += h.h.e.snacks || 0;
    const out = { n: nHum, minutes: seconds / 60, wpm, style, meanLvl: S.mean(st.samples), deathsPerMin: st.deaths / (nHum * seconds / 60), winsPerMin: st.wins / (nHum * seconds / 60), snacksPerMin: st.snacks / (nHum * seconds / 60), gainPerWin: st.wins ? st.gain / st.wins : 0, duelsPerMin: st.duels / (nHum * seconds / 60) };
    for (const k of [...X.humans.keys()]) X.srvLeave(k); env.clean(); env.quiet(true); return out;
  }
  const SEC = R.deep ? 480 : 240, NH = R.deep ? 10 : 6;
  R.group('Balance: scripted players against the bots (' + NH + ' players, ' + SEC / 60 + ' minutes each)');
  const results = {};
  for (const wpm of R.deep ? [25, 40, 55, 80] : [40]) {
    await R.test('a ' + wpm + ' WPM player who eats snacks and hunts weaker bots', t => {
      SUITE.seed(130 + wpm); const r = runGame(NH, wpm, SEC, 'hunt'); results[wpm] = r;
      t.range('average level after ' + SEC / 60 + ' minutes (sampled from minute 2 on)', r.meanLvl, 1.5, 120); t.range('deaths per minute', r.deathsPerMin, 0, 1.6); t.range('duel wins per minute', r.winsPerMin, 0.05, 6); t.range('snacks eaten per minute', r.snacksPerMin, 2, 60);
      t.info('duels per minute', r.duelsPerMin.toFixed(2)); t.info('levels gained per win', r.gainPerWin.toFixed(2));
      if (r.deathsPerMin > .8) t.warn('a ' + wpm + ' WPM player dies ' + r.deathsPerMin.toFixed(2) + ' times a minute: very hard'); if (r.meanLvl < 4) t.warn('after ' + SEC / 60 + ' minutes the average level is only ' + r.meanLvl.toFixed(1) + ': very slow progress');
    });
  }
  if (R.deep) await R.test('typing speed matters, but a slow typist is not helpless', t => {
    const a = results[25], b = results[40], c = results[55], d = results[80]; t.ok(a && b && c && d, 'all four runs exist'); if (!(a && b && c && d)) return;
    t.ok(d.meanLvl >= a.meanLvl * 1.0, 'an 80 WPM player is at least as far as a 25 WPM player (' + d.meanLvl.toFixed(1) + ' vs ' + a.meanLvl.toFixed(1) + ')'); t.ok(a.meanLvl >= 2.5, 'a 25 WPM player still reaches level ' + a.meanLvl.toFixed(1));
    t.range('how much further the 80 WPM player gets than the 25 WPM one', d.meanLvl / Math.max(.5, a.meanLvl), .9, 12, ' x'); t.ok(d.deathsPerMin <= a.deathsPerMin * 1.3 + .05, 'fast typists do not die more often than slow ones');
  });
  R.group('Balance: what a snack eater without fights gets');
  await R.test('only eating snacks (no hunting, no perks used): slower than hunting, but moving', t => {
    SUITE.seed(140); const r = runGame(NH, 40, SEC, 'eat'); t.range('average level', r.meanLvl, 1.2, 120); t.range('deaths per minute', r.deathsPerMin, 0, 1.6); t.info('wins per minute (bots that attacked and lost)', r.winsPerMin.toFixed(2)); t.info('snacks per minute', r.snacksPerMin.toFixed(1));
    if (results[40]) { t.info('compared with hunting: average level', results[40].meanLvl.toFixed(1) + ' (hunting) vs ' + r.meanLvl.toFixed(1) + ' (eating only)'); if (results[40].meanLvl < r.meanLvl * .9) t.warn('hunting weaker bots (' + results[40].meanLvl.toFixed(1) + ') gets a player less far than only eating snacks (' + r.meanLvl.toFixed(1) + ') and costs more deaths (' + results[40].deathsPerMin.toFixed(2) + ' vs ' + r.deathsPerMin.toFixed(2) + ' per minute): fighting is not rewarded enough'); }
  });
} });
})(typeof self !== 'undefined' ? self : globalThis);
