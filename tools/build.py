#!/usr/bin/env python3
"""Builds the single-file game: game.html + music/*.mp3 -> index.html (music embedded as data URIs)."""
import base64, os, re, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(root, 'game.html'), encoding='utf-8').read()
def embed(m):
    data = open(os.path.join(root, 'music', m.group(1)), 'rb').read()
    return 'data:audio/mpeg;base64,' + base64.b64encode(data).decode()
lib = open(os.path.join(root, 'tools', 'peerjs.min.js'), encoding='utf-8').read()
assert '</script' not in lib
src = src.replace('<script src="tools/peerjs.min.js"></script>', '<script>' + lib + '</script>')
def embed_font(m):
    return 'data:font/woff2;base64,' + base64.b64encode(open(os.path.join(root, 'fonts', m.group(1)), 'rb').read()).decode()
src = re.sub(r'fonts/([A-Za-z0-9_-]+\.woff2)', embed_font, src)
out = re.sub(r'music/([A-Za-z0-9_-]+\.mp3)', embed, src)
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', len(out) // 1024, 'KB')
