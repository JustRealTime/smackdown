"""Small toolkit to write Typebite's music as MIDI files (no packages needed). Used by tools/compose.py.

Everything is General MIDI: channel 10 (index 9) is drums, programs are GM numbers, pitch bend range is +-2 semitones.
The game plays the files with its own synth (game.html: synth/music), any MIDI player or DAW can open them too.
"""
import random, struct
from fractions import Fraction

TPQ = 480
_PC = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def n(s):
    """'C#4' -> 61 (C4 = 60); flats with b."""
    p = _PC[s[0]]; i = 1
    while i < len(s) and s[i] in 'b#':
        p += -1 if s[i] == 'b' else 1; i += 1
    return 12 * (int(s[i:]) + 1) + p


def pc(s):
    p = _PC[s[0]]
    for c in s[1:]: p += -1 if c == 'b' else 1 if c == '#' else 0
    return p % 12


QUAL = {
    '': [0, 4, 7], 'm': [0, 3, 7], 'dim': [0, 3, 6], 'aug': [0, 4, 8], 'sus4': [0, 5, 7], 'sus2': [0, 2, 7], '5': [0, 7],
    '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9], '69': [0, 4, 7, 9, 14], 'add9': [0, 4, 7, 14], 'madd9': [0, 3, 7, 14],
    'maj7': [0, 4, 7, 11], 'maj9': [0, 4, 7, 11, 14], 'maj7#11': [0, 4, 7, 11, 18], 'maj13': [0, 4, 7, 11, 14, 21], 'maj9#11': [0, 4, 7, 11, 14, 18],
    '7': [0, 4, 7, 10], '9': [0, 4, 7, 10, 14], '13': [0, 4, 7, 10, 14, 21], '7b9': [0, 4, 7, 10, 13], '7#9': [0, 4, 7, 10, 15],
    '7b13': [0, 4, 7, 10, 20], '7#11': [0, 4, 7, 10, 18], '7alt': [0, 4, 10, 13, 20], '7sus4': [0, 5, 7, 10], '9sus4': [0, 5, 7, 10, 14],
    '13sus4': [0, 5, 7, 10, 14, 21], '11': [0, 7, 10, 14, 17], 'm7': [0, 3, 7, 10], 'm9': [0, 3, 7, 10, 14], 'm11': [0, 3, 7, 10, 14, 17],
    'mmaj7': [0, 3, 7, 11], 'm7b5': [0, 3, 6, 10], 'dim7': [0, 3, 6, 9], 'm6/9': [0, 3, 7, 9, 14], '7b9b13': [0, 4, 10, 13, 20],
}


def chord(name):
    """'Ebmaj7#11', 'F#m7b5', 'Bb/C' -> (root pc, intervals, bass pc)."""
    bass = None
    if '/' in name and not name.endswith('/9'):
        name, b = name.rsplit('/', 1); bass = pc(b)
    r = _PC[name[0]]; i = 1
    while i < len(name) and name[i] in 'b#':
        r += -1 if name[i] == 'b' else 1; i += 1
    q = name[i:]
    if q not in QUAL: raise ValueError('unknown chord ' + name)
    return r % 12, QUAL[q], (r % 12 if bass is None else bass)


def stack(name, lo, root=True):
    """chord tones stacked upwards from lo in the order of the chord formula (root, 3, 5, 7, 9, ...)."""
    r, iv, _ = chord(name)
    ivs = [x for x in iv if x % 12] if not root and len(iv) > 3 else iv
    out = []; cur = lo - 1
    for x in ivs:
        p = cur + 1
        while p % 12 != (r + x) % 12: p += 1
        out.append(p); cur = p
    return out


def vl(name, center, root=True, k=None):
    """a voicing whose middle is close to center (cheap voice leading); k = keep only the top k notes."""
    best = None
    for lo in range(center - 16, center + 2):
        v = stack(name, lo, root)
        if k: v = v[-k:]
        sc = abs(sum(v) / len(v) - center)
        if best is None or sc < best[0]: best = (sc, v)
    return best[1]


def bassnote(name, lo=28):
    b = chord(name)[2]; p = lo
    while p % 12 != b: p += 1
    return p


def frac(s):
    return float(Fraction(s)) if s else 1.0


class Song:
    def __init__(s, name, bpm, num=4, den=4, seed=1, title=''):
        s.name, s.title = name, title or name
        s.tracks, s.tempo, s.sig = [], [(0, bpm)], [(0, num, den)]
        s.rng = random.Random(seed); s.num, s.den = num, den; s.starts = [0]; s.bpm = bpm

    def bars(s, count, num=None, den=None):
        """append bars (optionally with a new time signature)."""
        if num and (num, den) != (s.num, s.den):
            s.sig.append((s.starts[-1], num, den)); s.num, s.den = num, den
        L = TPQ * 4 * s.num // s.den
        for _ in range(count): s.starts.append(s.starts[-1] + L)
        return len(s.starts) - 1

    def bar(s, i, beat=0):
        return s.starts[i] + int(round(beat * TPQ))

    def barlen(s, i):
        return s.starts[i + 1] - s.starts[i]

    @property
    def end(s): return s.starts[-1]

    def set_tempo(s, t, bpm): s.tempo.append((int(t), bpm))

    def rit(s, t0, t1, bpm0, bpm1, steps=8):
        for i in range(steps + 1): s.set_tempo(t0 + (t1 - t0) * i / steps, bpm0 + (bpm1 - bpm0) * i / steps)

    def track(s, name, prog, ch, vol=100, pan=64):
        # mix for the sample font (r57): bass sits lower, drums a little lower; the lead stays on top
        if ch != 9 and 32 <= prog <= 39: vol = int(vol * .5)
        elif ch == 9: vol = int(vol * .9)
        t = Track(s, name, prog, ch, vol, pan); s.tracks.append(t); return t

    def bpm_at(s, t):
        b = s.tempo[0][1]
        for tt, bb in s.tempo:
            if tt <= t: b = bb
        return b

    def write(s, path, skip=0):
        """skip = number of bars to cut from the start (fight music has to begin right away): everything shifts, the tempo in force stays."""
        off = s.starts[skip]; end = s.end - off
        def vlq(x):
            out = [x & 127]; x >>= 7
            while x: out.insert(0, (x & 127) | 128); x >>= 7
            return bytes(out)
        def shift(evs):
            out = []; i = 0
            while i < len(evs):
                t, k, b = evs[i]
                if k == 3:   # a note on is directly followed by its note off
                    if t >= off: out.append((t - off, k, b)); out.append((evs[i + 1][0] - off, evs[i + 1][1], evs[i + 1][2]))
                    i += 2; continue
                out.append((max(0, t - off), k, b)); i += 1
            return out
        def chunk(evs, name):
            evs = sorted(evs, key=lambda e: (e[0], e[1]))
            d = b'\x00\xff\x03' + vlq(len(name)) + name.encode(); last = 0
            for t, _, b in evs:
                t = min(t, end)   # a loop ends exactly at the last bar line
                d += vlq(max(0, t - last)) + b; last = max(last, t)
            d += vlq(max(0, end - last)) + b'\xff\x2f\x00'
            return b'MTrk' + struct.pack('>I', len(d)) + d
        cond = []
        for t, num, den in s.sig: cond.append((t, 0, bytes([0xff, 0x58, 4, num, {2: 1, 4: 2, 8: 3, 16: 4}[den], 24, 8])))
        for t, bpm in s.tempo: cond.append((int(t), 0, b'\xff\x51\x03' + int(round(60e6 / bpm)).to_bytes(3, 'big')))
        cond = [(max(0, t - off), k, b) for t, k, b in sorted(cond, key=lambda e: e[0])]
        out = [chunk(cond, s.title)] + [chunk(shift(t.events()), t.name) for t in s.tracks]
        with open(path, 'wb') as f: f.write(b'MThd' + struct.pack('>IHHH', 6, 1, len(out), TPQ) + b''.join(out))
        return sum(len(t.ev) for t in s.tracks) // 2


class Track:
    def __init__(s, song, name, prog, ch, vol, pan):
        s.song, s.name, s.prog, s.ch, s.ev = song, name, prog, ch, []
        s.head = [(0, 0, bytes([0xC0 | ch, prog])), (0, 0, bytes([0xB0 | ch, 7, vol])), (0, 0, bytes([0xB0 | ch, 10, pan]))]

    def events(s): return s.head + s.ev

    def note(s, t, d, p, v, jit=0):
        r = s.song.rng
        if jit: t += r.randint(-jit, jit)
        t = max(0, int(t)); d = max(12, int(d)); v = max(1, min(127, int(round(v))))
        if not 0 <= p <= 127: return
        s.ev.append((t, 3, bytes([0x90 | s.ch, p, v]))); s.ev.append((t + d, 1, bytes([0x80 | s.ch, p, 64])))

    def chord(s, t, d, ps, v, strum=0, jit=0):
        for i, p in enumerate(sorted(ps)): s.note(t + i * strum, d - i * strum, p, v - (0 if i == len(ps) - 1 else 6), jit)

    def cc(s, t, c, val): s.ev.append((max(0, int(t)), 2, bytes([0xB0 | s.ch, c, max(0, min(127, int(val)))])))
    def pedal(s, t, down): s.cc(t, 64, 127 if down else 0)
    def bend(s, t, cents):
        x = max(0, min(16383, int(round(8192 + cents / 200 * 8192))))
        s.ev.append((max(0, int(t)), 2, bytes([0xE0 | s.ch, x & 127, x >> 7])))

    def swell(s, t0, t1, v0, v1, steps=12):
        for i in range(steps + 1): s.cc(t0 + (t1 - t0) * i / steps, 11, v0 + (v1 - v0) * i / steps)

    def ms(s, t, ms): return int(ms / 1000 * s.song.bpm_at(t) / 60 * TPQ)


def mel(trk, t0, text, unit=TPQ // 4, v=90, leg=1.0, jit=3, bar=None, oct=0, tr=0):
    """melody notation, one token per note: NAME:DUR with DUR in units (fractions ok: 4/3).
    NAME: C5, Bb4, r (rest), [C5,E5,G5] (chord), D3P (power chord: root, fifth, octave).
    suffixes after DUR: ! accent, _ soft, . short, ^ bend up a whole step into the note, / slide up a half step.
    '|' checks that a full bar has passed (bar = ticks per bar). Returns the end tick."""
    t = t0; s = trk.song
    for tok in text.split():
        if tok == '|':
            if bar and (t - t0) % bar: raise ValueError('%s: bar check failed at tick %d (%.3f bars) in %s' % (trk.name, t - t0, (t - t0) / bar, text[:60]))
            continue
        name, _, du = tok.partition(':'); mods = ''
        while du and du[-1] in '!_^/.': mods = du[-1] + mods; du = du[:-1]
        d = int(round(frac(du) * unit))
        if name != 'r':
            ps = []
            for x in name.strip('[]').split(','):
                if x.endswith('P'): b = n(x[:-1]); ps += [b, b + 7, b + 12]
                else: ps.append(n(x))
            ps = [p + 12 * oct + tr for p in ps]
            vel = v + (16 if '!' in mods else 0) - (20 if '_' in mods else 0)
            dur = d * (0.42 if '.' in mods else leg)
            for p in ps: trk.note(t, dur, p, vel, jit)
            if '^' in mods or '/' in mods:
                depth = -200 if '^' in mods else -100; L = trk.ms(t, 110 if '^' in mods else 55)
                trk.bend(t - 2, depth)
                for i in range(1, 7): trk.bend(t + L * i // 6, depth * (1 - i / 6) ** 1.6)
        t += d
    return t


def timeline(t0, prog, beat=TPQ):
    """[(chord, beats), ...] -> [(start, end, chord)]"""
    out = []; t = t0
    for name, b in prog:
        L = int(round(b * beat)); out.append((t, t + L, name)); t += L
    return out


def at(tl, t):
    for a, z, c in tl:
        if a <= t < z: return c
    return tl[-1][2]


def after(tl, t):
    for a, z, c in tl:
        if a > t: return c
    return tl[0][2]


DRUM = {'k': 36, 'k2': 35, 's': 38, 'x': 37, 'cl': 39, 'h': 42, 'p': 44, 'o': 46, 'c': 49, 'C': 57, 'r': 51, 'b': 53, 'ch': 52, 'sp': 55,
        't1': 50, 't2': 48, 't3': 45, 't4': 43, 't5': 41, 'sh': 70, 'cb': 56, 'tb': 54, 'bh': 60, 'bl': 61, 'cgm': 62, 'cgo': 63, 'cgl': 64,
        'tih': 65, 'til': 66, 'cla': 75, 'wb': 76, 'tri': 81}
VEL = {'X': 122, 'x': 98, 'm': 76, 'g': 42}


def beat(trk, t0, bars, pats, steps=16, barlen=TPQ * 4, vel=1.0, swing=0.0, jit=3):
    """drum grid: {'k': 'x...x...', 's': '....x...'}; a string covers one bar (repeats) or all bars. X accent, x hit, m medium, g ghost."""
    st = barlen / steps
    for nm, pat in pats.items():
        pat = pat.replace(' ', ''); L = len(pat)
        for i in range(steps * bars):
            c = pat[i % L]
            if c not in VEL: continue
            tt = t0 + i * st + (swing * st if i % 2 else 0)
            trk.note(tt, st * .8, DRUM[nm], VEL[c] * vel, jit)


def fill(trk, t, beats, kind='toms', v=96, crash=True):
    """a drum fill in 16ths ending on the next downbeat (with a crash)."""
    st = TPQ // 4; k = beats * 4
    seq = {'toms': ['t1', 't1', 't2', 't2', 't3', 't3', 't4', 't4', 't5', 't5', 't4', 't5'],
           'snare': ['s'] * 16, 'mix': ['s', 's', 't1', 't1', 's', 't2', 't3', 't3', 's', 't4', 't5', 't5']}[kind]
    for i in range(k):
        nm = seq[(i + len(seq) - k) % len(seq)] if kind != 'snare' else 's'
        trk.note(t + i * st, st * .8, DRUM[nm], v * (.7 + .3 * i / k), 2)
    if crash:
        trk.note(t + k * st, TPQ, DRUM['c'], 118); trk.note(t + k * st, TPQ, DRUM['k'], 115)


def bassline(trk, t0, tl, tmpl, bars, barlen=TPQ * 4, steps=16, lo=28, v=96, jit=4):
    """bass from a 16th template per bar (list or one string): R root, O octave, 5 fifth, 3 third, 7 seventh,
    A approach (half step below the next chord's root), x dead note, '-' hold, '.' rest. Uppercase S = slap accent root."""
    st = barlen // steps
    if isinstance(tmpl, str): tmpl = [tmpl]
    notes = []
    for b in range(bars):
        pat = tmpl[b % len(tmpl)].replace(' ', '')
        for i, c in enumerate(pat):
            t = t0 + b * barlen + i * st
            if c == '-':
                if notes: notes[-1][1] += st
                continue
            if c == '.': continue
            ch = at(tl, t); r, iv, bpc = chord(ch); root = bassnote(ch, lo)
            fifth = root + 7; third = root + (iv[1] if len(iv) > 1 else 4); sev = root + next((x for x in iv if x in (9, 10, 11)), 10)
            nxt = bassnote(after(tl, t), lo)
            p, vv, d = {'R': (root, v, st), 'S': (root, v + 18, st), 'O': (root + 12, v + 10, st), '5': (fifth, v - 6, st), '3': (third, v - 8, st),
                        '7': (sev, v - 8, st), 'A': (nxt - 1, v - 4, st), 'x': (root, 34, st // 2)}[c]
            notes.append([t, d, p, vv])
    for t, d, p, vv in notes: trk.note(t, d * .92, p, vv, jit)


def comp(trk, t0, tl, tmpl, bars, center=64, root=False, v=70, k=None, barlen=TPQ * 4, steps=16, strum=0, jit=4):
    """chord hits from a 16th template per bar: x hit, X accent, - hold, . off. Voicings follow the chords."""
    st = barlen // steps
    if isinstance(tmpl, str): tmpl = [tmpl]
    hits = []
    for b in range(bars):
        pat = tmpl[b % len(tmpl)].replace(' ', '')
        for i, c in enumerate(pat):
            t = t0 + b * barlen + i * st
            if c in 'xX': hits.append([t, st, at(tl, t), v + (14 if c == 'X' else 0)])
            elif c == '-' and hits: hits[-1][1] += st
    for t, d, ch, vv in hits: trk.chord(t, d * .95, vl(ch, center, root, k), vv, strum, jit)


def pad(trk, tl, center=60, root=True, v=60, k=None, over=40):
    """held chords, one per chord of the timeline."""
    for a, z, ch in tl:
        trk.chord(a, z - a + over, vl(ch, center, root, k), v, 0, 6)


def arp(trk, tl, order, step, center=60, root=True, v=60, k=None, t0=None, t1=None, hold=1.0, accent=None, span=2):
    """broken chords: order = indices into the voicing extended over `span` octaves (e.g. [0,1,2,3,2,1])."""
    for a, z, ch in tl:
        if t0 is not None and a < t0: continue
        if t1 is not None and a >= t1: break
        base = vl(ch, center, root, k); ext = []
        for o in range(span): ext += [p + 12 * o for p in base]
        t = a; i = 0
        while t < z:
            p = ext[order[i % len(order)] % len(ext)]
            vv = v + (accent if accent and i % len(order) == 0 else 0)
            trk.note(t, step * hold, p, vv, 3); t += step; i += 1
