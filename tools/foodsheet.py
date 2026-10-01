#!/usr/bin/env python3
"""Paints a contact sheet of every food in game.html (to check new sprites). Usage: python3 tools/foodsheet.py [out.html]
Open the html in a browser or screenshot it (Playwright). It cuts the food block out of game.html, so it is always current."""
import re, sys
src = open('game.html', encoding='utf-8').read()
a = src.index('/* ---------- food ---------- */')
b = src.index('for(let i=0;i<FOOD_OUT;i++)spawnFood(false);')
block = src[a:b]
html = '''<!doctype html><meta charset=utf-8><body style="margin:0;background:#8fd16a"><canvas id=cv width=1280 height=1000></canvas><script>
const INK='#2b2140';const rand=(a,b)=>a+Math.random()*(b-a);const pick=a=>a[(Math.random()*a.length)|0];
const cv=document.getElementById('cv');let ctx=cv.getContext('2d');
function freeSpot(){return {x:0,y:0}}function wallHit(){return false}const houses=[{food:1,x:0,y:0,w:300,h:300,type:'diner'}];function biomeAt(){return 0}
''' + block + '''
ctx.fillStyle='#8fd16a';ctx.fillRect(0,0,1280,1000);
let n=0;for(const id of FOODS){const f=FOOD[id],cx=(n%10)*128+64,cy=Math.floor(n/10)*160+70;
  ctx.fillStyle=['#fff','#bfe3ff','#e3ccff','#ffe9a0'][f.tier];ctx.globalAlpha=.55;ctx.fillRect(cx-60,cy-62,120,150);ctx.globalAlpha=1;
  drawFood(id,cx,cy,3);ctx.fillStyle='#222';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(f.name,cx,cy+72);ctx.fillText('x'+f.xp.toFixed(2)+' t'+f.et,cx,cy+86);n++}
document.title=FOODS.length+' foods';
</script>'''
out = sys.argv[1] if len(sys.argv) > 1 else 'foodsheet.html'
open(out, 'w', encoding='utf-8').write(html)
print('wrote', out)
