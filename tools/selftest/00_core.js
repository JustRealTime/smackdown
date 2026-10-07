/* Typebite self test (r81). Source parts live in tools/selftest/*.js, tools/build.py joins them into site/selftest.js.
   The same suite runs in three places:  - the page typebite.io/?selftest=1 (server rules inside a Web Worker, client checks in the page)
                                         - node tools/selftest-node.js (server rules only, for the developer)
   It tests the REAL game code: the rules part drives the game server (the code that runs in the host's browser) in a private world with a fake clock,
   the client part draws, builds and starts things in the page. Nothing here touches other players or a running game. */
(function (root) {
'use strict';
const SUITE = { version: 1, parts: [] };
root.TYPEBITE_SELFTEST = SUITE;

/* ---------- reporter: groups, tests, assertions, metrics ---------- */
SUITE.runner = function (opts) {
  opts = opts || {};
  const res = [];
  let grp = '', cur = null;
  const post = opts.post || (() => {});
  const R = {
    res, deep: !!opts.deep, opts,
    group(name) { grp = name; post({ type: 'group', name }); },
    async test(name, fn) {
      const rec = { g: grp, n: name, s: 'pass', d: [], m: [], ok: 0, ms: 0 };
      const t = {
        ok(c, msg) { if (c) rec.ok++; else { rec.s = 'fail'; rec.d.push('✗ ' + msg); } return !!c; },
        eq(a, b, msg) { return t.ok(a === b, msg + ' (is ' + fmt(a) + ', should be ' + fmt(b) + ')'); },
        near(a, b, tol, msg) { return t.ok(Math.abs(a - b) <= tol, msg + ' (is ' + fmt(a) + ', should be ' + fmt(b) + ' ± ' + fmt(tol) + ')'); },
        range(label, v, lo, hi, unit) {   // a measured number that has to lie in a range
          const good = Number.isFinite(v) && v >= lo && v <= hi;
          rec.m.push({ k: label, v: +(+v).toFixed(3), lo, hi, u: unit || '' });
          if (good) rec.ok++; else { rec.s = 'fail'; rec.d.push('✗ ' + label + ' = ' + fmt(v) + (unit || '') + ', expected ' + fmt(lo) + ' … ' + fmt(hi)); }
          return good;
        },
        info(label, v, unit) { rec.m.push({ k: label, v: typeof v === 'number' ? +v.toFixed(3) : v, u: unit || '' }); },
        warn(msg) { rec.warn = 1; rec.d.push('! ' + msg); },
        note(msg) { rec.d.push(msg); },
      };
      cur = rec;
      const t0 = now();
      try { await fn(t); } catch (e) { rec.s = 'fail'; rec.d.push('✗ EXCEPTION ' + String(e && e.stack || e).slice(0, 500)); }
      rec.ms = Math.round(now() - t0);
      if (rec.s === 'pass' && rec.warn) rec.s = 'warn';
      res.push(rec);
      post({ type: 'test', rec });
      await tick();
    },
    skip(name, why) { const rec = { g: grp, n: name, s: 'skip', d: [why || ''], m: [], ok: 0, ms: 0 }; res.push(rec); post({ type: 'test', rec }); },
    summary() {
      const c = { pass: 0, fail: 0, warn: 0, skip: 0 };
      for (const r of res) c[r.s]++;
      return c;
    },
    progress(done, total) { post({ type: 'progress', done, total }); },
  };
  return R;
};
const fmt = v => typeof v === 'number' ? (Math.abs(v) >= 100 ? String(Math.round(v * 10) / 10) : String(Math.round(v * 1000) / 1000)) : String(v);
const realNow = (typeof performance !== 'undefined' && performance.now) ? performance.now.bind(performance) : Date.now;
const now = () => realNow();
const tick = () => new Promise(r => setTimeout(r, 0));
SUITE.util = { fmt, tick, now };

/* ---------- seeded random numbers, so that a test gives the same result every time (and on every device) ---------- */
SUITE.seed = function (s) {
  let a = s >>> 0;
  Math.random = function () { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};

/* ---------- small statistics helpers ---------- */
SUITE.stat = {
  mean: a => a.reduce((x, y) => x + y, 0) / Math.max(1, a.length),
  quantile(a, p) { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : NaN; },
  // does a measured share fit an expected share? (binomial: allowed deviation about 4.5 standard deviations)
  fits(hits, n, p) { const sd = Math.sqrt(Math.max(1e-9, n * p * (1 - p))); return Math.abs(hits - n * p) <= 4.5 * sd + 1; },
};
})(typeof self !== 'undefined' ? self : globalThis);
