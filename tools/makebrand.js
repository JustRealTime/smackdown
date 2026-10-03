// Makes the logo images (favicon, app icons, share banner) from tools/brand/mark.svg and the game's own look: node tools/makebrand.js
// Needs Playwright (npm install). Writes into site/ and tools/brand/favicon-datauri.txt (the favicon that game.html contains).
const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),http=require('http');
const ROOT=path.join(__dirname,'..'),mark=fs.readFileSync(path.join(ROOT,'tools/brand/mark.svg'),'utf8');
const font=n=>'data:font/woff2;base64,'+fs.readFileSync(path.join(ROOT,'fonts',n)).toString('base64');
const CSS=`@font-face{font-family:'Lilita One';src:url(${font('lilita-one-400.woff2')})}@font-face{font-family:'Nunito';font-weight:800;src:url(${font('nunito-800.woff2')})}*{box-sizing:border-box;margin:0}body{background:transparent}`;
const svgUri=s=>'data:image/svg+xml,'+encodeURIComponent(s.replace(/\s*\n\s*/g,' ').trim());
const big=mark.replace('<svg ','<svg width="100%" height="100%" ');
(async()=>{const b=await chromium.launch();const pg=await b.newPage();
  const shot=async(html,w,h,out,omit)=>{await pg.setViewportSize({width:w,height:h});await pg.setContent('<style>'+CSS+'</style>'+html);await pg.evaluate(()=>Promise.all([document.fonts.load("100px 'Lilita One'"),document.fonts.load("800 40px Nunito")]));await pg.waitForTimeout(150);fs.writeFileSync(out,await pg.screenshot({omitBackground:omit}))};
  const icon=(size,pad)=>`<div style="width:${size}px;height:${size}px;background:#ff6b3d;display:grid;place-items:center"><div style="width:${size*pad}px;height:${size*pad}px">${big}</div></div>`;
  await shot(icon(180,.78),180,180,path.join(ROOT,'site/apple-touch-icon.png'),false);
  await shot(icon(192,.74),192,192,path.join(ROOT,'site/icon-192.png'),false);
  await shot(icon(512,.74),512,512,path.join(ROOT,'site/icon-512.png'),false);
  await shot(`<div style="width:64px;height:64px">${big}</div>`,64,64,path.join(ROOT,'site/favicon-64.png'),true);
  await shot(`<div style="width:32px;height:32px">${big}</div>`,32,32,path.join(ROOT,'site/favicon-32.png'),true);
  fs.writeFileSync(path.join(ROOT,'site/favicon.svg'),mark);
  const png=fs.readFileSync(path.join(ROOT,'site/favicon-32.png')),h=Buffer.alloc(22);h.writeUInt16LE(1,2);h.writeUInt16LE(1,4);h[6]=32;h[7]=32;h.writeUInt16LE(1,10);h.writeUInt16LE(32,12);h.writeUInt32LE(png.length,14);h.writeUInt32LE(22,18);
  fs.writeFileSync(path.join(ROOT,'site/favicon.ico'),Buffer.concat([h,png]));
  // share banner 1200x630 with the game's own characters and snacks
  const game=fs.readFileSync(path.join(ROOT,'game.html'),'utf8'),i=game.lastIndexOf('})();');
  const page=game.slice(0,i)+'window.__d={sprite,lookOf,foodImg,FOOD_SRC};\n'+game.slice(i);
  const srv=http.createServer((q,r)=>{const u=decodeURIComponent(q.url.split('?')[0]);if(u==='/g.html'){r.writeHead(200,{'content-type':'text/html'});return r.end(page)}const f=path.join(ROOT,u);if(fs.existsSync(f)&&fs.statSync(f).isFile()){r.writeHead(200);fs.createReadStream(f).pipe(r)}else{r.writeHead(404);r.end()}}).listen(8799);
  const gp=await b.newPage({viewport:{width:1200,height:630}});await gp.addInitScript(()=>localStorage.setItem('snackdown-online','no'));await gp.goto('http://localhost:8799/g.html');await gp.waitForFunction(()=>window.__d);
  const art=await gp.evaluate(()=>{const D=window.__d,L=[
    {skin:'#ffd7b0',shirt:'#ff6b3d',hair:'#3b2417',pants:'#3d4a7a',shoes:'#3a2a22',hs:'short',acc:'cap',acol:'#3db5ff',sty:'burger',pst:'jeans',face:'none',fcol:'#2b2140',ex:'none',ecol:'#e8475f'},
    {skin:'#8d5524',shirt:'#9b5de5',hair:'#1f1a17',pants:'#35605a',shoes:'#f2c14e',hs:'afro',acc:'none',acol:'#ffd23f',sty:'hoodie',pst:'cargo',face:'glasses',fcol:'#2b2140',ex:'backpack',ecol:'#2ec4b6'},
    {skin:'#f1c27d',shirt:'#2ec4b6',hair:'#ff4f9a',pants:'#4a3f6b',shoes:'#e8e8e8',hs:'twin',acc:'bow',acol:'#ffd23f',sty:'star',pst:'skirt',face:'freckles',fcol:'#2b2140',ex:'balloon',ecol:'#e8475f'},
    {skin:'#7bd389',shirt:'#ffd23f',hair:'#4b3b8f',pants:'#5c4033',shoes:'#2c6fbb',hs:'spiky',acc:'chef',acol:'#fff',sty:'jersey',pst:'shorts',face:'none',fcol:'#2b2140',ex:'scarf',ecol:'#e8475f'}];
    const url=c=>{const o=document.createElement('canvas');o.width=c.width;o.height=c.height;o.getContext('2d').drawImage(c,0,0);return o.toDataURL()};
    const chars=L.map(l=>url(D.sprite(Object.assign({},l),D.lookOf(1),'down',0)));
    const ids=D.FOOD_SRC.slice(0,40).map(f=>f[0]),foods=[];for(const id of ids){try{const c=D.foodImg(id);if(c&&c.width)foods.push(url(c))}catch(e){}if(foods.length>=5)break}
    return{chars,foods}});
  await gp.close();srv.close();
  const og=`<div style="position:relative;width:1200px;height:630px;overflow:hidden;background:conic-gradient(#8fd16a 25%,#86c963 0 50%,#8fd16a 0 75%,#86c963 0) 0 0/180px 180px">
    <div style="position:absolute;left:50px;top:80px;width:700px;height:470px;background:#fffdf7;border:8px solid #2b2140;border-radius:36px;box-shadow:0 12px 0 #2b2140;padding:34px 40px">
      <div style="display:flex;align-items:center;gap:20px"><div style="width:128px;height:128px;flex:none">${big}</div>
        <div style="font:112px/0.95 'Lilita One';color:#ff6b3d;-webkit-text-stroke:8px #2b2140;paint-order:stroke fill;text-shadow:0 9px 0 #2b2140;letter-spacing:1px">Typebite</div></div>
      <div style="font:800 38px/1.25 Nunito;color:#2b2140;margin-top:56px;white-space:nowrap">Eat snacks. Win typing duels.<br>Eat everyone else.</div>
      <div style="font:800 26px Nunito;color:#6b6180;margin-top:28px">Free in your browser · typebite.io</div></div>
    ${art.chars.map((c,i)=>`<img src="${c}" style="image-rendering:pixelated;position:absolute;width:${230}px;left:${[790,1000,800,1005][i]}px;top:${[30,40,320,330][i]}px;filter:drop-shadow(0 12px 0 rgba(43,33,64,.35))">`).join('')}
    ${art.foods.map((c,i)=>`<img src="${c}" style="position:absolute;width:96px;left:${[740,1090,1010,870,1110][i]}px;top:${[520,40,540,540,470][i]}px">`).join('')}</div>`;
  await shot(og,1200,630,path.join(ROOT,'site/og.png'),false);
  // everything in one folder for videos and posts (grafiken/, not in git)
  const G=path.join(ROOT,'grafiken');fs.mkdirSync(G,{recursive:true});
  for(const f of ['icon-512.png','icon-192.png','apple-touch-icon.png','og.png','favicon.svg'])fs.copyFileSync(path.join(ROOT,'site',f),path.join(G,{'og.png':'banner-1200x630.png','icon-512.png':'app-icon-512.png','icon-192.png':'app-icon-192.png','apple-touch-icon.png':'app-icon-180.png','favicon.svg':'logo-keks.svg'}[f]||f));
  const word=`<div style="display:inline-flex;align-items:center;gap:30px;padding:40px 60px"><div style="width:380px;height:380px">${big}</div><div style="font:340px/0.95 'Lilita One';color:#ff6b3d;-webkit-text-stroke:22px #2b2140;paint-order:stroke fill;text-shadow:0 26px 0 #2b2140;letter-spacing:2px">Typebite</div></div>`;
  await pg.setViewportSize({width:2200,height:700});await pg.setContent('<style>'+CSS+'</style>'+word);await pg.evaluate(()=>Promise.all([document.fonts.load("100px 'Lilita One'")]));await pg.waitForTimeout(150);
  fs.writeFileSync(path.join(G,'logo-mit-name.png'),await (await pg.$('div')).screenshot({omitBackground:true}));
  await shot(`<div style="width:1024px;height:1024px">${big}</div>`,1024,1024,path.join(G,'logo-keks-1024.png'),true);
  await shot(`<div style="width:1080px;height:1920px;background:conic-gradient(#8fd16a 25%,#86c963 0 50%,#8fd16a 0 75%,#86c963 0) 0 0/270px 270px;display:grid;place-items:center"><div style="width:880px;background:#fffdf7;border:14px solid #2b2140;border-radius:60px;box-shadow:0 22px 0 #2b2140;padding:70px 40px;text-align:center"><div style="width:420px;height:420px;margin:0 auto">${big}</div><div style="font:200px/1 'Lilita One';color:#ff6b3d;-webkit-text-stroke:14px #2b2140;paint-order:stroke fill;text-shadow:0 16px 0 #2b2140;margin-top:30px">Typebite</div><div style="font:800 72px/1.2 Nunito;color:#2b2140;margin-top:50px">Play free in your browser</div><div style="font:800 96px Nunito;color:#ff6b3d;margin-top:20px">typebite.io</div><div style="display:inline-block;font:800 54px Nunito;color:#fff;background:#ff6b3d;border-radius:20px;padding:6px 26px;margin-top:40px;letter-spacing:2px">ALPHA</div></div></div>`,1080,1920,path.join(G,'tiktok-endkarte-1080x1920.png'),false);
  fs.writeFileSync(path.join(ROOT,'tools/brand/favicon-datauri.txt'),svgUri(mark));
  console.log('ok; favicon uri',svgUri(mark).length,'bytes');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
