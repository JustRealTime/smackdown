#!/usr/bin/env python3
"""Builds the single-file game: game.html + music/*.mp3 -> index.html (music embedded as data URIs)."""
import base64, os, re, sys
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(root, 'game.html'), encoding='utf-8').read()
def embed(m):
    data = open(os.path.join(root, 'music', m.group(1)), 'rb').read()
    return 'data:audio/mpeg;base64,' + base64.b64encode(data).decode()
out = re.sub(r'music/([A-Za-z0-9_-]+\.mp3)', embed, src)
open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
print('index.html', len(out) // 1024, 'KB')
