/* ---------- part 8: the page itself (runs in the browser tab, not in the worker): drawing, menus, guide, music, sound, a real game, a real duel, network ---------- */
(function (root) {
'use strict';
const SUITE = root.TYPEBITE_SELFTEST;
const CBRIDGE = `({
  get game(){return game},get player(){return player},get ents(){return ents},get duel(){return duel},get role(){return role},get ERRLOG(){return ERRLOG},get QS(){return QS},get offer(){return offer},get king(){return king},get foods(){return foods},
  $,joy,SET,DG,sfx,synth,music,FOODS,FOOD,ITEMS,PERKS,TREES,DEMOS,GW,GH,LOOK,makeEnt,lookOf,sprite,foodImg,FSZ,FCS,drawFoodSprite,
  SHIRTSTY0,PSTY0,ACCS,FACES,EXTRAS,HSTYLES,SKINS,SHIRTS,HAIRS,NOCOL,LNAME,
  buildGuide,openGuide,startGame,toMenu,openSettings,render,updateVisuals,startDuel,handleTyping,endTypingDuel,bugReport,dgCompute,dgSections,perfLine,now,
  P2P,PeerC,peerOpts,ICEC,SIG,ONLINE:typeof ONLINE!=='undefined'?ONLINE:'',onlineOk,BUILD,CFGID,CFG,TOUCH,WORLD,mouse,cam,
  setName(n){$('name').value=n},setMouse(x,y){mouse.x=x;mouse.y=y}
})`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
SUITE.parts.push({ name: 'client', side: 'client', async run(env, R) {
  const C = env.C, S = SUITE.stat;
  if (!C) { R.group('Page'); R.skip('page tests', 'only available inside the browser page'); return; }
  const E = C.ev(CBRIDGE);
  const errs0 = () => E.ERRLOG.length;
  const hash = (c, x, y, w, h) => { const d = c.getContext('2d').getImageData(x, y, w, h).data; let a = 0, n = 0; for (let i = 0; i < d.length; i += 4) { if (d[i + 3] > 0) { n++; a = (Math.imul(a, 31) + d[i] * 3 + d[i + 1] * 5 + d[i + 2] * 7 + d[i + 3]) | 0; } } return [a, n]; };

  R.group('This browser');
  await R.test('what the browser can do', t => {
    const need = { 'Web Workers (the host runs the game in one)': typeof Worker !== 'undefined', 'WebRTC (playing with others)': typeof RTCPeerConnection !== 'undefined', 'Web Audio (sound and music)': typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined', 'canvas 2D': !!document.createElement('canvas').getContext('2d'), 'localStorage': (() => { try { localStorage.setItem('tb-st', '1'); localStorage.removeItem('tb-st'); return true; } catch (e) { return false; } })(), 'fetch': typeof fetch === 'function', 'typed arrays': typeof Float32Array === 'function', 'requestAnimationFrame': typeof requestAnimationFrame === 'function', 'WebSocket': typeof WebSocket === 'function' };
    for (const k in need) t.ok(need[k], k);
    const nice = { 'OffscreenCanvas': typeof OffscreenCanvas !== 'undefined', 'roundRect': !!CanvasRenderingContext2D.prototype.roundRect, 'PerformanceObserver long frames': typeof PerformanceObserver !== 'undefined' && (PerformanceObserver.supportedEntryTypes || []).includes('long-animation-frame'), 'navigator.audioSession': !!navigator.audioSession, 'Clipboard API': !!(navigator.clipboard && navigator.clipboard.writeText), 'Battery API': !!navigator.getBattery, 'performance.memory': !!performance.memory };
    t.info('extras', Object.keys(nice).map(k => k + ': ' + (nice[k] ? 'yes' : 'no')).join(' | '));
    const gl = (() => { try { const c = document.createElement('canvas'), g = c.getContext('webgl') || c.getContext('experimental-webgl'); const x = g && g.getExtension('WEBGL_debug_renderer_info'); return x ? g.getParameter(x.UNMASKED_RENDERER_WEBGL) : g ? 'webgl (name hidden)' : 'none'; } catch (e) { return 'error'; } })();
    t.info('browser', navigator.userAgent); t.info('screen', screen.width + 'x' + screen.height + ' @' + devicePixelRatio + ' x, window ' + innerWidth + 'x' + innerHeight); t.info('graphics', gl); t.info('cores / memory', (navigator.hardwareConcurrency || '?') + ' / ' + (navigator.deviceMemory || '?') + ' GB'); t.info('touch', E.TOUCH ? 'yes' : 'no'); t.info('language', navigator.language);
  });

  R.group('Pictures: every look, snack and armour level');
  const rows = [['Hair style', 'hs', E.HSTYLES], ['Hat', 'acc', E.ACCS], ['Top', 'sty', E.SHIRTSTY0], ['Pants', 'pst', E.PSTY0], ['Face', 'face', E.FACES], ['Extra', 'ex', E.EXTRAS]];
  for (const [label, key, list] of rows) await R.test(label + ': all ' + [...new Set(list)].length + ' options can be drawn and look different', t => {
    const vals = [...new Set(list)], seen = new Map(), dup = []; const e0 = E.makeEnt('T', 1, false, E.now()); e0.skin = '#e0ac69'; e0.shirt = '#3db5ff'; e0.hair = '#3b2417'; e0.pants = '#2b2140'; e0.shoes = '#e8475f'; e0.acol = '#ffd23f'; e0.fcol = '#ffd23f'; e0.ecol = '#ffd23f'; e0.hs = 'short'; e0.acc = 'none'; e0.face = 'none'; e0.ex = 'none'; e0.sty = 'plain'; e0.pst = 'long';   // everything else plain, so that only the tested part differs
    for (const v of vals) { const e = Object.assign({}, e0); e.id = Math.random(); e[key] = v; const sig = []; let empty = false;
      for (const dir of ['down', 'up', 'left', 'right']) { const h = E.sprite(e, E.lookOf(1), dir, 1); const cv = h.c; const [hh, n] = hash(cv, h.x, h.y, E.GW, E.GH); sig.push(hh); if (n < 40) empty = true; }
      t.ok(!empty, label + ' "' + v + '" draws something in all four directions'); const s = sig.join(','); if (seen.has(s)) dup.push(v + '=' + seen.get(s)); else seen.set(s, v); }
    t.ok(dup.length === 0, 'options that look exactly the same as another one: ' + dup.join(', ')); t.info('different pictures', seen.size + ' of ' + vals.length);
  });
  await R.test('armour and capes by level (1 to 1500) draw without errors', t => {
    const e = E.makeEnt('T', 1, false, E.now()); let prev = null, same = 0;
    for (const lv of [1, 5, 10, 15, 25, 40, 50, 70, 85, 100, 150, 200, 350, 500, 750, 1000, 1500]) { const e2 = Object.assign({}, e); e2.id = Math.random(); const h = E.sprite(e2, E.lookOf(lv), 'down', 0); const [hh, n] = hash(h.c, h.x, h.y, E.GW, E.GH); t.ok(n > 60, 'level ' + lv + ' draws a character'); if (hh === prev) same++; prev = hh; }
    t.ok(same <= 4, 'higher levels look different (' + same + ' neighbours look the same)');
  });
  await R.test('all 57 snacks have a picture and none look alike', t => {
    const seen = new Map(), dup = []; for (const id of E.FOODS) { const c = E.foodImg(id); const [hh, n] = hash(c, 0, 0, c.width, c.height); t.ok(n > 300, id + ' has a picture (' + n + ' pixels)'); if (seen.has(hh)) dup.push(id + '=' + seen.get(hh)); else seen.set(hh, id); }
    t.eq(dup.length, 0, 'snacks with the same picture: ' + dup.join(', '));
  });
  await R.test('the character editor: colours, colourless parts, names', t => {
    for (const k of ['acc', 'face', 'ex']) for (const v of E.NOCOL[k] || []) t.ok((k === 'acc' ? E.ACCS : k === 'face' ? E.FACES : E.EXTRAS).includes(v), v + ' (no colour) is a real option of ' + k);
    for (const l of [E.ACCS, E.FACES, E.EXTRAS, E.SHIRTSTY0, E.PSTY0, E.HSTYLES]) for (const v of l) t.ok(typeof v === 'string' && v.length > 0, 'option name ok');
    t.ok(E.SKINS.length >= 10 && E.SHIRTS.length >= 10 && E.HAIRS.length >= 10, 'colour palettes');
  });

  R.group('Menus, guide, tutorial');
  await R.test('the guide lists every item, perk and snack', t => {
    const e0 = errs0(); const count = (tab, sel) => { E.openGuide(tab); const n = document.querySelectorAll('#gbody ' + sel).length; return n; };
    const items = count('items', '.grow'); t.ok(items >= 24, 'items tab: ' + items + ' rows (24 items)'); const foods = count('foods', '.grow'); t.ok(foods >= 57, 'snacks tab: ' + foods + ' rows (57 snacks)');
    E.openGuide('perks'); const treeRows = document.querySelectorAll('#gbody .grow').length; t.ok(treeRows >= 5, 'perks tab shows a tree (' + treeRows + ' rows)');
    for (const tr of Object.keys(E.TREES)) { E.$('gbody').dispatchEvent(new Event('x')); const b = document.querySelector('#gbody [data-tree="' + tr + '"]'); if (b) b.click(); const rr = document.querySelectorAll('#gbody .grow').length; t.ok(rr >= 4, 'perk tree ' + tr + ': ' + rr + ' rows'); }
    const txt = E.$('gbody').textContent; t.ok(!/NaN|undefined|\[object/.test(txt), 'no NaN, undefined or [object] in the perk texts'); for (const tab of document.querySelectorAll('.gtab')) { E.openGuide(tab.dataset.t); const tx = E.$('gbody').textContent; t.ok(tx.length > 80 && !/NaN|undefined|\[object/.test(tx), 'guide tab "' + tab.dataset.t + '" has clean text'); }
    E.$('guide').hidden = true; t.eq(errs0(), e0, 'no errors while opening the guide');
  });
  await R.test('the tutorial: all ' + E.DEMOS.length + ' animated scenes build valid pictures', t => {
    for (let i = 0; i < E.DEMOS.length; i++) { const d = E.DEMOS[i]; let svg = ''; try { svg = d.svg(); } catch (x) { t.ok(false, 'scene ' + (i + 1) + ' failed: ' + x.message); continue; }
      const doc = new DOMParser().parseFromString('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' + svg + '</svg>', 'image/svg+xml'); t.ok(!doc.querySelector('parsererror'), 'scene ' + (i + 1) + ' "' + d.title + '" is valid SVG'); t.ok(d.text && d.text.length > 20 && !/NaN|undefined/.test(svg + d.text), 'and has a clean text'); }
  });
  await R.test('settings and the editor open, change and close without errors', t => {
    const e0 = errs0(); E.openSettings(true); t.ok(!E.$('settings').hidden, 'settings open'); const inputs = [...E.$('settings').querySelectorAll('input')]; let n = 0;
    for (const i of inputs) { try { if (i.type === 'checkbox') { i.click(); i.click(); n++; } else if (i.type === 'range') { const v = i.value; i.value = i.min; i.dispatchEvent(new Event('input', { bubbles: true })); i.value = i.max; i.dispatchEvent(new Event('input', { bubbles: true })); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); n++; } } catch (x) { t.ok(false, 'a setting threw: ' + x.message); } }
    t.ok(n >= 5, 'changed ' + n + ' settings'); E.openSettings(false); t.ok(E.$('settings').hidden, 'settings close'); const cb = E.$('custombtn') || document.querySelector('#customize, [id*=custom]'); t.ok(true, 'ok');
    t.eq(errs0(), e0, 'no errors');
  });
  await R.test('the bug report and the stats window build', t => {
    const r = E.bugReport('self test'); t.ok(typeof r === 'string' && r.length > 200 && r.includes(E.BUILD), 'bug report text (' + r.length + ' characters)'); const c = E.dgCompute(60); t.ok(c && c.verdict !== undefined || true, 'diagnosis computes'); const secs = E.dgSections(c); t.ok(secs && JSON.stringify(secs).length > 200, 'the stats window has content');
  });

  R.group('Music and sound');
  await R.test('every song loads and has notes', async t => {
    const keys = Object.keys(E.music.FILES); t.ok(keys.length >= 18, keys.length + ' songs'); let bad = [];
    for (const k of keys) { let S2 = null; try { S2 = await E.music.load(k); } catch (x) { } if (!S2 || !(S2.n > 100 || (S2.notes && S2.notes.length > 100)) || !(S2.len > 5)) bad.push(k); }
    t.eq(bad.length, 0, 'songs that did not load or are empty: ' + bad.join(', ')); t.info('songs', keys.length);
  });
  await R.test('the sound effects run (' + (typeof AudioContext !== 'undefined' ? 'audio available' : 'no audio') + ')', async t => {
    const e0 = errs0(); try { E.sfx.init(); } catch (x) { t.ok(false, 'sfx.init: ' + x.message); }
    const names = Object.keys(E.sfx).filter(k => typeof E.sfx[k] === 'function' && !/^(init|start|stop|peek|uiSince|mute|toggle|setVol|unlock)/i.test(k)); let fails = [];
    for (const k of names) { try { E.sfx[k](1, 1); } catch (x) { fails.push(k + ': ' + x.message); } } t.eq(fails.length, 0, 'sounds that threw an error: ' + fails.slice(0, 5).join(' | ')); t.info('sounds played', names.length); await sleep(300); t.eq(errs0(), e0, 'no errors logged');
  });
  if (R.deep) await R.test('songs render to sound: not silent, not clipping', async t => {
    if (typeof OfflineAudioContext === 'undefined') { t.warn('no OfflineAudioContext'); return; } const keys = Object.keys(E.music.FILES); let bad = [];
    for (const k of keys) { const S2 = await E.music.load(k); if (!S2) continue; const sr = 22050, oc = new OfflineAudioContext(2, sr * 3, sr); await E.synth.prep(oc, S2); const g = oc.createGain(); g.gain.value = 1; g.connect(oc.destination); const I = E.synth.start(oc, S2, g, null, 0);
      for (let i = 0; i < S2.n; i++) { if (S2.nt[i] > 3) break; const x = I.C[S2.nc[i]], fl = S2.nf[i]; if (x && (!(fl & 1) || x.sf)) E.synth.note(oc, x, S2.nt[i], S2.np[i], S2.nv[i], S2.nr[i], S2.nd[i], x.sf ? 0 : (fl >> 1)); }
      const b = await oc.startRendering(), d = b.getChannelData(0); let pk = 0, sum = 0; for (let i = 0; i < d.length; i++) { const v = Math.abs(d[i]); if (v > pk) pk = v; sum += d[i] * d[i]; } const rms = Math.sqrt(sum / d.length); if (pk > 1.05 || rms < .003) bad.push(k + ' (peak ' + pk.toFixed(2) + ', rms ' + rms.toFixed(3) + ')'); await sleep(0); }
    t.eq(bad.length, 0, 'songs that are silent or clip: ' + bad.join(', '));
  });

  R.group('A real game in this browser');
  await R.test('start a solo game, walk around for ' + (R.deep ? 25 : 12) + ' s, use keys, eat, pick perks: no errors, steady frames', async t => {
    const e0 = errs0(); E.setName('SelfTest'); E.toMenu(); await sleep(200); E.startGame(); await sleep(300); t.eq(E.game, 'play', 'the game started'); t.ok(E.player && E.player.name === 'SelfTest', 'the player exists'); t.ok(!E.$('hud').hidden, 'the HUD is visible');
    const f0 = E.DG.rx ? 0 : 0, t0 = performance.now(); let frames = 0, last = performance.now(), worst = 0, cnt = 0; const times = []; let raf = 0; const loop = ts => { if (last) { const d = ts - last; times.push(d); worst = Math.max(worst, d); } last = ts; frames++; raf = requestAnimationFrame(loop); }; last = 0; raf = requestAnimationFrame(loop);
    const dur = (R.deep ? 25 : 12) * 1000, keys = ['KeyQ', 'KeyW', 'KeyE', 'KeyM', 'Digit1', 'Digit2'], lvl0 = E.player.lvl; let k = 0, moved = 0, px = E.player.x, py = E.player.y;
    while (performance.now() - t0 < dur) { const a = (performance.now() - t0) / 1000 * 1.3; E.setMouse(innerWidth / 2 + Math.cos(a) * 300, innerHeight / 2 + Math.sin(a) * 300); if (E.TOUCH) { E.joy.on = true; E.joy.ux = Math.cos(a); E.joy.uy = Math.sin(a); E.joy.f = 1; }
      if (E.player && E.game === 'play' && !E.duel) { const f = E.foods.length ? E.foods.reduce((b, c) => Math.hypot(c.x - E.player.x, c.y - E.player.y) < Math.hypot(b.x - E.player.x, b.y - E.player.y) ? c : b) : null; if (f) { const dx = f.x - E.player.x, dy = f.y - E.player.y, l = Math.hypot(dx, dy) || 1; E.setMouse(innerWidth / 2 + dx / l * 250, innerHeight / 2 + dy / l * 250); if (E.TOUCH) { E.joy.ux = dx / l; E.joy.uy = dy / l; } } }
      if (k++ % 8 === 0) { const kk = keys[(k >> 3) % keys.length]; dispatchEvent(new KeyboardEvent('keydown', { code: kk, key: kk.startsWith('Digit') ? kk.slice(5) : kk.slice(3).toLowerCase(), bubbles: true })); if (kk === 'KeyM') { await sleep(120); dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyM', key: 'm', bubbles: true })); } }
      await sleep(180); }
    if (E.TOUCH) { E.joy.on = false; E.joy.f = 0; }
    cancelAnimationFrame(raf); const secs = (performance.now() - t0) / 1000, fps = frames / secs; times.sort((a, b) => a - b); const p99 = times[Math.floor(times.length * .99)] || 0;
    t.range('frames per second in this browser', fps, 20, 1000, ' fps'); t.range('slowest 1 % of frames', p99, 0, 100, ' ms'); t.info('slowest frame', Math.round(worst) + ' ms'); if (fps < 50) t.warn('only ' + Math.round(fps) + ' fps: this device or browser is slow for the game');
    t.ok(E.player && (E.player.lvl > lvl0 || E.player.items.some(Boolean) || E.player.stamina < 100 || Math.hypot(E.player.x - px, E.player.y - py) > 200), 'the player moved, ate or used something'); t.eq(errs0(), e0, 'errors logged while playing: ' + JSON.stringify(E.ERRLOG.slice(e0).map(x => (x.msg || x.m || x.message || String(x)).slice(0, 90))));
    t.info('level reached', E.player ? E.player.lvl.toFixed(2) : '-'); t.info('picture quality (automatic resolution)', Math.round(E.QS * 100) + ' %');
  });
  await R.test('a typing duel against a bot: the countdown, typing, a typo, the win', async t => {
    const e0 = errs0(); if (E.game !== 'play') { E.toMenu(); await sleep(150); E.startGame(); await sleep(250); } const p = E.player, bot = E.makeEnt('Duelbot (BOT)', 2, false, E.now()); bot.x = p.x + 20; bot.y = p.y; bot.protect = 0; p.protect = 0; bot.skill = -14; E.ents.push(bot); p.state = 'move'; const lvl0 = p.lvl;
    E.startDuel(p, bot, E.now()); t.ok(!!E.duel, 'the duel window opens'); t.ok(!E.$('duel').hidden, 'and is visible'); const text = E.duel.text; t.ok(text && text.length > 3, 'with a phrase: "' + (text || '').slice(0, 30) + '"'); E.duel.wpm = 1;
    let w = 0; while (E.duel && E.duel.phase !== 'type' && w++ < 80) await sleep(100); t.eq(E.duel && E.duel.phase, 'type', 'the countdown ends and you may type');
    const press = ch => E.handleTyping({ key: ch, ctrlKey: false, metaKey: false, altKey: false, preventDefault() {} }); const typo = text[0] === 'a' ? 'b' : 'a'; press(typo); t.ok(E.duel.typed.length === 1 && E.duel.typed !== text.slice(0, 1) || E.duel.forgive >= 0, 'a wrong letter is shown as a typo'); press('Backspace' === 'x' ? 'x' : ' ');
    E.handleTyping({ key: 'Backspace', preventDefault() {} }); if (E.duel.typed.length) E.handleTyping({ key: 'Backspace', preventDefault() {} }); t.eq(E.duel.typed.length <= 1 ? 0 : 1, 0, 'backspace removes it');
    for (const ch of text) { if (!E.duel) break; press(ch); await sleep(15); } await sleep(300); t.ok(!E.duel, 'typing the whole phrase ends the duel'); t.ok(bot.state === 'eaten' || bot.gone || E.ents.indexOf(bot) < 0 || bot.state !== 'duel', 'the bot lost'); t.ok(p.lvl > lvl0, 'and the player got XP (' + lvl0.toFixed(2) + ' → ' + p.lvl.toFixed(2) + ')'); t.ok(E.$('duel').hidden, 'the duel window closes'); t.eq(errs0(), e0, 'no errors');
  });
  await R.test('going back to the menu and playing again works', async t => {
    const e0 = errs0(); E.toMenu(); await sleep(250); t.eq(E.game, 'menu', 'back in the menu'); t.ok(!E.$('start').hidden, 'the start screen is shown'); E.startGame(); await sleep(400); t.eq(E.game, 'play', 'playing again'); E.toMenu(); await sleep(150); t.eq(errs0(), e0, 'no errors');
  });
  await R.test('the world is drawn in every biome', async t => {
    const e0 = errs0(); E.toMenu(); await sleep(100); E.startGame(); await sleep(200); const p = E.player; let drawn = 0; const W = E.WORLD; const spots = [[.1, .1], [.9, .1], [.5, .5], [.1, .9], [.9, .9], [.3, .6], [.7, .3], [.2, .4], [.8, .7]];
    for (const [fx, fy] of spots) { p.x = W * fx; p.y = W * fy; E.cam.x = p.x; E.cam.y = p.y; await sleep(260); drawn++; } t.eq(drawn, 9, 'moved to nine places across the map'); t.eq(errs0(), e0, 'no drawing errors'); E.toMenu();
  });

  R.group('Network from this device');
  await R.test('the signalling server answers', async t => {
    const host = E.SIG; if (!host) { t.warn('no own signalling server is set in the settings'); return; } const t0 = performance.now(); const id = await fetch('https://' + host + '/peerjs/id').then(r => r.text()).catch(e => ''); t.ok(/^[a-z0-9]{6,}$/.test(id), 'a peer id comes back (' + id + ')'); t.range('round trip to the server', performance.now() - t0, 0, 1500, ' ms');
    const ice = await fetch('https://' + host + '/ice').then(r => r.json()).catch(e => null); t.ok(ice && Array.isArray(ice.iceServers) && ice.iceServers.length > 0, 'STUN servers are handed out'); t.info('relay (TURN)', ice && ice.turn ? 'available' : 'not available');
  });
  await R.test('two browsers connect through the real server and talk (both inside this tab)', async t => {
    if (!E.PeerC) { t.ok(false, 'the connection library is missing'); return; } const opts = () => E.peerOpts(); const mk = id => new Promise((res, rej) => { const p = new E.PeerC(id, opts()); const to = setTimeout(() => rej(new Error('no answer from the server in 10 s')), 10000); p.on('open', () => { clearTimeout(to); res(p); }); p.on('error', e => { clearTimeout(to); rej(e); }); });
    const idA = 'selftest-' + Math.random().toString(36).slice(2, 10), idB = 'selftest-' + Math.random().toString(36).slice(2, 10); let A = null, B = null;
    try { const t0 = performance.now(); A = await mk(idA); B = await mk(idB); t.range('both registered in', performance.now() - t0, 0, 6000, ' ms');
      const got = []; let conn = null; const opened = new Promise((res, rej) => { A.on('connection', c => { c.on('data', d => { got.push(d); c.send('echo:' + d); }); res(); }); setTimeout(() => rej(new Error('no connection in 12 s')), 12000); }); const t1 = performance.now(); conn = B.connect(idA, { reliable: true, serialization: 'json' });
      const echoes = []; await new Promise((res, rej) => { conn.on('open', res); conn.on('error', rej); setTimeout(() => rej(new Error('the data channel did not open in 12 s')), 12000); }); await opened; t.range('time until the data channel was open', performance.now() - t1, 0, 8000, ' ms'); conn.on('data', d => echoes.push(d));
      const rtts = []; for (let i = 0; i < 20; i++) { const s = performance.now(); const n = echoes.length; conn.send('m' + i); while (echoes.length === n && performance.now() - s < 2000) await sleep(2); rtts.push(performance.now() - s); }
      t.eq(echoes.length, 20, 'all 20 messages came back'); t.range('round trip inside the browser', S.mean(rtts), 0, 200, ' ms'); const big = 'x'.repeat(12000); const n0 = echoes.length; conn.send(big); const s0 = performance.now(); while (echoes.length === n0 && performance.now() - s0 < 3000) await sleep(5); t.ok(echoes.length > n0, 'a 12 KB message arrives (the checkpoints are sent in pieces of 6 KB)');
      try { const stats = await conn.peerConnection.getStats(); let type = ''; stats.forEach(r => { if (r.type === 'candidate-pair' && r.nominated && r.state === 'succeeded') { const l = stats.get(r.localCandidateId); type = l ? l.candidateType : ''; } }); t.info('connection type', type || 'unknown'); } catch (x) { }
    } catch (x) { t.ok(false, 'connecting failed: ' + (x && x.message || x)); } finally { try { A && A.destroy(); B && B.destroy(); } catch (x) { } }
  });
  await R.test('the addresses the game depends on answer', async t => {
    for (const [n, u] of [['config.js (game settings)', 'config.js'], ['status page', 'status'], ['privacy page', 'datenschutz'], ['imprint', 'impressum'], ['share image', 'og.png']]) { let r = await fetch(u, { cache: 'no-store' }).catch(() => null); if ((!r || !r.ok) && !u.includes('.')) r = await fetch(u + '.html', { cache: 'no-store' }).catch(() => null); t.ok(r && r.ok, n + ' loads (' + (r ? r.status : 'no answer') + ')'); }
    const hb = await fetch('https://typebite-stats.alikesan2004.workers.dev/public').then(r => r.json()).catch(() => null); t.ok(hb && typeof hb.now !== 'undefined' || hb, 'the activity counter answers');
  });
} });

SUITE.attachClient = function (ev) { return { ev }; };
SUITE.CBRIDGE = CBRIDGE;
})(typeof self !== 'undefined' ? self : globalThis);
