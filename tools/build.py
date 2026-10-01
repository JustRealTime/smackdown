#!/usr/bin/env python3
"""Builds the single-file game: game.html + music/*.mp3 -> index.html (music embedded as data URIs)."""
import base64, os, re, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(root, 'game.html'), encoding='utf-8').read()
def embed(m):
    data = open(os.path.join(root, 'music', m.group(1)), 'rb').read()
    return 'data:audio/mpeg;base64,' + base64.b64encode(data).decode()
lib = open(os.path.join(root, 'tools', 'peerjs.min.js'), encoding='utf-8').read()
# settings: the game ships with a copy of site/config.js (the defaults); a config.js next to the page overrides it at runtime
cfg = open(os.path.join(root, 'site', 'config.js'), encoding='utf-8').read()
assert '</script' not in cfg and cfg.count('window.TYPEBITE_CONFIG') == 1
defaults = cfg.replace('window.TYPEBITE_CONFIG', 'window.TYPEBITE_DEFAULTS', 1)
hook = "addEventListener('error',function(e){if(/config\\.js/.test(e.filename||''))window.__cfgErr=(e.message||'error')+(e.lineno?' (line '+e.lineno+')':'')});"
tag = '<script src="site/config.js"></script>'
assert src.count(tag) == 1, 'game.html needs exactly one ' + tag
src = src.replace(tag, '<script>' + hook + defaults + '</script>\n<script src="config.js"></script>')
assert '</script' not in lib
src = src.replace('<script src="tools/peerjs.min.js"></script>', '<script>' + lib + '</script>')
def embed_font(m):
    return 'data:font/woff2;base64,' + base64.b64encode(open(os.path.join(root, 'fonts', m.group(1)), 'rb').read()).decode()
src = re.sub(r'fonts/([A-Za-z0-9_-]+\.woff2)', embed_font, src)
out = re.sub(r'music/([A-Za-z0-9_-]+\.mp3)', embed, src)
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', len(out) // 1024, 'KB')
