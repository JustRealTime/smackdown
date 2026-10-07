// Runs the Typebite self test (rules part) in node: node tools/selftest-node.js [deep] [filter]
// The game code is loaded by server/server.js; the suite is the concatenation of tools/selftest/*.js (same as site/selftest.js)
const fs = require('fs'), path = require('path');
const deep = process.argv.includes('deep'), filter = process.argv.slice(2).find(a => a !== 'deep');
const real = performance.now.bind(performance);
const S = require('../server/server.js');
const parts = fs.readdirSync(path.join(__dirname, 'selftest')).filter(f => f.endsWith('.js')).sort();
for (const f of parts) (0, eval)(fs.readFileSync(path.join(__dirname, 'selftest', f), 'utf8'));
const SUITE = globalThis.TYPEBITE_SELFTEST;
(async () => {
  const R = SUITE.runner({ deep, post: m => {
    if (m.type === 'group') console.log('\n== ' + m.name);
    if (m.type === 'test' && (!filter || m.rec.g.includes(filter) || m.rec.n.includes(filter))) {
      const r = m.rec, mark = { pass: 'ok  ', fail: 'FAIL', warn: 'warn', skip: 'skip' }[r.s];
      console.log(mark + ' ' + r.n + (r.m.length ? '  [' + r.m.map(x => x.k + '=' + x.v + (x.u || '')).join(', ') + ']' : '') + '  ' + r.ms + ' ms');
      for (const d of r.d) if (r.s !== 'pass') console.log('       ' + d);
    }
  } });
  const env = SUITE.attach(S.sim);
  for (const p of SUITE.parts) { if (process.env.ONLY && !process.env.ONLY.split(',').includes(p.name)) continue; if (filter && !p.name.includes(filter) && filter.length > 3 && !p.name.toLowerCase().includes(filter.toLowerCase())) { /* still run: groups decide */ } await p.run(env, R); }
  const c = R.summary();
  console.log('\nRESULT pass ' + c.pass + ' | warn ' + c.warn + ' | fail ' + c.fail + ' | skip ' + c.skip);
  process.exit(c.fail ? 1 : 0);
})();
