#!/usr/bin/env python3
"""Writes music/test/nocturne_test.mid: a short original piano nocturne in the style of Chopin (test for MIDI music in the game).

Not a Chopin work: own melody and harmony, only the style (6/8, D-flat major, wide left-hand arpeggios,
singing right hand with turns and runs, a stormier middle part in B-flat minor, rubato, sustain pedal).
Run: python3 tools/nocturne.py   (no packages needed). The game plays the file in Settings > Test music.
"""
import os, random, struct

random.seed(7)
TPQ = 480                 # ticks per quarter
E = TPQ // 2              # one eighth
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'music', 'test', 'nocturne_test.mid')

PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def n(s):   # 'Db5' -> 73
    p = PC[s[0]]; i = 1
    while s[i] in 'b#': p += -1 if s[i] == 'b' else 1; i += 1
    return 12 * (int(s[i:]) + 1) + p

# left hand voicings: bass, then three chord tones going up (wide, like a nocturne)
CH = {
    'Db':     [37, 44, 53, 56],  'Ab7/Db': [37, 44, 54, 60],  'Gb':   [42, 49, 58, 61],  'Gbm':  [42, 49, 57, 61],
    'Db/F':   [41, 49, 56, 61],  'Bbm':    [34, 41, 49, 53],  'Eb7':  [39, 46, 55, 61],  'Ebm7': [39, 46, 54, 61],
    'Db/Ab':  [32, 44, 49, 53],  'Ab7':    [32, 44, 54, 60],  'F7':   [41, 48, 51, 57],  'Cdim7': [36, 45, 51, 54],
    'Bbm/F':  [41, 46, 49, 53],  'Gb7':    [42, 49, 52, 58],  'Ebm/Gb': [42, 46, 51, 58], 'Ebm':  [39, 46, 54, 58],
    'Gbm/Db': [37, 45, 49, 54],  'Dbend':  [25, 37, 44, 53, 56],
}
def run(names, d): return [(x, d) for x in names.split()]

# every bar: (left hand mode, chords [(name, eighths)], melody [(note, eighths)], loudness 0..1, tempo factor)
# modes: 8 = eighth arpeggios, 16 = sixteenth arpeggios, hold = rolled chord, none = no left hand
B = []
def bar(mode, chords, mel, dyn, tempo=1.0): B.append((mode, chords, mel, dyn, tempo))
# intro
bar('8', [('Db', 6)], [], .42, .96)
# A
bar('8', [('Db', 6)], [('F5', 3), ('Eb5', 1), ('Db5', 1), ('Eb5', 1)], .50)
bar('8', [('Ab7/Db', 6)], [('F5', 2), ('Gb5', 1), ('F5', 2), ('Eb5', 1)], .53)
bar('8', [('Db', 6)], [('Db5', 3), ('C5', 1), ('Db5', 1), ('F5', 1)], .52)
bar('8', [('Gb', 3), ('Gbm', 3)], [('Bb5', 3), ('A5', 1), ('Ab5', 2)], .58)
bar('8', [('Db/F', 3), ('Bbm', 3)], [('Ab5', 2), ('F5', 1), ('Db6', 2), ('Bb5', 1)], .64)
bar('8', [('Eb7', 3), ('Ebm7', 3)], [('G5', 2), ('Ab5', 1), ('Gb5', 2), ('F5', 1)], .60)
bar('8', [('Db/Ab', 3), ('Ab7', 3)], [('F5', 2), ('Db5', 1), ('Eb5', 2)] + run('F5 Eb5 D5 Eb5', .25), .52, .9)
bar('8', [('Db', 6)], [('Db5', 3), ('F4', 1), ('Ab4', 1), ('Db5', .5), ('Eb5', .5)], .46, .88)
# A' (decorated)
bar('8', [('Db', 6)], [('F5', 2)] + run('Gb5 F5 E5', 1/3) + [('F5', 1), ('Ab5', 1), ('Db6', 1)], .55)
bar('8', [('Ab7/Db', 6)], [('C6', 2), ('Bb5', .5), ('Ab5', .5), ('Gb5', 2), ('F5', 1)], .60)
bar('8', [('Db', 6)], [('F5', 1.5), ('Eb5', .5), ('Db5', 1), ('Ab4', 1), ('Db5', 1), ('F5', 1)], .56)
bar('8', [('Gb', 3), ('Gbm', 3)], [('Bb5', 2), ('Db6', 1), ('A5', 1.5), ('Ab5', 1.5)], .63)
bar('8', [('Db/F', 3), ('Bbm', 3)], [('Ab5', 1.5), ('F5', .5), ('Ab5', .5), ('Db6', .5), ('Db6', 1.5), ('Bb5', 1.5)], .70)
bar('8', [('Eb7', 3), ('Ebm7', 3)], [('G5', 1.5), ('Ab5', .5), ('Bb5', 1), ('Gb5', 1.5), ('F5', .5), ('Eb5', 1)], .66)
bar('8', [('Db/Ab', 3), ('Ab7', 3)], [('F5', 1), ('Ab5', 1), ('F5', 1), ('Eb5', 1)] + run('Db5 Eb5 F5 Gb5 Ab5 Bb5 C6 Db6', .25), .64, .94)
bar('8', [('Db', 6)], [('Db6', 3), ('Ab5', 1), ('F5', 1), ('Db5', 1)], .55, .86)
# B: B-flat minor, a little faster and stormier
bar('16', [('Bbm', 6)], [('F5', 2), ('E5', 1), ('F5', 1), ('Bb5', 2)], .66, 1.06)
bar('16', [('Gb', 3), ('F7', 3)], [('Bb5', 1.5), ('Ab5', .5), ('Gb5', 1), ('A5', 2), ('C6', 1)], .72, 1.08)
bar('16', [('Bbm', 6)], [('Db6', 3), ('C6', 1), ('Bb5', 1), ('Ab5', 1)], .76, 1.08)
bar('16', [('Ebm', 3), ('Cdim7', 3)], [('Gb5', 2), ('F5', .5), ('Eb5', .5), ('Eb6', 2), ('A5', 1)], .84, 1.06)
bar('16', [('Bbm/F', 3), ('F7', 3)], [('Bb5', 1.5), ('Db6', .5), ('C6', 1), ('Eb6', 1.5), ('C6', .5), ('A5', 1)], .90, 1.02)
bar('16', [('Bbm', 3), ('Gb7', 3)], [('Bb5', 2), ('F5', 1), ('E5', 2), ('Eb5', 1)], .80, 1.04)
bar('16', [('Ebm/Gb', 3), ('F7', 3)], [('Eb5', 1.5), ('Gb5', .5), ('Bb5', 1), ('A5', 1.5), ('C6', .5), ('Eb6', 1)], .78, .98)
bar('hold', [('Ab7', 6)], [('Eb6', 1.5)] + run('Db6 C6 Bb5 Ab5 Gb5 F5 Eb5 Db5', .25) + [('C5', .5), ('Db5', .5), ('Eb5', 1.5)], .62, .74)
# A'' (dolce, with fioritura)
bar('8', [('Db', 6)], [('F5', 3)] + run('Gb5 F5 Eb5 F5', .25) + [('Ab5', 1), ('Eb5', 1)], .50)
bar('8', [('Ab7/Db', 6)], [('F5', 1.5), ('Gb5', .5), ('Ab5', 1), ('Gb5', 1.5), ('F5', .5), ('Eb5', 1)], .54)
bar('8', [('Db', 6)], [('Db5', 2), ('C5', .5), ('Db5', .5), ('F5', 1), ('Ab5', 1), ('Db6', 1)], .55)
bar('8', [('Gb', 3), ('Gbm', 3)], [('Bb5', 2), ('Db6', 1), ('A5', 2), ('Ab5', 1)], .60)
bar('8', [('Db/F', 3), ('Bbm', 3)], [('Ab5', 1)] + run('Bb5 C6 Db6 Eb6 F6 Gb6 F6 Eb6 Db6 C6 Bb5 Ab5', 1/6) + [('Bb5', 2), ('Ab5', 1)], .64, .97)
bar('8', [('Eb7', 3), ('Ebm7', 3)], [('G5', 1), ('Bb5', 1), ('Db6', 1), ('Gb5', 1.5), ('F5', .5), ('Eb5', 1)], .58)
bar('8', [('Db/Ab', 3), ('Ab7', 3)], [('F5', 1.5), ('Ab5', .5), ('F5', 1), ('Eb5', 1)] + run('F5 Eb5 D5 Eb5', .25) + [('C5', 1)], .52, .9)
bar('8', [('Db', 6)], [('Db5', 6)], .46, .9)
# coda over a D-flat pedal
bar('8', [('Db', 3), ('Gbm/Db', 3)], [('Ab5', 3), ('A5', 1.5), ('Ab5', 1.5)], .44, .95)
bar('8', [('Db', 3), ('Ab7/Db', 3)], [('F5', 2), ('Eb5', 1), ('Gb5', 2), ('F5', 1)], .42, .93)
bar('8', [('Db', 6)], [('Db6', 3), ('Ab5', 1), ('F5', 1), ('Db5', 1)], .38, .88)
bar('8', [('Gbm/Db', 3), ('Db', 3)], [('A5', 3), ('Ab5', 3)], .34, .8)
bar('8', [('Db', 6)], [('F5', 6)], .30, .72)
bar('hold', [('Dbend', 6)], [], .30, .5)

for i, (_, ch, mel, _, _) in enumerate(B):
    assert abs(sum(d for _, d in ch) - 6) < 1e-6, ('chords', i)
    assert not mel or abs(sum(d for _, d in mel) - 6) < 1e-6, ('melody', i, sum(d for _, d in mel))

BAR = 6 * E
f = pf = 1.0
notes = []   # (tick, ticks, pitch, velocity, track)  track 0 = right hand, 1 = left hand
pedal = []   # (tick, down)
tempo = []   # (tick, microseconds per quarter)
jit = lambda a: random.randint(-a, a)
vel = lambda x: max(1, min(127, int(round(x))))

for b, (mode, chords, mel, dyn, tf) in enumerate(B):
    t0 = b * BAR
    # rubato: a gentle swell inside a bar (tf >= 1); tf < 1 slows down smoothly from where the last bar ended
    for k in range(6):
        pf = f if tf >= 1 else pf + (tf - pf) / (6 - k)
        f = tf * (1 + .035 * (1 - abs(k - 2.5) / 2.5)) if tf >= 1 else pf
        tempo.append((t0 + k * E, int(round(60e6 / (81 * f)))))
    # left hand and pedal: a fresh pedal for every chord
    pos = 0
    for name, d in chords:
        v = CH[name]; s = t0 + int(pos * E); L = int(d * E); lv = 30 + 52 * dyn
        pedal.append((s - 6, False)); pedal.append((s + 30, True))
        if mode == '8':
            pat = [v[0], v[1], v[2], v[3], v[2], v[1]] if d == 6 else [v[0], v[1], v[3]]
            for j, p in enumerate(pat):
                st = s + j * E + (jit(6) if j else 0)
                notes.append((st, L if j == 0 else E + 40, p, vel(lv + (8 if j == 0 else -4 if j % 3 else 0) + jit(3)), 1))
        elif mode == '16':
            pat = ([v[0], v[1], v[2], v[3], v[2], v[1]] * 2)[:int(d * 2)]
            for j, p in enumerate(pat):
                st = s + j * (E // 2) + (jit(4) if j else 0)
                notes.append((st, L if j == 0 else E // 2 + 30, p, vel(lv + (10 if j == 0 else 2 if j % 6 == 3 else -6) + jit(3)), 1))
        elif mode == 'hold':
            for j, p in enumerate(v):
                notes.append((s + j * 34, L - j * 34, p, vel(lv + (10 if j == 0 else -2)), 1))
        pos += d
    # right hand: singing line, a touch after the bass, with harmony notes on long notes
    pos = 0; chpos = []; c = 0
    for name, d in chords: chpos.append((c, c + d, CH[name])); c += d
    for i, (nm, d) in enumerate(mel):
        p = n(nm); st = t0 + int(round(pos * E)); L = int(round(d * E))
        shape = 1 - abs(pos - 2.5) / 12                 # a little louder in the middle of the bar
        strong = 6 if pos in (0, 3) else 0
        mv = 50 + 62 * dyn * shape + strong - (8 if d < .5 else 0) + jit(3)
        legato = i + 1 < len(mel) and n(mel[i + 1][0]) != p
        notes.append((st + 12 + jit(4), L + (25 if d >= .5 else 6 if legato else -10) if legato else L - 20, p, vel(mv), 0))
        cur = next(ch for a, z, ch in chpos if a - 1e-6 <= pos < z)
        pcs = {x % 12 for x in cur}
        if mode == '16' and d >= 1:
            notes.append((st + 14, L + 20, p - 12, vel(mv - 14), 0))       # octaves in the stormy part
        elif d >= 2 and b > 8:
            low = [q for q in range(p - 9, p - 2) if q % 12 in pcs]
            if low: notes.append((st + 16, L + 20, max(low), vel(mv - 20), 0))
        pos += d
    if mode == 'hold' and b == len(B) - 1:   # final rolled chord in the right hand too
        for j, nm in enumerate(['Ab4', 'Db5', 'F5', 'Ab5', 'Db6']):
            notes.append((t0 + 200 + j * 40, BAR - 200 - j * 40, n(nm), vel(48 + j * 3), 0))
end = len(B) * BAR
pedal.append((end + E, False))

# ---- write a type 1 MIDI file: conductor track, right hand, left hand (both piano, sustain pedal on both) ----
def vlq(x):
    out = [x & 127]; x >>= 7
    while x: out.insert(0, (x & 127) | 128); x >>= 7
    return bytes(out)
def track(evs, name):
    evs = sorted(evs, key=lambda e: (e[0], e[1]))
    data = b'\x00\xff\x03' + vlq(len(name)) + name.encode(); last = 0
    for t, _, b in evs: data += vlq(max(0, t - last)) + b; last = max(last, t)
    data += b'\x00\xff\x2f\x00'
    return b'MTrk' + struct.pack('>I', len(data)) + data
cond = [(0, 0, b'\xff\x58\x04\x06\x03\x24\x08'), (0, 0, b'\xff\x59\x02\xfb\x00')]
lastus = None
for t, us in tempo:
    if us != lastus: cond.append((t, 1, b'\xff\x51\x03' + us.to_bytes(3, 'big'))); lastus = us
tracks = [track(cond, 'Nocturne (test, in the style of Chopin)')]
for tr, ch, nm in ((0, 0, 'Right hand'), (1, 1, 'Left hand')):
    ev = [(0, 0, bytes([0xC0 | ch, 0]))]
    for t, d, p, v, w in notes:
        if w != tr: continue
        t = max(0, t); ev.append((t, 3, bytes([0x90 | ch, p, v]))); ev.append((t + max(20, d), 1, bytes([0x80 | ch, p, 64])))
    for t, down in pedal: ev.append((max(0, t), 2, bytes([0xB0 | ch, 64, 127 if down else 0])))
    tracks.append(track(ev, nm))
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'wb') as f: f.write(b'MThd' + struct.pack('>IHHH', 6, 1, len(tracks), TPQ) + b''.join(tracks))
print(os.path.normpath(OUT), len(notes), 'notes,', len(B), 'bars')
