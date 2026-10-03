#!/usr/bin/env python3
"""Writes the game's music as MIDI files into music/ (run: python3 tools/compose.py [name ...]).

All pieces are original compositions; the names say which style they aim for:
  menu      menu_adagio (Rachmaninov, piano concerto adagio), menu_dream (Liszt, Liebestraum), menu_temple (FF7 forested temple)
  play      play_coast, play_tropic, play_twilight (Takanaka fusion), play_skyline, play_runway (T-Square fusion)
  high      high_circus, high_requiem, high_carnival (symphonic Japanese metal, Imperial Circus Dead Decadence)
  duel      duel_moonlit (Persona 3), duel_fog (Persona 4), duel_heist (Persona 5)
  dead      dead_alley (Persona 5, Alleycat)
The settings piece (nocturne, Chopin) comes from tools/nocturne.py.
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from musiclib import *

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'music')
SONGS = {}
def song(f): SONGS[f.__name__] = f; return f

FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

def prog_of(H):
    return [c for bar in H for c in bar]

def trch(name, k):
    """transpose a chord name by k semitones."""
    if '/' in name:
        a, b = name.rsplit('/', 1); return trch(a, k) + '/' + FLAT[(pc(b) + k) % 12]
    i = 1
    while i < len(name) and name[i] in 'b#': i += 1
    return FLAT[(pc(name[:i]) + k) % 12] + name[i:]

def shift_text(text, scale, steps):
    """move every note of a melody by `steps` scale degrees (a harmony voice in thirds: steps=-2)."""
    sc = sorted(x % 12 for x in scale); out = []
    for tok in text.split():
        if tok == '|' or tok.startswith('r:'): out.append(tok); continue
        name, _, du = tok.partition(':'); p = n(name)
        deg = min(range(len(sc)), key=lambda i: min((p - sc[i]) % 12, (sc[i] - p) % 12))
        octs, d2 = divmod(deg + steps, len(sc)); base = p - ((p - sc[deg]) % 12)
        q = base + (sc[d2] - sc[deg]) + 12 * octs
        out.append(SHARP[q % 12] + str(q // 12 - 1) + ':' + du)
    return ' '.join(out)

def pchords(trk, tl, t0, bars, tmpl, lo=38, barlen=TPQ * 4, steps=16, v=96, oct5=True):
    """power chords (root, fifth, octave) on the chord roots from a template: x hit, X accent, - hold, . off, m palm mute."""
    st = barlen // steps; hits = []
    if isinstance(tmpl, str): tmpl = [tmpl]
    for b in range(bars):
        for i, c in enumerate(tmpl[b % len(tmpl)].replace(' ', '')):
            t = t0 + b * barlen + i * st
            if c in 'xXm': hits.append([t, st, at(tl, t), c])
            elif c == '-' and hits: hits[-1][1] += st
    for t, d, ch, c in hits:
        r = bassnote(ch, lo); ps = [r, r + 7, r + 12] if oct5 else [r, r + 7]
        dd = d * (.4 if c == 'm' else .95); vv = v + (14 if c == 'X' else -12 if c == 'm' else 0)
        for p in ps: trk.note(t, dd, p, vv, 3)

def roll(trk, t, beats, p, v0, v1, step=TPQ // 4):
    k = int(beats * TPQ / step)
    for i in range(k): trk.note(t + i * step, step, p, v0 + (v1 - v0) * i / max(1, k - 1), 2)

def pedal_by_chord(trk, tl, t0=0, t1=None):
    for a, z, c in tl:
        if a < t0 or (t1 is not None and a >= t1): continue
        trk.pedal(a - 8, False); trk.pedal(a + 40, True)


# =============================== MENU ===============================

@song
def menu_adagio():
    """Adagio in E major in the style of Rachmaninov's 2nd concerto, slow movement: piano triplets, flute and clarinet solos, strings climax."""
    S = Song('menu_adagio', 60, 4, 4, seed=11, title='Adagio (menu) - in the style of Rachmaninov'); S.bars(37); BAR = S.barlen(0)
    pno = S.track('Piano', 0, 0, 104, 58); fl = S.track('Flute', 73, 1, 112, 78); cl = S.track('Clarinet', 71, 2, 108, 50)
    stm = S.track('Strings (melody)', 48, 3, 104, 70); stp = S.track('Strings', 49, 4, 86, 56); vc = S.track('Cello', 42, 5, 92, 48)
    hn = S.track('Horn', 60, 6, 78, 66); tp = S.track('Timpani', 47, 7, 84, 64)
    H = [[('C#m7', 4)], [('F#m9/B', 2), ('B7', 2)], [('Emaj7', 4)], [('Amaj7/E', 4)],
         [('Emaj7', 4)], [('G#m7', 4)], [('C#m7', 4)], [('F#m9', 2), ('B7', 2)], [('Emaj7/G#', 4)], [('Amaj7', 4)], [('Am6', 4)], [('E/B', 2), ('B7sus4', 1), ('B7', 1)],
         [('Emaj9', 4)], [('E7/D', 4)], [('C#m7', 4)], [('Cmaj7#11', 4)], [('E/B', 4)], [('G#7/C', 4)], [('C#m9', 4)], [('F#m7', 2), ('B7b9', 2)],
         [('C#m', 4)], [('C#m/B', 4)], [('F#m7/A', 4)], [('G#7', 4)], [('Amaj7', 4)], [('F#m9', 4)], [('B13sus4', 2), ('B7b9', 2)], [('E', 2), ('C#m7', 2)],
         [('Amaj9', 4)], [('Am6', 4)], [('E/G#', 4)], [('F#m11', 2), ('B7', 2)], [('Emaj7', 4)], [('Am6/E', 4)], [('Emaj9', 4)], [('Eadd9', 8)]]
    tl = timeline(0, prog_of(H))
    # rubato: breathe at the phrase ends, push in the climax, slow down at the end
    for b in (11, 19, 31): S.rit(S.bar(b, 2), S.bar(b + 1), 60, 52, 4); S.set_tempo(S.bar(b + 1), 60)
    S.set_tempo(S.bar(20), 63); S.rit(S.bar(27), S.bar(28), 63, 50, 6); S.set_tempo(S.bar(28), 58); S.rit(S.bar(34), S.bar(36), 58, 44, 8)
    # piano: triplet figure (up on beats 1 and 3, down on 2 and 4), bass on every chord, pedal per chord
    for b in range(2, 36):
        loud = 20 <= b < 28; ctr = 68 if loud else 62
        for k in range(4 if b < 35 else 1):
            t = S.bar(b, k); ch = at(tl, t); vo = vl(ch, ctr, True, 4); vo = (vo + [x + 12 for x in vo])[:4]
            fig = [vo[0], vo[1], vo[2]] if k % 2 == 0 else [vo[3], vo[2], vo[1]]
            for j, p in enumerate(fig):
                pno.note(t + j * 160, 210, p, (60 if loud else 44) + (6 if j == 0 else 0), 4)
                if loud and j == 2 and k % 2 == 0: pno.note(t + j * 160, 210, p + 12, 52, 4)
            if k == 0 or any(a == t for a, z, c in tl):
                bp = bassnote(ch, 33); z = next(z for a, z, c in tl if a <= t < z)
                pno.note(t, z - t, bp, 58 if not loud else 70, 3)
                if loud: pno.note(t, z - t, bp + 12, 56, 3)
    pno.chord(S.bar(35), 2 * BAR, [40, 47, 52, 56, 59, 64, 66, 71, 76], 50, 30)
    pedal_by_chord(pno, tl, S.bar(2))
    # strings: soft chords all the way, swelling with the music
    pad(stp, tl, 60, True, 52, 4); stp.swell(0, S.bar(2), 50, 90); stp.swell(S.bar(12), S.bar(20), 80, 100); stp.swell(S.bar(20), S.bar(26), 100, 127); stp.swell(S.bar(27), S.bar(32), 120, 80); stp.swell(S.bar(32), S.bar(37), 80, 50)
    fa = "G#5:2 F#5:2/3 G#5:2/3 B5:2/3 | D#6:3 C#6:1 | B5:1.5 G#5:.5 E5:1 F#5:1 | G#5:2 A5:1 F#5:1 | B5:2 E6:2/3 D#6:2/3 B5:2/3 | C#6:3 B5:1/3 A5:1/3 G#5:1/3 | F#5:2 C6:2 | B5:2 E5:1 D#5:1 |"
    mel(fl, S.bar(4), fa, TPQ, 80, 1.02, 6, BAR)
    ca = "B4:2 C#5:2/3 B4:2/3 G#4:2/3 | D5:3 C#5:1 | E5:1.5 C#5:.5 B4:1 G#4:1 | G4:2 F#4:1 E4:1 | G#4:2 B4:1 E5:1 | D#5:1.5 C5:.5 D#5:1 F#5:1 | E5:3 D#5:1 | C#5:2 A4:1 C5:1 |"
    mel(cl, S.bar(12), ca, TPQ, 82, 1.02, 6, BAR)
    mel(fl, S.bar(15), "E6:4 | D#6:4 |", TPQ, 58, 1.0, 6, BAR)
    sa = "G#5:2 C#6:1 E6:1 | D#6:2 C#6:1 B5:1 | A5:1.5 G#5:.5 F#5:1 C#6:1 | C6:3 D#6:1 | E6:3 G#6:1 | A6:3 G#6:1 | F#6:2 E6:1 D#6:1 | E6:2 G#5:1 B5:1 |"
    mel(stm, S.bar(20), sa, TPQ, 92, 1.04, 6, BAR); mel(stm, S.bar(20), sa, TPQ, 80, 1.04, 6, BAR, oct=-1)
    stm.swell(S.bar(20), S.bar(25), 90, 127); stm.swell(S.bar(26), S.bar(28), 127, 90)
    mel(fl, S.bar(28), "C#6:2 B5:2/3 A5:2/3 G#5:2/3 | C6:3 B5:1 | B5:2 G#5:1 E5:1 | F#5:2 E5:1 D#5:1 | G#5:4 | C6:4 | B5:4 | G#5:8 |", TPQ, 72, 1.02, 6, BAR)
    mel(hn, S.bar(20), "G#3:4 | G#3:4 | A3:4 | G#3:4 | E4:4 | C#4:4 | B3:4 | B3:2 G#3:2 |", TPQ, 70, 1.0, 6, BAR)
    hn.swell(S.bar(20), S.bar(26), 70, 120); hn.swell(S.bar(26), S.bar(28), 120, 70)
    for b in range(12, 36):   # cello: the bass line, warm and long
        for a, z, c in tl:
            if S.bar(b) <= a < S.bar(b + 1): vc.note(a, z - a, bassnote(c, 36), 62 if not 20 <= b < 28 else 80, 4)
    roll(tp, S.bar(25), 4, 40, 40, 90); roll(tp, S.bar(26), 2, 35, 90, 70); tp.note(S.bar(27), TPQ * 2, 40, 96)
    roll(tp, S.bar(35), 4, 40, 50, 30)
    return S


@song
def menu_dream():
    """Notturno in A-flat in the style of Liszt's Liebestraum: the tune in the middle of the piano, broken chords around it, two cadenzas."""
    S = Song('menu_dream', 88, 6, 4, seed=12, title='Dream (menu) - in the style of Liszt'); S.bars(32); BAR = S.barlen(0)
    pno = S.track('Piano', 0, 0, 108, 64)
    H = [[('Ab', 6)], [('Fm7', 6)], [('Db', 6)], [('Dbm/Ab', 6)], [('Ab/Eb', 6)], [('F7', 6)], [('Bbm7', 3), ('Eb7', 3)], [('Ab', 3), ('Eb7', 3)],
         [('Ab', 6)], [('Fm7', 6)], [('Db', 6)], [('Dbm/Ab', 6)], [('Ab/Eb', 6)], [('F7', 6)], [('Bbm7', 3), ('Eb7', 3)], [('Ab', 3), ('Gb7', 3)],
         [('Gb7', 6)],
         [('B', 6)], [('G#m7', 6)], [('C#m9', 6)], [('F#7', 6)], [('B/D#', 3), ('E', 3)], [('E7', 6)],
         [('Eb7', 6)],
         [('Ab', 6)], [('Fm7', 6)], [('Db', 6)], [('Dbm/Ab', 6)], [('Ab/Eb', 6)], [('Db/Ab', 3), ('Dbm/Ab', 3)], [('Ab', 6)], [('Ab', 6)]]
    tl = timeline(0, prog_of(H))
    S.rit(S.bar(15, 3), S.bar(16), 88, 76, 4); S.set_tempo(S.bar(16), 84); S.rit(S.bar(16, 3), S.bar(17), 84, 64, 4)
    S.set_tempo(S.bar(17), 92); S.rit(S.bar(22, 3), S.bar(23), 92, 76, 4); S.set_tempo(S.bar(23), 80); S.rit(S.bar(23, 3), S.bar(24), 80, 58, 6)
    S.set_tempo(S.bar(24), 84); S.rit(S.bar(28), S.bar(31), 84, 54, 10)
    def acc(b0, b1, lowc, highc, v, bassv, octb=False):
        for b in range(b0, b1):
            for i in range(12):
                t = S.bar(b) + i * TPQ // 2; ch = at(tl, t)
                L = vl(ch, lowc, True, 3); Hh = vl(ch, highc, True, 3)
                p = [L[0], Hh[0], L[1], Hh[1], L[2], Hh[2]][i % 6]
                pno.note(t, TPQ * .7, p, v + (5 if i % 6 == 0 else 0) + (3 if i % 2 else 0), 5)
            for k in (0, 3):
                t = S.bar(b, k); ch = at(tl, t); p = bassnote(ch, 32)
                pno.note(t, TPQ * 3, p, bassv, 3)
                if octb: pno.note(t, TPQ * 3, p - 12 if p >= 40 else p + 12, bassv - 6, 3)
    acc(0, 8, 51, 72, 40, 54); acc(8, 15, 50, 63, 42, 58, True); acc(17, 23, 52, 66, 50, 70, True); acc(24, 30, 51, 72, 36, 50)
    for b, ch in ((15, None),):
        for i in range(6):
            t = S.bar(15) + i * TPQ // 2; c = at(tl, t); pno.note(t, TPQ * .7, vl(c, 63, True, 3)[i % 3], 40, 5)
        pno.note(S.bar(15), TPQ * 3, bassnote('Ab', 32), 56); pno.chord(S.bar(15, 3), TPQ * 3, [42, 54, 58, 64], 48, 20)
    pno.chord(S.bar(16), BAR, [30, 42, 52, 58], 60, 25); pno.chord(S.bar(23), BAR, [27, 39, 49, 55], 64, 25)
    A = "C4:4 Db4:1 C4:1 | Ab4:4 G4:1 F4:1 | F4:3 Eb4:1 Db4:1 C4:1 | E4:4 Eb4:2 | Eb4:2 C4:1 Ab3:1 C4:1 Eb4:1 | F4:3 Eb4:1 C4:1 A3:1 | Db4:2 F4:1 G4:2 Db4:1 | C4:3 Bb3:2 Eb4:1 |"
    mel(pno, 0, A, TPQ, 80, 1.0, 6, BAR)
    A2 = "C5:4 Db5:1 C5:1 | Ab5:4 G5:1 F5:1 | F5:3 Eb5:1 Db5:1 C5:1 | E5:4 Eb5:2 | Eb5:2 C5:1 Ab4:1 C5:1 Eb5:1 | F5:3 Eb5:1 C5:1 A4:1 | Db5:2 F5:1 G5:2 Db5:1 | C5:3 Bb4:3 |"
    mel(pno, S.bar(8), A2, TPQ, 86, 1.0, 6, BAR)
    cad1 = ' '.join(x + ':.25' for x in 'E6 C#6 A#5 F#5 E5 C#5 A#4 F#4 E4 C#4 A#3 F#3 A#3 C#4 E4 F#4 A#4 C#5 E5 F#5'.split()) + ' A#5:1 |'
    mel(pno, S.bar(16), cad1, TPQ, 70, 1.3, 2, BAR)
    Bm = "D#5:4 F#5:1 D#5:1 | B5:4 A#5:1 G#5:1 | G#5:3 F#5:1 E5:1 D#5:1 | C#5:2 E5:2 A#4:2 | B4:3 G#5:2 B5:1 | D6:4 B5:1 G#5:1 |"
    mel(pno, S.bar(17), Bm, TPQ, 96, 1.0, 6, BAR); mel(pno, S.bar(17), Bm, TPQ, 78, 1.0, 6, BAR, oct=-1)
    cad2 = ' '.join(x + ':.25' for x in 'Db6 Bb5 G5 Eb5 Db5 Bb4 G4 Eb4 Db4 Bb3 G3 Eb3 G3 Bb3 Db4 Eb4'.split()) + ' Bb3:2 |'
    mel(pno, S.bar(23), cad2, TPQ, 72, 1.3, 2, BAR)
    mel(pno, S.bar(24), "C4:4 Db4:1 C4:1 | Ab4:4 G4:1 F4:1 | F4:3 Eb4:1 Db4:1 C4:1 | E4:4 Eb4:2 | Eb4:3 C4:3 | F4:3 E4:3 | C4:6 |", TPQ, 72, 1.0, 6, BAR)
    for i, p in enumerate([44, 48, 51, 56, 60, 63, 68, 72, 75, 80, 84, 87, 92]):
        pno.note(S.bar(30) + i * TPQ // 3, BAR * 2, p, 40 + i, 2)
    pno.chord(S.bar(31) - 60, BAR, [32, 44, 51, 56, 60, 63, 68], 46, 25)
    pedal_by_chord(pno, tl)
    return S


@song
def menu_temple():
    """Mysterious D minor piece in the style of FF7's forested temple: harp ostinato, pan flute and oboe, choir in the middle."""
    S = Song('menu_temple', 72, 4, 4, seed=13, title='Temple (menu) - in the style of FF7'); S.bars(41); BAR = S.barlen(0)
    hp = S.track('Harp', 46, 0, 100, 50); mr = S.track('Marimba', 12, 1, 92, 84); stp = S.track('Strings', 49, 2, 80, 60)
    fl = S.track('Pan flute', 75, 3, 100, 70); ob = S.track('Oboe', 68, 4, 92, 54); ch = S.track('Choir', 52, 5, 80, 64)
    gl = S.track('Glockenspiel', 9, 6, 64, 90); dr = S.track('Drone', 89, 7, 70, 64); pz = S.track('Pizzicato bass', 45, 8, 92, 60)
    tm = S.track('Timpani', 47, 10, 80, 64); pc_ = S.track('Percussion', 0, 9, 70, 64)
    A = [[('Dm', 4)], [('Dm', 4)], [('Bbmaj7', 4)], [('Bbmaj7', 4)], [('Gm9', 4)], [('Gm9', 4)], [('Asus4', 4)], [('A7', 4)]]
    Bh = [[('Fmaj7', 4)], [('Fmaj7', 4)], [('Em7b5', 4)], [('A7b9', 4)], [('Dmadd9', 4)], [('Bb/C', 4)], [('Bbmaj7#11', 4)], [('Asus4', 2), ('A', 2)]]
    H = [[('Dm', 4)], [('Dm', 4)], [('Bbmaj7', 4)], [('Asus4', 4)]] + A + A + Bh + A + [[('Dm', 4)], [('Bbmaj7#11', 4)], [('Gm9', 4)], [('Dmadd9', 8)]]
    tl = timeline(0, prog_of(H)); S.rit(S.bar(38), S.bar(40), 72, 56, 8)
    for b in range(40):   # the ostinato: root, fifth, octave, ninth, third, ninth, octave, fifth
        for i in range(8):
            t = S.bar(b) + i * TPQ // 2; c = at(tl, t); r, iv, bp = chord(c); root = 45 + (r - 45) % 12
            third = 12 + (iv[1] if iv[1] in (3, 4, 5) else 3); nin = 13 if '7b9' in c else 14; fif = 6 if 'b5' in c else 7
            p = root + [0, fif, 12, nin, third, nin, 12, fif][i]
            hp.note(t, TPQ * .9, p, (58 if i % 4 == 0 else 48) * (.8 if b >= 38 else 1), 4)
            if 12 <= b < 36 and i % 2 == 0: mr.note(t + TPQ // 4, TPQ // 3, p + 12, 40, 3)
    pedal_by_chord(hp, tl)
    pad(stp, tl, 60, True, 46, 4); stp.swell(0, S.bar(4), 40, 90); stp.swell(S.bar(20), S.bar(28), 90, 115); stp.swell(S.bar(36), S.bar(41), 100, 40)
    for a, z, c in tl: dr.note(a, z - a + 30, bassnote(c, 26), 52, 6)
    for b in range(4, 40):
        t = S.bar(b); c = at(tl, t); pz.note(t, TPQ, bassnote(c, 33), 70, 3); pz.note(t + int(TPQ * 2.5), TPQ, bassnote(c, 33) + 7, 56, 3)
    mel(fl, S.bar(4), "D5:2 C5:1 A4:1 | G4:3 r:1 | F4:1.5 G4:.5 A4:2 | D5:3 r:1 | C5:2 A4:1 Bb4:1 | G4:2 A4:2 | D5:2 E5:1 D5:1 | C#5:3 r:1 |", TPQ, 84, 1.0, 6, BAR)
    mel(ob, S.bar(12), "F5:2 E5:1 D5:1 | A4:3 r:1 | Bb4:1.5 C5:.5 D5:2 | F5:3 r:1 | E5:2 D5:1 C5:1 | Bb4:2 A4:2 | G4:2 A4:1 D5:1 | C#5:3 E5:1 |", TPQ, 82, 1.0, 6, BAR)
    mel(fl, S.bar(12), "A5:4 | F5:4 | D6:4 | C6:4 | Bb5:4 | D6:4 | E6:4 | E6:4 |", TPQ, 52, 1.0, 6, BAR)
    mel(fl, S.bar(20), "A5:3 G5:1 | E5:2 F5:1 G5:1 | Bb5:3 A5:1 | G5:2 F5:1 E5:1 | E5:2 F5:1 D5:1 | C5:2 D5:1 E5:1 | F5:2 E5:2 | D5:2 C#5:2 |", TPQ, 88, 1.0, 6, BAR)
    pad(ch, timeline(S.bar(20), prog_of(Bh)), 62, True, 60, 4); ch.swell(S.bar(20), S.bar(24), 60, 110); ch.swell(S.bar(26), S.bar(28), 110, 70)
    mel(fl, S.bar(28), "D5:2 C5:1 A4:1 | G4:3 r:1 | F4:1.5 G4:.5 A4:2 | D5:3 r:1 | C5:2 A4:1 Bb4:1 | G4:2 A4:2 | D5:2 E5:1 D5:1 | C#5:3 r:1 |", TPQ, 84, 1.0, 6, BAR, oct=1)
    for b, p in zip(range(28, 36), ['D6', 'G5', 'F5', 'D6', 'C6', 'G5', 'D6', 'C#6']): gl.note(S.bar(b), TPQ, n(p) + 12, 50)
    mel(fl, S.bar(36), "D5:4 | E5:4 | D5:4 | A4:8 |", TPQ, 64, 1.0, 6, BAR)
    for b in (4, 12, 20, 28): tm.note(S.bar(b), TPQ * 2, 38, 84)
    roll(tm, S.bar(19, 3), 1, 33, 40, 90); roll(tm, S.bar(39), 4, 38, 50, 20)
    beat(pc_, S.bar(20), 8, {'sh': 'x.m.x.m.x.m.x.m.'}, vel=.45); beat(pc_, S.bar(4), 32, {'tri': 'x...............' + '.' * 48}, vel=.35)
    return S


# =============================== PLAY (fusion) ===============================

def fusion_kit(S, lead_prog=29, lead_vol=100):
    return dict(ld=S.track('Lead', lead_prog, 0, lead_vol, 64))


@song
def play_coast():
    """Bright E major fusion in the style of Takanaka: singing overdrive guitar, slap bass, Rhodes, congas, brass."""
    S = Song('play_coast', 124, seed=21, title='Coast (play) - in the style of Takanaka'); S.bars(57); BAR = S.barlen(0)
    ld = S.track('Lead guitar', 29, 0, 100, 64); ep = S.track('Rhodes', 4, 1, 92, 46); bs = S.track('Slap bass', 36, 2, 104, 64)
    gt = S.track('Rhythm guitar', 27, 3, 80, 92); br = S.track('Brass', 61, 4, 88, 74); sy = S.track('Synth strings', 50, 5, 70, 58); dr = S.track('Drums', 0, 9, 104, 64)
    A = [[('Emaj9', 4)], [('C#m9', 4)], [('Amaj9', 4)], [('B9sus4', 4)], [('Emaj9', 4)], [('G#m7', 4)], [('Amaj7', 2), ('G#m7', 2)], [('F#m9', 2), ('B9sus4', 2)]]
    Bc = [[('Amaj7', 4)], [('G#m7', 4)], [('F#m7', 4)], [('Emaj7/G#', 4)], [('Amaj7', 4)], [('G#7#9', 4)], [('C#m9', 4)], [('F#7/A#', 2), ('B7sus4', 2)]]
    So = [[('Emaj9', 4)], [('Dmaj9/E', 4)], [('C#m9', 4)], [('B9sus4', 4)]] * 2
    In = [[('E6', 4)], [('E6', 4)], [('E6', 4)], [('A', 1.5), ('B', 2.5)]]
    H = In + A + A + Bc + So + A + Bc + [[('Emaj9', 4)], [('C#m9', 4)], [('Amaj9', 1.5), ('B9sus4', 2.5)], [('Emaj9', 4)], [('Emaj9', 4)]]
    tl = timeline(0, prog_of(H))
    r1 = "E4:2 r:1 E4:1 F#4:2 G#4:2 B4:3 C#5:1 B4:2 G#4:2 |"; r2 = "A4:2 G#4:2 F#4:2 E4:2 r:2 B3:2 C#4:2 D#4:2 |"; hits = "A4:3 A4:3 B4:2 r:2 B4:2 r:4 |"
    for t0, riff in ((0, ' '.join([r1, r2, r1, hits])), (S.bar(52), ' '.join([r1, r2, hits]))):
        mel(ld, t0, riff, bar=BAR, v=96); mel(bs, t0, riff, bar=BAR, v=100, oct=-2); mel(br, t0, riff, bar=BAR, v=84, oct=1)
    mel(ld, S.bar(55), "[E5,B5]:16", v=100); br.chord(S.bar(55), BAR, [64, 68, 71, 75, 78], 96); bs.note(S.bar(55), BAR, 28, 110)
    tA = ("r:2 B4:2 E5:3 F#5:1 G#5:4 F#5:2 E5:2 | D#5:6 E5:2 F#5:2 G#5:2 B5:4 | C#6:4^ B5:2 G#5:2 A5:3 G#5:1 F#5:2 E5:2 | F#5:12 r:4 |"
          " r:2 B4:2 E5:3 F#5:1 G#5:4 B5:2 C#6:2 | D#6:6 C#6:2 B5:2 G#5:2 F#5:4 | E5:4 C#5:2 E5:2 D#5:4 B4:4 | C#5:3 E5:3 G#5:2 A5:2 G#5:2 E5:4 |")
    for b0 in (4, 12, 36): mel(ld, S.bar(b0), tA, bar=BAR, v=92)
    tB = ("C#6:3 C#6:3 B5:2 A5:2 G#5:2 E5:4 | B5:3 B5:3 A5:2 G#5:2 F#5:2 D#5:4 | A5:3 A5:3 G#5:2 F#5:2 E5:2 C#5:4 | D#5:4 E5:4 F#5:4 G#5:4 |"
          " C#6:3 C#6:3 B5:2 A5:2 G#5:2 E6:4 | D#6:4 B5:2 C6:2 D#6:4 F#6:4^ | E6:6 D#6:2 C#6:4 B5:4 | A#5:4 C#6:4 B5:8 |")
    for b0 in (20, 44): mel(ld, S.bar(b0), tB, bar=BAR, v=96); mel(br, S.bar(b0), tB, bar=BAR, v=70, oct=-1)
    solo = ("B5:2^ G#5:1 F#5:1 E5:2 F#5:2 G#5:1 B5:1 C#6:2 D#6:4 | C#6:2 A5:2 F#5:2 E5:2 D5:2 E5:2 F#5:2 A5:2 | G#5:4^ E5:2 D#5:2 C#5:2 B4:2 C#5:2 E5:2 | F#5:1 G#5:1 A5:1 B5:1 C#6:1 E6:1 F#6:2^ F#6:8 |"
            " E6:2 D#6:1 B5:1 G#5:2 B5:2 D#6:2 E6:2 F#6:4^ | E6:2 C#6:2 A5:2 F#5:2 D6:6 C#6:2 | B5:1 C#6:1 B5:1 G#5:1 E5:2 G#5:2 B5:4 D#6:4 | E6:4^ C#6:2 B5:2 A5:2 F#5:2 E5:4 |")
    mel(ld, S.bar(28), solo, bar=BAR, v=96)
    sec = [(4, 8, 'A'), (12, 8, 'A'), (20, 8, 'B'), (28, 8, 'S'), (36, 8, 'A'), (44, 8, 'B')]
    for b0, nb, kind in sec:
        t0 = S.bar(b0)
        bassline(bs, t0, tl, {'A': 'S-.xO.R.x.S.O-5A', 'B': 'R--.R-.5.R-.O-.A', 'S': 'S.xO.xR.S.xO.5.A'}[kind], nb, v=96)
        comp(ep, t0, tl, {'A': 'x--.x-.x--.x-...', 'B': 'x---x-.x---.x---', 'S': 'x-.x-.x-.x-.x-..'}[kind], nb, 64, False, 62)
        if kind != 'B': comp(gt, t0, tl, '.x.x.x.x.x.x.x.x', nb, 72, False, 48, k=2)
        else: pad(sy, timeline(t0, prog_of(H[b0:b0 + nb])), 62, True, 50, 4); comp(br, t0, tl, ['................', '................', '................', 'X..X..X.....X...'], nb, 66, False, 76)
        grooves = {'A': {'k': 'x.....x.x.....x.', 's': '....X..g.g..X...', 'h': 'xmxmxmxmxmxmxmxm', 'cgo': '..x...x...x..x..', 'cgl': 'x.......x.....x.'},
                   'B': {'k': 'x.....x.x.x...x.', 's': '....X.......X...', 'r': 'x.x.x.x.x.x.x.x.', 'sh': 'xmxmxmxmxmxmxmxm', 'cb': 'x.....x.....x...'},
                   'S': {'k': 'x.....x.x.....x.', 's': '....X..g.g..X..g', 'r': 'x.xmx.xmx.xmx.xm', 'cgo': '..x...x...x..x..', 'cgl': 'x.......x.....x.'}}[kind]
        beat(dr, t0, nb - 1, grooves); beat(dr, S.bar(b0 + nb - 1), 1, {k: v[:12] + '....' for k, v in grooves.items()})
        fill(dr, S.bar(b0 + nb - 1, 3), 1, 'mix' if kind != 'S' else 'toms')
    beat(dr, 0, 3, {'k': 'x.....x.x.....x.', 's': '....X.......X...', 'h': 'xmxmxmxmxmxmxmxm'}, vel=.9)
    for b in (3, 54): beat(dr, S.bar(b), 1, {'k': 'x..x..x...x.....', 'C': 'x..x..x...x.....', 's': '.........ggg....'})
    beat(dr, S.bar(52), 2, {'k': 'x.....x.x.....x.', 's': '....X.......X...', 'h': 'xmxmxmxmxmxmxmxm'})
    beat(dr, S.bar(55), 1, {'k': 'X...............', 'c': 'X...............', 'C': 'X...............'})
    beat(dr, 0, 1, {'c': 'x...............'})
    for t0, nb in ((0, 3), (S.bar(52), 2)): pchords(gt, tl, t0, nb, 'x--.x--.x--.x-..', 52, v=60, oct5=False)
    return S


@song
def play_skyline():
    """Driving F# minor / A major fusion in the style of T-Square: lyricon-like lead, synth brass fanfares, slap bass, key change at the end."""
    S = Song('play_skyline', 148, seed=22, title='Skyline (play) - in the style of T-Square'); S.bars(65); BAR = S.barlen(0)
    ld = S.track('Lyricon lead', 81, 0, 112, 64); pn = S.track('Piano', 0, 1, 66, 50); bs = S.track('Slap bass', 36, 2, 104, 64)
    br = S.track('Synth brass', 62, 3, 84, 76); sy = S.track('Synth strings', 50, 4, 72, 56); gt = S.track('Guitar', 27, 5, 72, 96); dr = S.track('Drums', 0, 9, 106, 64)
    In = [[('F#m9', 4)], [('Dmaj7', 4)], [('E', 4)], [('E7sus4', 2), ('E7', 2)]]
    Ve = [[('F#m9', 4)], [('Dmaj7', 4)], [('Esus4', 2), ('E', 2)], [('C#m7', 4)], [('Bm9', 4)], [('Dmaj7', 4)], [('Bm7/E', 4)], [('E7sus4', 2), ('E7', 2)]]
    Pr = [[('Dmaj7', 4)], [('C#m7', 4)], [('Bm7', 4)], [('E7sus4', 2), ('E7', 2)]]
    Ch = [[('Amaj7', 4)], [('E/G#', 4)], [('F#m7', 4)], [('Amaj7/E', 4)], [('Dmaj7', 4)], [('C#m7', 2), ('F#7', 2)], [('Bm7', 4)], [('Esus4', 2), ('E', 2)]]
    So = [[('F#m9', 4)], [('Dmaj7', 4)], [('Bm9', 4)], [('C#7sus4', 2), ('C#7', 2)], [('F#m9', 4)], [('Dmaj7', 4)], [('Bm9', 4)], [('C#7sus4', 2), ('F7sus4', 1), ('F7', 1)]]
    ChU = [[(trch(c, 1), b) for c, b in bar] for bar in Ch]
    Ou = [[('Ebmaj7', 4)], [('F', 4)], [('Gm7', 4)], [('Bbmaj9', 4)], [('Bbmaj9', 4)]]
    H = In + Ve + Pr + Ch + Ve + Pr + Ch + So + ChU + Ou; tl = timeline(0, prog_of(H))
    fan = "C#5:2 F#5:2 A5:2 C#6:4 B5:2 A5:2 G#5:2 | A5:6 F#5:2 E5:4 C#5:4 | B4:2 E5:2 G#5:2 B5:4 A5:2 G#5:2 E5:2 | A5:8 G#5:4 D5:4 |"
    mel(ld, 0, fan, bar=BAR, v=96); mel(br, 0, fan, bar=BAR, v=86, oct=-1)
    ve = ("C#5:6 B4:2 A4:4 G#4:2 A4:2 | F#4:8 r:2 E4:2 F#4:2 A4:2 | B4:6 A4:2 G#4:8 | E4:4 G#4:4 B4:4 C#5:4 |"
          " D5:6 C#5:2 B4:4 A4:2 B4:2 | F#5:6 E5:2 C#5:4 A4:4 | B4:4 D5:4 F#5:4 E5:4 | A5:8 G#5:8 |")
    pr = "A4:2 B4:2 C#5:2 E5:2 F#5:4 E5:4 | G#4:2 B4:2 C#5:2 E5:2 G#5:4 F#5:4 | F#4:2 A4:2 B4:2 D5:2 F#5:4 A5:4 | B5:8 G#5:4 E5:4 |"
    ch = ("E5:4 A5:4 G#5:2 A5:2 B5:4 | C#6:6 B5:2 G#5:8 | A5:4 F#5:4 E5:2 F#5:2 A5:4 | E5:12 C#5:2 E5:2 |"
          " F#5:4 A5:4 C#6:4 E6:4 | E6:6 C#6:2 A#5:4 C#6:4 | D6:6 C#6:2 B5:4 A5:4 | B5:4 A5:4 G#5:8 |")
    for b0 in (4, 24): mel(ld, S.bar(b0), ve, bar=BAR, v=90)
    for b0 in (12, 32): mel(ld, S.bar(b0), pr, bar=BAR, v=92)
    for b0 in (16, 36): mel(ld, S.bar(b0), ch, bar=BAR, v=98); mel(sy, S.bar(b0), ch, bar=BAR, v=50, oct=-1)
    mel(ld, S.bar(52), ch, bar=BAR, v=100, tr=1); mel(sy, S.bar(52), ch, bar=BAR, v=56, oct=-1, tr=1)
    so = ("C#6:1 B5:1 A5:1 G#5:1 F#5:2 A5:2 C#6:2 E6:2 C#6:2 A5:2 | F#6:4^ E6:2 C#6:2 A5:2 F#5:2 E5:2 C#5:2 | D5:1 F#5:1 A5:1 C#6:1 D6:2 C#6:2 B5:2 A5:2 F#5:4 | F#5:4 G#5:4 F5:4 G#5:4 |"
          " A5:2 G#5:2 A5:2 C#6:2 F#6:4 E6:2 C#6:2 | D6:1 E6:1 F#6:1 A6:1 F#6:2 E6:2 C#6:2 A5:2 F#5:4 | B5:2 C#6:2 D6:2 F#6:2 E6:4 C#6:4 | F#5:4 G#5:4 Bb5:2 C6:2 A5:4 |")
    mel(ld, S.bar(44), so, bar=BAR, v=96)
    mel(ld, S.bar(60), "D6:8 C6:8 | Bb5:8 A5:8 | G5:4 Bb5:4 D6:4 F6:4 | F6:16 | r:16 |", bar=BAR, v=94)
    br.chord(S.bar(63), BAR, [58, 62, 65, 69, 72], 92); bs.note(S.bar(63), BAR, 34, 110)
    sec = [(4, 8, 'V'), (12, 4, 'P'), (16, 8, 'C'), (24, 8, 'V'), (32, 4, 'P'), (36, 8, 'C'), (44, 8, 'S'), (52, 8, 'C'), (60, 3, 'O')]
    for b0, nb, k in sec:
        t0 = S.bar(b0)
        bassline(bs, t0, tl, {'V': 'S.xO..S.x.O.S5.A', 'P': 'R-.R-.R-.R-.O-5-', 'C': 'R-.R-.R-.R-.O-5-', 'S': 'S.OxS.OxS.Ox5.A.', 'O': 'R---R---R---R---'}[k], nb, v=96)
        comp(pn, t0, tl, {'V': 'x-.x-.x-..x-.x-.', 'P': 'x---x---x---x---', 'C': 'x---.x--x---.x--', 'S': 'x-.x-.x-..x-.x-.', 'O': 'x---------------'}[k], nb, 66, False, 64)
        if k in 'PC': comp(br, t0, tl, '....x.....x.....' if k == 'P' else 'x.......x...x...', nb, 64, False, 70, k=4)
        if k in 'CS': pad(sy, timeline(t0, prog_of(H[b0:b0 + nb])), 60, True, 46, 4); comp(gt, t0, tl, '..x...x...x...x.', nb, 70, False, 54, k=3)
        g = {'V': {'k': 'x.....x...x.....', 's': '....X..g....X..g', 'h': 'x.x.x.x.x.x.x.x.'},
             'P': {'k': 'x.......x.......', 's': '....X.......X...', 'r': 'x.x.x.x.x.x.x.x.'},
             'C': {'k': 'x...x.x.x...x.x.', 's': '....X.......X...', 'o': '..x...x...x...x.', 'h': 'x...x...x...x...'},
             'S': {'k': 'x..x..x...x..x..', 's': '....X..g.g..X..g', 'h': 'xmxmxmxmxmxmxmxm'},
             'O': {'k': 'x...x...x...x...', 's': '....X.......X...', 'r': 'x.x.x.x.x.x.x.x.'}}[k]
        beat(dr, t0, nb - 1, g); beat(dr, S.bar(b0 + nb - 1), 1, {kk: v[:12] + '....' for kk, v in g.items()})
        fill(dr, S.bar(b0 + nb - 1, 3), 1, 'toms' if k in 'CS' else 'snare')
        if k == 'C':
            for j in range(0, nb, 2): dr.note(S.bar(b0 + j), TPQ, 49, 110)
    beat(dr, 0, 4, {'k': 'x.....x.x.......', 's': '....X.......X..X', 'c': 'x.......x.......'}); fill(dr, S.bar(3, 2), 2, 'toms')
    comp(pn, 0, tl, 'x-.x-.x-..x-.x-.', 4, 66, False, 66); bassline(bs, 0, tl, 'S.xO..S.x.O.S5.A', 4, v=94)
    beat(dr, S.bar(63), 1, {'k': 'X...............', 'c': 'X...............', 'C': 'X...............'})
    return S


@song
def play_tropic():
    """Samba fusion in D in the style of Takanaka: percussion, partido alto Rhodes, guitar lead with bends, horn hits."""
    S = Song('play_tropic', 116, seed=23, title='Tropic (play) - in the style of Takanaka'); S.bars(49); BAR = S.barlen(0)
    ld = S.track('Lead guitar', 29, 0, 100, 64); ep = S.track('Rhodes', 4, 1, 92, 44); bs = S.track('Bass', 33, 2, 106, 64)
    gt = S.track('Guitar', 27, 3, 76, 94); br = S.track('Brass', 61, 4, 86, 76); dr = S.track('Drums', 0, 9, 104, 64)
    In = [[('Dmaj9', 4)], [('Dmaj9', 4)], [('Cmaj9/D', 4)], [('Em9', 2), ('A13', 2)]]
    A = [[('Dmaj9', 4)], [('Cmaj9/D', 4)], [('Bm9', 4)], [('Em9', 2), ('A13', 2)], [('Dmaj9', 4)], [('F#m7', 2), ('B7b9', 2)], [('Em9', 4)], [('A13sus4', 2), ('A7b9', 2)]]
    Bb = [[('Gmaj7', 4)], [('F#m7', 4)], [('Em7', 4)], [('Dmaj7', 4)], [('Gmaj7', 4)], [('F#7#9', 4)], [('Bm9', 4)], [('E9', 2), ('A7sus4', 2)]]
    H = In + A + Bb + A + A + A + [[('Dmaj9', 4)], [('Cmaj9/D', 4)], [('Dmaj9', 4)], [('Dmaj9', 4)], [('Dmaj9', 4)]]; tl = timeline(0, prog_of(H))
    tA = ("F#5:3 E5:3 D5:2 A4:4 B4:2 D5:2 | E5:6 D5:2 B4:4 G4:4 | F#5:3 E5:3 D5:2 C#5:4 B4:2 C#5:2 | D5:6 B4:2 F#5:4 E5:4 |"
          " F#5:3 E5:3 D5:2 A5:4 B5:2 A5:2 | C#6:6 A5:2 A5:4 C6:4 | B5:6 G5:2 F#5:4 E5:2 F#5:2 | D5:4 E5:4 C#5:4 Bb4:4 |")
    tB = ("B5:4 A5:2 B5:2 D6:4 B5:4 | A5:4 E5:2 F#5:2 C#6:4 A5:4 | G5:4 F#5:2 G5:2 B5:4 G5:4 | F#5:6 E5:2 C#5:8 |"
          " B5:4 A5:2 B5:2 D6:4 F#6:4 | E6:4 A5:4 C#6:4 A#5:4 | D6:6 C#6:2 B5:8 | G#5:4 B5:4 D5:4 E5:4 |")
    so = ("A5:2^ F#5:1 E5:1 D5:2 E5:2 F#5:2 A5:2 B5:2 C#6:2 | D6:4 C6:2 B5:2 G5:2 E5:2 D5:2 E5:2 | F#5:1 A5:1 B5:1 C#6:1 D6:2 C#6:2 B5:4^ A5:4 | G5:2 B5:2 D6:2 E6:2 C#6:4 F#5:4 |"
          " E6:4^ D6:2 A5:2 F#5:2 A5:2 C#6:4 | E6:2 C#6:2 A5:2 F#5:2 D#6:2 C6:2 A5:4 | B5:2 D6:2 F#6:4^ E6:2 D6:2 B5:4 | D6:4 E6:4 C#6:2 Bb5:2 G5:4 |")
    mel(ld, S.bar(4), tA, bar=BAR, v=92); mel(ld, S.bar(12), tB, bar=BAR, v=94); mel(br, S.bar(12), tB, bar=BAR, v=66, oct=-1)
    mel(ld, S.bar(20), tA, bar=BAR, v=92); mel(ld, S.bar(28), so, bar=BAR, v=96); mel(ld, S.bar(36), tA, bar=BAR, v=94); mel(br, S.bar(36), tA, bar=BAR, v=60, oct=-1)
    mel(ld, S.bar(44), "F#5:3 E5:3 D5:2 A4:4 B4:2 D5:2 | E5:6 D5:2 B4:4 G4:4 | A4:4 B4:4 D5:4 E5:4 | [D5,F#5]:16 |", bar=BAR, v=94)
    samba = {'k': 'm..xm..xm..xm..x', 'x': 'x..x..x...x..x..', 'h': 'mgmgmgmgmgmgmgmg', 'sh': 'xgxgxgxgxgxgxgxg', 'cb': 'x.x...x.x.x...x.', 'cgo': '..x..x....x..x..', 'cgl': 'x.......x.......'}
    beat(dr, 0, 4, {k: v for k, v in samba.items() if k in ('k', 'sh', 'cgo', 'cgl', 'cb')})
    bassline(bs, S.bar(2), tl, 'R--5R--5R--5R--A', 2, v=92)
    for b0, nb, k in [(4, 8, 'A'), (12, 8, 'B'), (20, 8, 'A'), (28, 8, 'A'), (36, 8, 'A'), (44, 4, 'O')]:
        t0 = S.bar(b0)
        bassline(bs, t0, tl, 'R--5R--5R--5R--A' if k != 'B' else 'R-.5R-.5R-.5R-.A', nb, v=96)
        comp(ep, t0, tl, 'x-.x-.x-..x-.x-.', nb, 63, False, 60)
        g = dict(samba)
        if k == 'B': g.update({'s': '....X.......X...', 'o': '..x...x...x...x.'}); del g['x']; comp(gt, t0, tl, '.x.xx.x..x.xx.x.', nb, 70, False, 50, k=3); comp(br, t0, tl, ['x.....x.....x...', '................'], nb, 66, False, 72, k=4)
        beat(dr, t0, nb - 1, g); beat(dr, S.bar(b0 + nb - 1), 1, {kk: v[:12] + '....' for kk, v in g.items()})
        if b0 < 44: fill(dr, S.bar(b0 + nb - 1, 3), 1, 'mix')
    br.chord(S.bar(47), BAR, [62, 66, 69, 73, 76], 94); beat(dr, S.bar(47), 1, {'k': 'X...............', 'c': 'X...............'})
    return S


@song
def play_twilight():
    """Mellow F major city-pop ballad in the style of Takanaka: Rhodes, nylon guitar, side stick groove, singing guitar."""
    S = Song('play_twilight', 94, seed=24, title='Twilight (play) - in the style of Takanaka'); S.bars(41); BAR = S.barlen(0)
    ld = S.track('Lead guitar', 29, 0, 96, 64); ep = S.track('Rhodes', 4, 1, 96, 50); bs = S.track('Bass', 33, 2, 104, 64)
    ny = S.track('Nylon guitar', 24, 3, 82, 86); st = S.track('Strings', 49, 4, 76, 60); vb = S.track('Vibraphone', 11, 5, 70, 40); dr = S.track('Drums', 0, 9, 96, 64)
    A = [[('Fmaj9', 4)], [('Em7', 2), ('A7b13', 2)], [('Dm9', 4)], [('Cm9', 2), ('F13', 2)], [('Bbmaj7', 4)], [('Am7', 2), ('D7b9', 2)], [('Gm9', 4)], [('C9sus4', 2), ('C7b9', 2)]]
    Bb = [[('Bbmaj7', 4)], [('A7sus4', 2), ('A7', 2)], [('Dm9', 4)], [('Dbmaj7#11', 4)], [('Cm9', 4)], [('F7b9', 4)], [('Bbmaj9', 4)], [('C9sus4', 4)]]
    H = A[:4] + A + A + Bb + A + [[('Fmaj9', 4)], [('Em7', 2), ('A7b13', 2)], [('Dm9', 2), ('G13', 2)], [('Fmaj9', 4)], [('Fmaj9', 4)]]; tl = timeline(0, prog_of(H))
    S.rit(S.bar(38), S.bar(40), 94, 80, 8)
    tA = ("A4:4 C5:4 E5:6 D5:2 | D5:4 B4:4 C#5:4 F5:4 | E5:8 F5:2 E5:2 D5:4 | Eb5:4 G5:4 D5:6 C5:2 |"
          " D5:4 F5:4 A5:6 G5:2 | G5:4 E5:4 F#5:4 Eb5:4 | A5:8 Bb5:2 A5:2 F5:4 | G5:6 F5:2 E5:4 Db5:4 |")
    tA2 = ("A5:4 C6:4 E6:6 D6:2 | D6:4 B5:4 C#6:4 F6:4^ | E6:8 F6:2 E6:2 D6:4 | Eb6:4 G6:4 D6:6 C6:2 |"
           " D6:2 C6:2 A5:2 F5:2 A5:6 G5:2 | G5:4 E5:4 F#5:4 Eb5:4 | A5:8 Bb5:2 A5:2 F5:4 | G5:6 F5:2 E5:4 Db5:4 |")
    tB = "F5:6 A5:2 D6:8^ | D6:4 E6:4 C#6:8 | E6:6 D6:2 A5:8 | G5:6 F5:2 C6:8 | Bb5:6 G5:2 D6:8^ | A5:4 C6:4 Eb6:4 Gb5:4 | F5:6 D5:2 C6:8 | Bb5:8 G5:8 |"
    mel(ld, S.bar(4), tA, bar=BAR, v=88); mel(ld, S.bar(12), tA2, bar=BAR, v=90); mel(ld, S.bar(20), tB, bar=BAR, v=96); mel(ld, S.bar(28), tA, bar=BAR, v=86)
    mel(ld, S.bar(36), "A4:4 C5:4 E5:6 D5:2 | D5:4 B4:4 C#5:4 F5:4 | E5:8 B4:4 D5:4 | [A4,E5]:32 |", bar=BAR, v=82)
    arp(ny, tl, [0, 1, 2, 3, 2, 1], TPQ // 2, 60, True, 46, 4, t1=S.bar(12)); arp(ny, tl, [0, 1, 2, 3, 2, 1], TPQ // 2, 60, True, 40, 4, t0=S.bar(28), t1=S.bar(40))
    for b0, nb, k in [(0, 4, 'I'), (4, 8, 'A'), (12, 8, 'A'), (20, 8, 'B'), (28, 8, 'A'), (36, 4, 'O')]:
        t0 = S.bar(b0)
        comp(ep, t0, tl, 'x---..x-.x-...x-' if k != 'O' else 'x---------------', nb, 62, False, 58)
        if k != 'I': bassline(bs, t0, tl, 'R---..R-5---..A-' if k != 'O' else 'R---------------', nb, v=92)
        if b0 in (12, 20): pad(st, timeline(t0, prog_of(H[b0:b0 + nb])), 62, True, 42, 4)
        g = {'k': 'x.......x.x.....', 'x': '....x.......x...', 'h': 'x.m.x.m.x.m.x.m.'} if k != 'B' else {'k': 'x.......x.x.....', 's': '....X.......X...', 'r': 'x.m.x.m.x.m.x.m.'}
        if k == 'I': g = {'h': 'x.m.x.m.x.m.x.m.'}
        if k == 'O': g = {'k': 'x.......x.......', 'x': '....x.......x...', 'h': 'x.m.x.m.x.m.x.m.'}; nb -= 1
        beat(dr, t0, nb, g, vel=.85)
        if k in 'AB': fill(dr, S.bar(b0 + nb - 1, 3), 1, 'snare', 70)
    for b in range(12, 20, 2): arp(vb, timeline(S.bar(b, 3), [(at(tl, S.bar(b, 3)), 1)]), [0, 1, 2, 3], TPQ // 4, 76, False, 44, 4)
    beat(dr, S.bar(39), 1, {'k': 'x...............', 'r': 'x...............'}, vel=.8)
    return S


@song
def play_runway():
    """Bright E major pop fusion in the style of T-Square: catchy lyricon lead, piano, bells, a key change up for the last chorus."""
    S = Song('play_runway', 150, seed=25, title='Runway (play) - in the style of T-Square'); S.bars(53); BAR = S.barlen(0)
    ld = S.track('Lyricon lead', 81, 0, 112, 64); pn = S.track('Piano', 0, 1, 66, 48); bs = S.track('Slap bass', 36, 2, 104, 64)
    br = S.track('Synth brass', 62, 3, 82, 78); sy = S.track('Synth strings', 50, 4, 70, 56); gl = S.track('Bells', 9, 5, 66, 90); dr = S.track('Drums', 0, 9, 104, 64)
    In = [[('Amaj7', 4)], [('B/A', 4)], [('G#m7', 4)], [('C#m7', 2), ('B7sus4', 2)]]
    A = [[('Emaj7', 4)], [('F#m7', 4)], [('G#m7', 4)], [('Amaj7', 4)], [('F#m7', 4)], [('G#m7', 4)], [('Amaj7', 4)], [('B7sus4', 2), ('B7', 2)]]
    Bc = [[('Amaj7', 4)], [('B/A', 4)], [('G#m7', 4)], [('C#m7', 4)], [('F#m7', 4)], [('B7', 4)], [('Emaj7/G#', 4)], [('Amaj7', 2), ('B7sus4', 2)]]
    Br = [[('C#m7', 4)], [('Bm7', 2), ('E7', 2)], [('Amaj7', 4)], [('B7sus4', 2), ('C7', 2)]]
    BcU = [[(trch(c, 1), b) for c, b in bar] for bar in Bc]
    H = In + A + Bc + A + Bc + Br + BcU + [[('Bbmaj7', 4)], [('C/Bb', 4)], [('Am7', 4)], [('Dm7', 2), ('Fmaj9', 2)], [('Fmaj9', 4)]]; tl = timeline(0, prog_of(H))
    hook = "E6:6 C#6:2 B5:4 A5:4 | B5:6 F#5:2 D#6:8 | D#6:4 C#6:4 B5:4 G#5:4 | B5:8 A5:8 |"
    mel(gl, 0, hook, bar=BAR, v=64); mel(ld, S.bar(2), "D#6:4 C#6:4 B5:4 G#5:4 | B5:8 A5:8 |", bar=BAR, v=80)
    ve = ("B4:4 E5:4 D#5:4 B4:4 | C#5:4 E5:4 A5:6 G#5:2 | B5:6 A5:2 G#5:4 F#5:4 | E5:8 C#5:4 E5:4 |"
          " A5:4 G#5:2 F#5:2 E5:4 C#5:4 | D#5:4 F#5:4 B5:8 | C#6:4 B5:4 A5:4 G#5:4 | F#5:8 A5:4 D#5:4 |")
    ch = ("E6:6 C#6:2 B5:4 A5:4 | B5:6 F#5:2 D#6:8 | D#6:4 C#6:4 B5:4 G#5:4 | B5:6 G#5:2 E5:8 |"
          " A5:4 C#6:4 E6:6 C#6:2 | D#6:6 C#6:2 B5:4 A5:4 | B5:4 G#5:4 E5:4 G#5:4 | C#6:8 B5:8 |")
    for b0 in (4, 20): mel(ld, S.bar(b0), ve, bar=BAR, v=90)
    for b0, tr in ((12, 0), (28, 0), (40, 1)):
        mel(ld, S.bar(b0), ch, bar=BAR, v=98, tr=tr); mel(gl, S.bar(b0), ch, bar=BAR, v=46, tr=tr); mel(sy, S.bar(b0), ch, bar=BAR, v=48, oct=-1, tr=tr)
    mel(ld, S.bar(36), "G#5:4 B5:4 E6:8 | D6:6 C#6:2 B5:4 G#5:4 | A5:4 C#6:4 E6:8 | F#6:8 G6:8 |", bar=BAR, v=96)
    mel(ld, S.bar(48), "D6:8 C6:8 | E6:8 D6:8 | C6:4 A5:4 E5:4 G5:4 | A5:8 C6:8 | [A5,C6]:16 |", bar=BAR, v=92)
    for b0, nb, k in [(0, 4, 'I'), (4, 8, 'V'), (12, 8, 'C'), (20, 8, 'V'), (28, 8, 'C'), (36, 4, 'B'), (40, 8, 'C'), (48, 4, 'O')]:
        t0 = S.bar(b0)
        bassline(bs, t0, tl, {'I': 'R---R---R---R---', 'V': 'R.xO.xR.R.xO.5.A', 'C': 'R-OR-OR-OR-OR-O5', 'B': 'R-.R-.R-.R-.O-5-', 'O': 'R-OR-OR-OR-OR-O5'}[k], nb, v=96)
        comp(pn, t0, tl, {'I': 'x---x---x---x---', 'V': 'x-.x-.x-x-.x-...', 'C': 'x-x-.x-x-x-.x-x-', 'B': 'x---x---x---x---', 'O': 'x-x-.x-x-x-.x-x-'}[k], nb, 66, False, 62)
        if k in 'CO': comp(br, t0, tl, 'x.......x...x...', nb, 64, False, 70, k=4); pad(sy, timeline(t0, prog_of(H[b0:b0 + nb])), 58, True, 40, 4)
        g = {'I': {'k': 'x.......x.......', 'r': 'x.x.x.x.x.x.x.x.'}, 'V': {'k': 'x.....x.x.......', 's': '....X.......X...', 'h': 'x.x.x.x.x.x.x.x.'},
             'C': {'k': 'x...x.x.x...x.x.', 's': '....X.......X...', 'o': '..x...x...x...x.', 'h': 'x...x...x...x...'}, 'B': {'k': 'x.......x.......', 's': '....X.......X...', 'r': 'x.x.x.x.x.x.x.x.'},
             'O': {'k': 'x...x.x.x...x.x.', 's': '....X.......X...', 'o': '..x...x...x...x.', 'h': 'x...x...x...x...'}}[k]
        if k == 'O': nb -= 1
        beat(dr, t0, nb - 1, g); beat(dr, S.bar(b0 + nb - 1), 1, {kk: v[:12] + '....' for kk, v in g.items()})
        fill(dr, S.bar(b0 + nb - 1, 3), 1, 'toms' if k in 'CB' else 'snare')
        if k == 'C':
            for j in range(0, nb, 2): dr.note(S.bar(b0 + j), TPQ, 49, 108)
    br.chord(S.bar(51), BAR, [57, 60, 64, 67, 69, 72], 92); bs.note(S.bar(51), BAR, 29, 110); beat(dr, S.bar(51), 1, {'k': 'X...............', 'c': 'X...............', 'C': 'X...............'})
    return S


# =============================== HIGH LEVEL (symphonic metal) ===============================

def metal_kit(S):
    return dict(gl=S.track('Guitar L', 30, 0, 90, 16), gr=S.track('Guitar R', 30, 1, 90, 112), ld=S.track('Lead guitar', 29, 2, 120, 64),
                bs=S.track('Bass', 34, 3, 88, 64), st=S.track('Strings', 48, 4, 94, 50), ch=S.track('Choir', 52, 5, 92, 78),
                hc=S.track('Harpsichord', 6, 6, 96, 86), pn=S.track('Piano', 0, 7, 96, 42), l2=S.track('Lead guitar 2', 29, 8, 92, 84), dr=S.track('Drums', 0, 9, 110, 64))

def trem(trk, tl, t0, t1, lo=38, v=90, step=TPQ // 4):
    t = t0; i = 0
    while t < t1:
        r = bassnote(at(tl, t), lo)
        for p in (r, r + 7, r + 12): trk.note(t, step * .9, p, v + (10 if i % 4 == 0 else 0), 2)
        t += step; i += 1

def guitars(T, f):
    for g in (T['gl'], T['gr']): f(g)

BLAST = {'k': 'mmmmmmmmmmmmmmmm', 's': 'x.x.x.x.x.x.x.x.', 'r': 'x.x.x.x.x.x.x.x.'}
SKANK = {'k': 'x...x...x...x...', 's': '..X...X...X...X.', 'c': 'm...m...m...m...'}
DOUBLE = {'k': 'mmmmmmmmmmmmmmmm', 's': '....X.......X...', 'ch': 'x...x...x...x...'}
HALF = {'k': 'x.....x.x.......', 's': '........X.......', 'r': 'x.x.x.x.x.x.x.x.'}
DHM = [2, 4, 5, 7, 9, 10, 1]; EHM = [4, 6, 7, 9, 11, 0, 3]; AHM = [9, 11, 0, 2, 4, 5, 8]

def drumsec(dr, S, b0, nb, g, crash=True, fillkind='toms', steps=16):
    bl = S.barlen(b0); beat(dr, S.bar(b0), nb - 1, g, steps=steps, barlen=bl)
    beat(dr, S.bar(b0 + nb - 1), 1, {k: v[:steps * 3 // 4] + '.' * (steps // 4) for k, v in g.items()}, steps=steps, barlen=bl)
    if fillkind: fill(dr, S.bar(b0 + nb - 1) + bl * 3 // 4, max(1, bl // TPQ // 4), fillkind, 104, crash)


@song
def high_circus():
    """D minor symphonic metal in the style of Imperial Circus Dead Decadence: harpsichord, blast beats, tremolo guitars, choir, a royal-road chorus."""
    S = Song('high_circus', 200, seed=31, title='Circus (high level) - in the style of Imperial Circus Dead Decadence'); S.bars(57); BAR = S.barlen(0); T = metal_kit(S)
    IH = [[('Dm', 4)], [('Bb', 4)], [('Gm', 4)], [('A7', 4)]]
    IB = [[('Dm', 4)], [('Bb', 4)], [('Gm', 4)], [('A', 4)], [('Dm', 4)], [('Bb', 4)], [('Gm', 4)], [('A7', 4)]]
    VE = [[('Dm', 4)], [('Dm', 4)], [('Eb', 4)], [('Dm', 4)], [('Dm', 4)], [('Dm', 4)], [('Bb', 4)], [('A', 4)]]
    PR = [[('Gm', 4)], [('Bb', 4)], [('C', 4)], [('A7', 4)]]
    CH = [[('Bbmaj7', 4)], [('C', 4)], [('Am7', 4)], [('Dm', 4)], [('Gm7', 4)], [('C', 4)], [('Fmaj7', 4)], [('A7', 4)]]
    SO = [[('Dm', 4)], [('Bb', 4)], [('C', 4)], [('A', 4)], [('Dm', 4)], [('Bb', 4)], [('Gm', 4)], [('A7', 4)]]
    H = IH + IB + VE + PR + CH + [[('Dm', 4)]] * 4 + SO + CH + [[('Dm', 4)], [('Bb', 4)], [('A7', 4)], [('Dm', 4)], [('Dm', 4)]]; tl = timeline(0, prog_of(H))
    E8 = TPQ // 2
    arp(T['hc'], tl, [0, 1, 2, 3, 4, 5, 4, 3], TPQ // 4, 62, True, 78, t0=0, t1=S.bar(4), accent=10)
    arp(T['hc'], tl, [0, 1, 2, 3, 4, 5, 4, 3], TPQ // 4, 62, True, 52, t0=S.bar(4), t1=S.bar(12))
    arp(T['hc'], tl, [0, 2, 1, 3, 2, 4, 3, 5], TPQ // 4, 64, True, 46, t0=S.bar(12), t1=S.bar(20))
    theme = "A5:2 D6:2 C#6:1 D6:1 E6:2 | F6:3 E6:1 D6:2 C#6:2 | D6:2 Bb5:2 G5:2 Bb5:2 | A5:6 r:2 | A5:2 D6:2 C#6:1 D6:1 E6:2 | F6:3 G6:1 F6:2 E6:2 | D6:2 E6:2 F6:2 G6:2 | A6:4 G6:2 E6:2 |"
    mel(T['ld'], S.bar(4), theme, E8, 100, 1.0, 3, BAR)
    chorus = "D6:3 C6:1 Bb5:2 A5:2 | G5:3 A5:1 C6:2 E6:2 | E6:3 D6:1 C6:2 A5:2 | D6:6 F6:2 | F6:3 E6:1 D6:2 Bb5:2 | C6:3 D6:1 E6:2 G6:2 | F6:3 E6:1 C6:2 A5:2 | C#6:6 E6:2 |"
    mel(T['ld'], S.bar(24), chorus, E8, 102, 1.0, 3, BAR); mel(T['ld'], S.bar(44), chorus, E8, 104, 1.0, 3, BAR)
    mel(T['l2'], S.bar(44), shift_text(chorus, [10, 0, 2, 4, 5, 7, 9, 1], -2), E8, 86, 1.0, 3, BAR)
    solo = ("D5:1 E5:1 F5:1 G5:1 A5:1 Bb5:1 C#6:1 D6:1 E6:1 F6:1 E6:1 D6:1 C#6:1 D6:1 A5:2 | Bb4:1 D5:1 F5:1 Bb5:1 D6:1 F6:1 Bb6:2 F6:1 D6:1 Bb5:1 F5:1 D5:1 F5:1 Bb5:2 |"
            " C5:1 E5:1 G5:1 C6:1 E6:1 G6:1 C7:2 G6:1 E6:1 C6:1 G5:1 E5:1 G5:1 C6:2 | A5:1 C#6:1 E6:1 A6:1 G6:1 E6:1 C#6:1 A5:1 E6:4^ A6:4 |")
    solo2 = ("F6:2 E6:1 D6:1 C#6:2 D6:1 E6:1 F6:2 G6:1 F6:1 E6:2 D6:2 | D6:4^ C6:2 Bb5:2 A5:2 Bb5:2 C6:2 D6:2 |"
             " G6:1 F6:1 E6:1 D6:1 F6:1 E6:1 D6:1 C#6:1 E6:1 D6:1 C#6:1 Bb5:1 D6:1 C#6:1 Bb5:1 A5:1 | A5:8^ C#6:4 E6:4 |")
    mel(T['ld'], S.bar(36), solo + ' ' + solo2, bar=BAR, v=100); mel(T['l2'], S.bar(40), shift_text(solo2, DHM, -2), bar=BAR, v=86)
    mel(T['ld'], S.bar(52), "A5:2 D6:2 C#6:1 D6:1 E6:2 | F6:3 E6:1 D6:2 C#6:2 | E6:2 C#6:2 A5:2 G5:2 | D6:8 | r:8 |", E8, 104, 1.0, 3, BAR)
    mel(T['pn'], S.bar(20), "G4:2 A4:2 Bb4:2 D5:2 | F5:2 D5:2 Bb4:2 F5:2 | G5:2 E5:2 C5:2 G5:2 | A5:4 C#6:4 |", E8, 84, 1.0, 3, BAR)
    guitars(T, lambda g: trem(g, tl, S.bar(4), S.bar(12), v=86))
    guitars(T, lambda g: pchords(g, tl, S.bar(12), 8, ['X-mm m-mm m-mm m-mm', 'X-mm m-mm m-mm m-mm', 'X-mm m-mm X-mm m-mm', 'X-mm m-mm m-mm m-mm'], 38, v=92))
    guitars(T, lambda g: pchords(g, tl, S.bar(20), 4, 'X-------x-------', 38, v=90))
    guitars(T, lambda g: pchords(g, tl, S.bar(24), 8, 'x-x-x-x-x-x-x-x-', 38, v=90))
    guitars(T, lambda g: pchords(g, tl, S.bar(32), 4, ['m.m.mm..m.m.X---', 'm.m.mm..m.m.X---', 'm.m.mm..m.m.X---', 'm.m.mm..mmmmX---'], 38, v=94))
    guitars(T, lambda g: trem(g, tl, S.bar(36), S.bar(40), v=84)); guitars(T, lambda g: pchords(g, tl, S.bar(40), 4, 'x-x-x-x-x-x-x-x-', 38, v=88))
    guitars(T, lambda g: pchords(g, tl, S.bar(44), 8, 'x-x-x-x-x-x-x-x-', 38, v=90)); guitars(T, lambda g: trem(g, tl, S.bar(52), S.bar(55), v=88))
    guitars(T, lambda g: pchords(g, tl, S.bar(55), 1, 'X---------------', 38, v=100))
    for b0, nb, tm in [(4, 8, 'R' * 16), (12, 8, 'R-RR' * 4), (20, 4, 'R-------R-------'), (24, 8, 'R-' * 8), (32, 4, ['R.R.RR..R.R.R---', 'R.R.RR..R.R.R---', 'R.R.RR..R.R.R---', 'R.R.RR..RRRRR---']),
                       (36, 4, 'R' * 16), (40, 4, 'R-' * 8), (44, 8, 'R-' * 8), (52, 3, 'R' * 16), (55, 1, 'R---------------')]:
        bassline(T['bs'], S.bar(b0), tl, tm, nb, lo=26, v=100)
    for b0, nb in ((4, 8), (20, 4), (24, 8), (44, 8), (52, 4)):
        sub = timeline(S.bar(b0), prog_of(H[b0:b0 + nb])); pad(T['st'], sub, 64, True, 70, 4); pad(T['ch'], sub, 60, True, 74, 3)
    T['st'].swell(S.bar(20), S.bar(24), 60, 120); comp(T['pn'], S.bar(24), tl, 'x---x---x---x---', 8, 64, True, 70)
    for i in range(16): T['hc'].note(S.bar(32) + i * TPQ, TPQ, [69, 70][i % 2] + 12, 60)
    dr = T['dr']; beat(dr, 0, 3, {'r': 'x.x.x.x.x.x.x.x.'}, vel=.6); fill(dr, S.bar(3), 4, 'snare', 100)
    drumsec(dr, S, 4, 8, BLAST); drumsec(dr, S, 12, 8, DOUBLE); drumsec(dr, S, 20, 4, HALF, fillkind='snare'); drumsec(dr, S, 24, 8, SKANK)
    beat(dr, S.bar(32), 4, {'k': 'x.x.xx..x.x.x...', 's': '............X...', 'ch': 'x.......x.......'}); dr.note(S.bar(36), TPQ, 49, 120)
    drumsec(dr, S, 36, 4, BLAST, fillkind=None); drumsec(dr, S, 40, 4, DOUBLE); drumsec(dr, S, 44, 8, SKANK); drumsec(dr, S, 52, 3, BLAST)
    for b in (4, 8, 24, 28, 44, 48): dr.note(S.bar(b), TPQ, 57, 118)
    beat(dr, S.bar(55), 1, {'k': 'X...............', 'c': 'X...............', 'C': 'X...............'})
    return S


@song
def high_requiem():
    """E minor symphonic metal: a piano prelude, a 7/8 riff with organ and choir, thrash verse, royal-road chorus, harmonised solo."""
    S = Song('high_requiem', 92, seed=32, title='Requiem (high level) - in the style of Imperial Circus Dead Decadence')
    S.bars(4); S.bars(8, 7, 8); S.bars(36, 4, 4); S.bars(5); T = metal_kit(S); org = S.track('Organ', 19, 10, 84, 64)
    S.set_tempo(S.bar(4), 138)
    PI = [[('Em', 4)], [('Cmaj7', 4)], [('Am9', 4)], [('B7', 4)]]
    RF = [[('Em', 3.5)], [('Em', 3.5)], [('Em', 3.5)], [('B', 3.5)]] * 2
    VE = [[('Em', 4)], [('Em', 4)], [('C', 4)], [('D', 4)], [('Em', 4)], [('Em', 4)], [('Am', 4)], [('B7', 4)]]
    CH = [[('Cmaj7', 4)], [('D', 4)], [('Bm7', 4)], [('Em', 4)], [('Am7', 4)], [('D', 4)], [('Gmaj7', 4)], [('B7', 4)]]
    BR = [[('Am', 4)], [('Fmaj7', 4)], [('B7', 4)], [('B7', 4)]]
    SO = [[('Em', 4)], [('Cmaj7', 4)], [('Am', 4)], [('B7', 4)]] * 2
    H = PI + RF + VE + CH + BR + SO + CH + [[('Em', 4)], [('Cmaj7', 4)], [('B7', 4)], [('Em', 4)], [('Em', 4)]]; tl = timeline(0, prog_of(H))
    E8 = TPQ // 2; B4 = S.barlen(0); B7 = S.barlen(4); B44 = S.barlen(12)
    arp(T['pn'], tl, [0, 1, 2, 3, 4, 3, 2, 1], E8, 58, True, 54, t0=0, t1=S.bar(4)); pedal_by_chord(T['pn'], tl, 0, S.bar(4))
    mel(T['pn'], 0, "B5:3 A5:1 | G5:4 | E5:2 C5:2 | D#5:4 |", TPQ, 84, 1.0, 5, B4)
    riff = "E2P:2. E2P:1. G2P:2 F#2P:2 | E2P:2. E2P:1. A2P:2 G2P:1 F#2P:1 | E2P:2. E2P:1. G2P:2 A#2P:2 | B2P:2 A2P:1 G2P:2 F#2P:2 |"
    guitars(T, lambda g: mel(g, S.bar(4), riff + ' ' + riff, E8, 98, 1.0, 3, B7))
    mel(T['bs'], S.bar(4), ' '.join(t.replace('2P', '1') for t in (riff + ' ' + riff).split()), E8, 100, 1.0, 3, B7)
    mel(T['ld'], S.bar(8), "B5:3 C6:1 B5:1 G5:2 | E6:3 D#6:2 B5:2 | C6:2 B5:1 A#5:2 G5:2 | F#5:7 |", E8, 100, 1.0, 3, B7)
    for a, z, c in timeline(S.bar(4), prog_of(RF)): org.chord(a, z - a + 20, vl(c, 60, True, 4), 70); T['ch'].chord(a, z - a + 20, vl(c, 62, True, 3), 66)
    guitars(T, lambda g: trem(g, tl, S.bar(12), S.bar(20), v=86)); bassline(T['bs'], S.bar(12), tl, 'R' * 16, 8, lo=26, v=100)
    for a, z, c in timeline(S.bar(12), prog_of(VE)): org.chord(a, z - a + 20, vl(c, 60, True, 4), 64)
    chorus = "G5:3 A5:1 B5:2 C6:2 | D6:4 C6:2 B5:2 | A5:3 B5:1 D6:2 F#6:2 | E6:6 G6:2 | E6:3 D6:1 C6:2 A5:2 | F#5:3 G5:1 A5:2 D6:2 | B5:3 A5:1 G5:2 F#5:2 | D#6:6 F#6:2 |"
    for b0 in (20, 40):
        mel(T['ld'], S.bar(b0), chorus, E8, 102, 1.0, 3, B44); guitars(T, lambda g: pchords(g, tl, S.bar(b0), 8, 'x-x-x-x-x-x-x-x-', 38, v=90))
        bassline(T['bs'], S.bar(b0), tl, 'R-' * 8, 8, lo=26, v=100); sub = timeline(S.bar(b0), prog_of(CH)); pad(T['st'], sub, 64, True, 70, 4); pad(T['ch'], sub, 60, True, 72, 3)
    mel(T['l2'], S.bar(40), shift_text(chorus, [7, 9, 11, 0, 2, 4, 6, 3], -2), E8, 86, 1.0, 3, B44)
    guitars(T, lambda g: trem(g, tl, S.bar(28), S.bar(32), v=88)); bassline(T['bs'], S.bar(28), tl, 'R' * 16, 4, lo=26, v=100)
    sub = timeline(S.bar(28), prog_of(BR)); pad(T['ch'], sub, 64, True, 96, 4); pad(org, sub, 58, True, 80, 4); T['ch'].swell(S.bar(28), S.bar(32), 80, 127)
    solo = ("E5:1 F#5:1 G5:1 A5:1 B5:1 C6:1 D#6:1 E6:1 F#6:2 E6:1 D#6:1 B5:4 | C6:1 E6:1 G6:1 B6:1 G6:1 E6:1 C6:1 B5:1 G5:4^ E5:4 |"
            " A5:2 C6:1 E6:1 A6:4^ G6:1 F#6:1 E6:1 D6:1 C6:2 B5:2 | D#6:1 F#6:1 A6:1 B6:1 A6:1 F#6:1 D#6:1 B5:1 C6:2 B5:2 A5:2 F#5:2 |")
    solo2 = ("G6:4^ F#6:2 E6:2 D#6:2 E6:2 F#6:2 G6:2 | E6:1 D6:1 C6:1 B5:1 C6:1 B5:1 A5:1 G5:1 E6:8^ |"
             " C6:1 B5:1 A5:1 G5:1 F#5:1 G5:1 A5:1 B5:1 C6:1 D6:1 E6:1 F#6:1 G6:2 A6:2 | B6:8^ A6:4 F#6:4 |")
    mel(T['ld'], S.bar(32), solo + ' ' + solo2, bar=B44, v=100); mel(T['l2'], S.bar(36), shift_text(solo2, EHM, -2), bar=B44, v=86)
    guitars(T, lambda g: pchords(g, tl, S.bar(32), 8, ['X-mm m-mm m-mm m-mm', 'x-x-x-x-x-x-x-x-'], 38, v=88)); bassline(T['bs'], S.bar(32), tl, ['R-RR' * 4, 'R-' * 8], 8, lo=26, v=100)
    mel(T['ld'], S.bar(48), "B5:4 G5:4 | E6:8 | D#6:8 | E6:8 | r:8 |", E8, 100, 1.0, 3, B44)
    guitars(T, lambda g: pchords(g, tl, S.bar(48), 3, 'x-x-x-x-x-x-x-x-', 38, v=90)); guitars(T, lambda g: pchords(g, tl, S.bar(51), 1, 'X---------------', 38, v=100))
    bassline(T['bs'], S.bar(48), tl, ['R-' * 8, 'R-' * 8, 'R-' * 8, 'R---------------'], 4, lo=26, v=100)
    arp(T['pn'], tl, [0, 1, 2, 3, 4, 5, 4, 3], TPQ // 4, 64, True, 60, t0=S.bar(48), t1=S.bar(51))
    T['pn'].chord(S.bar(51), B44 * 2, [40, 52, 59, 64, 67, 71, 76], 80, 20)
    dr = T['dr']; dr.note(S.bar(4), TPQ, 49, 120)
    beat(dr, S.bar(4), 8, {'k': 'x...x.x...x...', 's': '........X.....', 'h': 'x.x.x.x.x.x.x.', 'c': 'x.............'}, steps=14, barlen=B7)
    drumsec(dr, S, 12, 8, {'k': 'x.x.x.x.x.x.x.x.', 's': '....X.......X...', 'h': 'x.x.x.x.x.x.x.x.'}); drumsec(dr, S, 20, 8, SKANK); drumsec(dr, S, 28, 4, DOUBLE)
    drumsec(dr, S, 32, 8, DOUBLE); drumsec(dr, S, 40, 8, SKANK); drumsec(dr, S, 48, 3, SKANK, fillkind='snare')
    for b in (12, 20, 24, 32, 40, 44): dr.note(S.bar(b), TPQ, 57, 118)
    beat(dr, S.bar(51), 1, {'k': 'X...............', 'c': 'X...............', 'C': 'X...............'})
    return S


@song
def high_carnival():
    """A minor symphonic metal with a dark circus waltz (3/4) that comes back as a heavy metal waltz."""
    S = Song('high_carnival', 150, 3, 4, seed=33, title='Carnival (high level) - in the style of Imperial Circus Dead Decadence')
    S.bars(8); S.bars(24, 4, 4); S.bars(8, 3, 4); S.bars(21, 4, 4); T = metal_kit(S); pz = S.track('Pizzicato', 45, 10, 96, 40); gk = S.track('Glockenspiel', 9, 11, 80, 92)
    WI = [[('Am', 3)], [('E7', 3)], [('Am', 3)], [('E7', 3)], [('Dm', 3)], [('Am', 3)], [('B7', 3)], [('E7', 3)]]
    EX = [[('Am', 4)], [('F', 4)], [('Dm', 4)], [('E', 4)], [('Am', 4)], [('F', 4)], [('Dm', 4)], [('E7', 4)]]
    VE = [[('Am', 4)], [('Am', 4)], [('Bb', 4)], [('Am', 4)], [('Am', 4)], [('Am', 4)], [('F', 4)], [('E', 4)]]
    CH = [[('Fmaj7', 4)], [('G', 4)], [('Em7', 4)], [('Am', 4)], [('Dm7', 4)], [('G', 4)], [('Cmaj7', 4)], [('E7', 4)]]
    SO = [[('Am', 4)], [('F', 4)], [('G', 4)], [('E', 4)], [('Am', 4)], [('F', 4)], [('Dm', 4)], [('E7', 4)]]
    H = WI + EX + VE + CH + WI + SO + CH + [[('Am', 4)], [('F', 4)], [('E7', 4)], [('Am', 4)], [('Am', 4)]]; tl = timeline(0, prog_of(H))
    E8 = TPQ // 2; B3 = S.barlen(0); B44 = S.barlen(8)
    circus = "E5:1 F5:1 E5:1 D#5:1 E5:2 | B5:4 G#5:2 | A5:1 B5:1 A5:1 G#5:1 A5:2 | E6:4 D6:2 | C6:2 B5:1 A5:1 G#5:1 A5:1 | B5:2 E5:4 | D#5:1 E5:1 F#5:1 G#5:1 A5:1 B5:1 | G#5:6 |"
    mel(gk, 0, circus, E8, 82, 1.0, 3, B3)
    for seg in ((0, 8), (32, 40)):
        for b in range(*seg):
            c = at(tl, S.bar(b)); r = bassnote(c, 33); pz.note(S.bar(b), TPQ, r, 80, 2)
            for k in (1, 2): T['hc'].chord(S.bar(b, k), TPQ * .6, vl(c, 62, True, 3), 58, 0, 3); pz.chord(S.bar(b, k), TPQ * .5, vl(c, 55, True, 3), 52, 0, 3)
    beat(T['dr'], 0, 8, {'wb': '....x...x...'}, steps=12, barlen=B3, vel=.5)
    ex = "E6:2 F6:1 E6:1 D#6:2 E6:2 | C6:4 A5:4 | F6:2 E6:1 D6:1 C6:2 A5:2 | B5:4 G#5:4 | E6:2 F6:1 E6:1 D#6:2 E6:2 | C6:4 F6:4 | D6:2 E6:1 F6:1 A6:2 F6:2 | E6:8 |"
    mel(T['ld'], S.bar(8), ex, E8, 102, 1.0, 3, B44)
    chorus = "A5:3 G5:1 F5:2 E5:2 | D5:3 E5:1 G5:2 B5:2 | B5:3 A5:1 G5:2 E5:2 | A5:6 C6:2 | C6:3 B5:1 A5:2 F5:2 | G5:3 A5:1 B5:2 D6:2 | E6:3 D6:1 C6:2 B5:2 | G#5:6 B5:2 |"
    for b0 in (24, 48):
        mel(T['ld'], S.bar(b0), chorus, E8, 102, 1.0, 3, B44); mel(T['l2'], S.bar(b0), shift_text(chorus, [0, 2, 4, 5, 7, 9, 11, 8], -2), E8, 84, 1.0, 3, B44)
        guitars(T, lambda g: pchords(g, tl, S.bar(b0), 8, 'x-x-x-x-x-x-x-x-', 40, v=90)); bassline(T['bs'], S.bar(b0), tl, 'R-' * 8, 8, lo=28, v=100)
        sub = timeline(S.bar(b0), prog_of(CH)); pad(T['st'], sub, 64, True, 70, 4); pad(T['ch'], sub, 60, True, 72, 3); drumsec(T['dr'], S, b0, 8, SKANK)
    mel(T['ld'], S.bar(32), circus, E8, 104, 1.0, 3, B3); mel(T['l2'], S.bar(32), shift_text(circus, AHM, -2), E8, 86, 1.0, 3, B3)
    guitars(T, lambda g: pchords(g, tl, S.bar(32), 8, 'X---m-m-m-m-', 40, v=94, barlen=B3, steps=12)); bassline(T['bs'], S.bar(32), tl, 'R---R-R-R-R-', 8, barlen=B3, steps=12, lo=28, v=100)
    pad(T['ch'], timeline(S.bar(32), prog_of(WI)), 62, True, 76, 3)
    beat(T['dr'], S.bar(32), 8, {'k': 'x.......x.x.', 's': '....x...x...', 'ch': 'x...........', 'c': 'x...........' + '.' * 36}, steps=12, barlen=B3)
    guitars(T, lambda g: trem(g, tl, S.bar(8), S.bar(16), v=86)); bassline(T['bs'], S.bar(8), tl, 'R' * 16, 8, lo=28, v=100)
    sub = timeline(S.bar(8), prog_of(EX)); pad(T['st'], sub, 64, True, 72, 4); pad(T['ch'], sub, 60, True, 76, 3); drumsec(T['dr'], S, 8, 8, DOUBLE)
    guitars(T, lambda g: pchords(g, tl, S.bar(16), 8, ['X-mm m-mm m-mm m-mm', 'x-mm m-mm m-mm m-mm', 'X-mm m-mm X-mm m-mm', 'x-mm m-mm m-mm m-mm'], 40, v=92))
    bassline(T['bs'], S.bar(16), tl, 'R-RR' * 4, 8, lo=28, v=100); drumsec(T['dr'], S, 16, 8, DOUBLE)
    arp(T['hc'], tl, [0, 2, 1, 3, 2, 4, 3, 5], TPQ // 4, 64, True, 48, t0=S.bar(16), t1=S.bar(24))
    solo = ("A5:1 B5:1 C6:1 D6:1 E6:1 F6:1 G#6:1 A6:1 G#6:1 F6:1 E6:1 D6:1 C6:2 B5:2 | A5:1 C6:1 F6:1 A6:1 C7:2 A6:1 F6:1 C6:1 A5:1 F5:1 A5:1 C6:4 |"
            " B5:1 D6:1 G6:1 B6:1 D7:2 B6:1 G6:1 D6:1 B5:1 G5:1 B5:1 D6:4 | E6:4^ D6:1 C6:1 B5:1 A5:1 G#5:4 B5:4 |")
    solo2 = ("C6:2 B5:1 A5:1 E6:2 D6:1 C6:1 A6:4^ G#6:2 E6:2 | F6:2 E6:1 D6:1 C6:2 A5:2 F6:4^ E6:4 |"
             " D6:1 E6:1 F6:1 G#6:1 A6:1 G#6:1 F6:1 E6:1 D6:1 C6:1 B5:1 A5:1 G#5:2 B5:2 | E6:8^ G#6:4 B6:4 |")
    mel(T['ld'], S.bar(40), solo + ' ' + solo2, bar=B44, v=100); mel(T['l2'], S.bar(44), shift_text(solo2, AHM, -2), bar=B44, v=86)
    guitars(T, lambda g: trem(g, tl, S.bar(40), S.bar(44), v=84)); guitars(T, lambda g: pchords(g, tl, S.bar(44), 4, 'x-x-x-x-x-x-x-x-', 40, v=88))
    bassline(T['bs'], S.bar(40), tl, ['R' * 16] * 4 + ['R-' * 8] * 4, 8, lo=28, v=100); drumsec(T['dr'], S, 40, 4, DOUBLE, fillkind=None); drumsec(T['dr'], S, 44, 4, DOUBLE)
    mel(T['ld'], S.bar(56), "E6:2 F6:1 E6:1 D#6:2 E6:2 | C6:4 F6:4 | E6:4 G#5:4 | A5:8 | r:8 |", E8, 104, 1.0, 3, B44)
    guitars(T, lambda g: trem(g, tl, S.bar(56), S.bar(59), v=88)); guitars(T, lambda g: pchords(g, tl, S.bar(59), 1, 'X---------------', 40, v=100))
    bassline(T['bs'], S.bar(56), tl, ['R' * 16] * 3 + ['R---------------'], 4, lo=28, v=100); drumsec(T['dr'], S, 56, 3, DOUBLE)
    gk.note(S.bar(59), B44, 81, 70); T['hc'].chord(S.bar(59), B44, [57, 60, 64, 69], 80, 20)
    for b in (8, 16, 24, 40, 48, 56): T['dr'].note(S.bar(b), TPQ, 57, 118)
    beat(T['dr'], S.bar(59), 1, {'k': 'X...............', 'c': 'X...............', 'C': 'X...............'})
    return S


# =============================== DUEL (Persona style) ===============================

@song
def duel_moonlit():
    """G minor battle theme in the style of Persona 3: piano hook over a hip-hop beat, rock guitars, synth bass, square lead."""
    S = Song('duel_moonlit', 136, seed=41, title='Moonlit (duel) - in the style of Persona 3'); S.bars(32); BAR = S.barlen(0)
    pn = S.track('Piano', 0, 0, 100, 58); ld = S.track('Lead', 80, 1, 92, 70); bs = S.track('Synth bass', 38, 2, 100, 64)
    gt = S.track('Guitar', 30, 3, 92, 100); st = S.track('Strings', 48, 4, 86, 40); dr = S.track('Drums', 0, 9, 110, 64)
    H = [[('Gm', 4)], [('Ebmaj7', 4)], [('Cm7', 4)], [('D7', 4)]] * 8; tl = timeline(0, prog_of(H))
    hook = "G4:2 Bb4:2 D5:2 G5:1 F5:1 D5:2 Bb4:2 C5:2 D5:2 | G4:2 Bb4:2 Eb5:2 G5:1 F5:1 Eb5:2 Bb4:2 C5:2 D5:2 | G4:2 Bb4:2 Eb5:2 G5:1 F5:1 Eb5:2 C5:2 Bb4:2 G4:2 | F#4:2 A4:2 D5:2 F#5:1 G5:1 A5:2 F#5:2 D5:2 C5:2 |"
    for b0 in (0, 4, 8, 24, 28): mel(pn, S.bar(b0), hook, bar=BAR, v=84 if b0 else 76)
    for b0 in (12, 16): mel(pn, S.bar(b0), hook, bar=BAR, v=62)
    mel(pn, S.bar(20), "G4:2 Bb4:2 D5:2 G5:1 F5:1 D5:2 Bb4:2 C5:2 D5:2 | r:16 | G4:2 Bb4:2 Eb5:2 G5:1 F5:1 Eb5:2 C5:2 Bb4:2 G4:2 | r:16 |", bar=BAR, v=70)
    tune = ("D5:3 D5:3 C5:2 Bb4:2 A4:2 G4:4 | Bb4:3 Bb4:3 C5:2 D5:4 Eb5:4 | G5:3 F5:3 Eb5:2 D5:2 C5:2 Bb4:4 | A4:6 F#4:2 A4:2 C5:2 D5:4 |"
            " D5:3 D5:3 C5:2 Bb4:2 A4:2 G4:4 | Bb4:3 Bb4:3 C5:2 D5:2 F5:2 G5:4 | G5:3 Bb5:3 A5:2 G5:2 F5:2 Eb5:4 | F#5:6 E5:2 D5:2 C5:2 A4:4 |")
    mel(ld, S.bar(12), tune, bar=BAR, v=94); mel(ld, S.bar(12), tune, bar=BAR, v=70, oct=-1)
    for b0, nb in ((4, 8), (12, 8), (24, 8)):
        bassline(bs, S.bar(b0), tl, 'R-.R..R-R-.R..A-', nb, lo=31, v=100)
        pchords(gt, tl, S.bar(b0), nb, 'X-------x---x---' if b0 != 12 else 'X-------X-------', 43, v=88)
        g = {'k': 'x.....x...x.....', 's': '....X.......X...', 'cl': '....x.......x...', 'h': 'x.x.x.x.x.x.x.o.'}
        beat(dr, S.bar(b0), nb - 1, g); beat(dr, S.bar(b0 + nb - 1), 1, {k: v[:12] + '....' for k, v in g.items()}); fill(dr, S.bar(b0 + nb - 1, 3), 1, 'mix')
    comp(st, S.bar(12), tl, 'x..x..x...x..x..', 8, 64, True, 76, k=4)
    beat(dr, 0, 4, {'k': 'x.....x...x.....', 'h': 'x.x.x.x.x.x.x.x.'}, vel=.8)
    bassline(bs, S.bar(20), tl, 'R-.R..R-R-.R..A-', 4, lo=31, v=96); beat(dr, S.bar(20), 3, {'k': 'x..x..x...x..x..', 's': '....X.......X...', 'h': 'xmxmxmxmxmxmxmxm'}); fill(dr, S.bar(23), 4, 'toms')
    return S


@song
def duel_fog():
    """E minor / G major battle theme in the style of Persona 4: disco funk rock, string runs, octave slap bass."""
    S = Song('duel_fog', 126, seed=42, title='Fog (duel) - in the style of Persona 4'); S.bars(28); BAR = S.barlen(0)
    ld = S.track('Lead', 81, 0, 108, 64); st = S.track('Strings', 48, 1, 96, 46); bs = S.track('Slap bass', 36, 2, 104, 64)
    pn = S.track('Piano', 0, 3, 76, 80); gt = S.track('Guitar', 27, 4, 76, 100); dr = S.track('Drums', 0, 9, 108, 64)
    In = [[('Em9', 4)], [('Cmaj7', 4)], [('Am9', 4)], [('B7sus4', 2), ('B7', 2)]]
    Ve = [[('Em9', 4)], [('Cmaj7', 4)], [('Am9', 4)], [('B7sus4', 2), ('B7', 2)], [('Em9', 4)], [('Cmaj7', 4)], [('Am7', 4)], [('D', 2), ('B7', 2)]]
    Pr = [[('Cmaj7', 4)], [('D', 4)], [('Em7', 4)], [('D/F#', 4)]]
    Ch = [[('Cmaj7', 4)], [('D', 4)], [('Bm7', 4)], [('Em7', 4)], [('Am7', 4)], [('D', 4)], [('Gmaj7', 4)], [('B7', 4)]]
    H = In + Ve + Pr + Ch + In; tl = timeline(0, prog_of(H))
    run = "E5:1 F#5:1 G5:1 B5:1 D6:4 B5:2 G5:2 F#5:4 | E5:1 F#5:1 G5:1 B5:1 E6:4 D6:2 B5:2 G5:4 | E5:1 F#5:1 G5:1 B5:1 C6:4 B5:2 G5:2 E5:4 | F#5:2 E5:2 F#5:2 A5:2 D#6:4 F#6:4 |"
    mel(st, 0, run, bar=BAR, v=92); mel(st, S.bar(24), run, bar=BAR, v=92)
    ve = ("B4:3 B4:3 E5:2 D5:2 B4:2 G4:4 | G4:3 A4:3 B4:2 E5:8 | C5:3 B4:3 A4:2 G4:2 A4:2 B4:4 | E5:8 D#5:8 |"
          " B4:3 B4:3 E5:2 F#5:2 G5:2 E5:4 | G5:3 F#5:3 E5:2 D5:2 E5:2 B4:4 | C5:3 B4:3 A4:2 C5:2 E5:2 G5:4 | F#5:8 D#5:8 |")
    pr = "E5:2 G5:2 B5:4 C6:4 B5:4 | A5:2 F#5:2 D5:4 E5:4 F#5:4 | G5:2 B5:2 E6:4 D6:4 B5:4 | A5:8 F#5:4 D5:4 |"
    ch = ("G5:4 E5:2 G5:2 B5:4 A5:4 | F#5:6 E5:2 D5:4 A5:4 | D6:4 B5:2 A5:2 F#5:4 A5:4 | G5:12 E5:4 |"
          " E6:4 C6:2 E6:2 G6:4 E6:4 | F#6:6 E6:2 D6:4 A5:4 | B5:4 D6:4 F#6:4 D6:4 | D#6:8 B5:4 A5:4 |")
    mel(ld, S.bar(4), ve, bar=BAR, v=92); mel(ld, S.bar(12), pr, bar=BAR, v=94); mel(ld, S.bar(16), ch, bar=BAR, v=98); mel(st, S.bar(16), ch, bar=BAR, v=64, oct=-1)
    disco = {'k': 'x...x...x...x...', 's': '....X.......X...', 'h': 'x.g.x.g.x.g.x.g.', 'o': '..x...x...x...x.'}
    for b0, nb, k in ((0, 4, 'I'), (4, 8, 'V'), (12, 4, 'P'), (16, 8, 'C'), (24, 4, 'I')):
        t0 = S.bar(b0)
        bassline(bs, t0, tl, 'R.O.R.O.R.O.R.OA', nb, v=98)
        comp(pn, t0, tl, '..x-..x-..x-..x-' if k in 'CI' else 'x-.x-.x-..x-.x-.', nb, 66, False, 64)
        comp(gt, t0, tl, '.x.x.x.x.x.x.x.x', nb, 72, False, 46, k=2)
        if k == 'C': pad(st, timeline(t0, prog_of(Ch)), 60, True, 40, 3)
        g = dict(disco) if k != 'P' else {'k': 'x...x...x...x...', 's': '....X.......X..x', 'r': 'x.x.x.x.x.x.x.x.'}
        beat(dr, t0, nb - 1, g); beat(dr, S.bar(b0 + nb - 1), 1, {kk: v[:12] + '....' for kk, v in g.items()}); fill(dr, S.bar(b0 + nb - 1, 3), 1, 'snare' if k != 'C' else 'toms')
    for b in (4, 16, 20): dr.note(S.bar(b), TPQ, 49, 112)
    return S


@song
def duel_heist():
    """F minor acid-jazz rock battle theme in the style of Persona 5: Rhodes stabs, busy bass, ghost-note drums, alto sax lead, brass hits."""
    S = Song('duel_heist', 172, seed=43, title='Heist (duel) - in the style of Persona 5'); S.bars(40); BAR = S.barlen(0)
    sx = S.track('Lead', 81, 0, 100, 64); ep = S.track('Rhodes', 4, 1, 84, 46); bs = S.track('Bass', 33, 2, 106, 64)
    br = S.track('Brass', 61, 3, 86, 80); st = S.track('Strings', 48, 4, 80, 54); gt = S.track('Guitar', 27, 5, 76, 100); dr = S.track('Drums', 0, 9, 108, 64)
    In = [[('Fm9', 4)], [('Dbmaj7', 4)], [('Bbm9', 4)], [('C7#9', 4)]]
    A = [[('Fm9', 4)], [('Dbmaj7', 4)], [('Bbm9', 4)], [('C7#9', 4)], [('Fm9', 4)], [('Dbmaj7', 4)], [('Gm7b5', 4)], [('C7#9', 4)]]
    Bc = [[('Dbmaj7', 4)], [('Eb', 4)], [('Cm7', 4)], [('Fm9', 4)], [('Bbm9', 4)], [('Eb7', 4)], [('Abmaj7', 4)], [('Gm7b5', 2), ('C7b9', 2)]]
    Bk = [[('Fm9', 4)], [('Fm9', 4)], [('Dbmaj7', 4)], [('C7#9', 4)]]
    H = In + A + Bc + Bk + A + Bc; tl = timeline(0, prog_of(H))
    ta = ("C5:2 Eb5:2 F5:3 Ab5:3 G5:2 F5:4 | F5:2 Eb5:2 C5:3 Ab4:3 Bb4:2 C5:4 | Db5:2 F5:2 Ab5:3 C6:3 Bb5:2 Ab5:4 | G5:6 E5:2 Eb5:4 C5:4 |"
          " C5:2 Eb5:2 F5:3 Ab5:3 G5:2 F5:4 | Ab5:2 C6:2 Db6:3 C6:3 Ab5:2 F5:4 | Bb5:2 Ab5:2 F5:3 Db5:3 C5:2 Bb4:4 | E5:8 Eb5:4 G5:4 |")
    tb = ("F5:4 Ab5:4 C6:6 Bb5:2 | G5:4 Bb5:4 Eb6:6 Db6:2 | C6:4 Bb5:2 G5:2 Eb5:4 G5:4 | Ab5:12 G5:4 |"
          " Db6:4 C6:2 Bb5:2 F5:4 Ab5:4 | G5:4 Bb5:4 Db6:4 Eb6:4 | C6:6 Bb5:2 Ab5:4 G5:4 | F5:4 Db5:4 E5:4 Db5:4 |")
    for b0 in (4, 24): mel(sx, S.bar(b0), ta, bar=BAR, v=94)
    for b0 in (12, 32): mel(sx, S.bar(b0), tb, bar=BAR, v=100); mel(br, S.bar(b0), tb, bar=BAR, v=66, oct=-1)
    for b0, nb, k in ((0, 4, 'I'), (4, 8, 'A'), (12, 8, 'B'), (20, 4, 'K'), (24, 8, 'A'), (32, 8, 'B')):
        t0 = S.bar(b0)
        bassline(bs, t0, tl, 'R.R5.RO.R.75.RA.' if k != 'K' else 'R..R..R.R..R.5A.', nb, v=98)
        comp(ep, t0, tl, 'X..x..X..x..X.x.' if k != 'B' else 'x-.x-.x-..x-.x-.', nb, 63, False, 66)
        comp(gt, t0, tl, '.x.xx.x..x.xx.x.', nb, 70, False, 50, k=2)
        if k == 'B': comp(br, t0, tl, ['X..X......X.....', '................'], nb, 66, False, 76, k=4); pad(st, timeline(t0, prog_of(Bc)), 62, True, 46, 4)
        g = {'k': 'x.....x...x..x..', 's': '....X..g.g..X..g', 'h': 'x.x.x.x.x.x.x.o.'} if k != 'B' else {'k': 'x.....x...x..x..', 's': '....X..g.g..X..g', 'r': 'x.x.x.x.x.x.x.x.', 'o': '..............x.'}
        if k == 'I': g = {'k': 'x.....x...x..x..', 'h': 'x.x.x.x.x.x.x.x.'}
        beat(dr, t0, nb - 1, g); beat(dr, S.bar(b0 + nb - 1), 1, {kk: v[:12] + '....' for kk, v in g.items()}); fill(dr, S.bar(b0 + nb - 1, 3), 1, 'mix')
    for b in (4, 12, 24, 32): dr.note(S.bar(b), TPQ, 49, 114)
    return S


# =============================== DEAD ===============================

@song
def dead_alley():
    """D minor late-night acid jazz in the style of Persona 5's Alleycat: Rhodes, laid-back bass, brushed groove, alto sax line."""
    S = Song('dead_alley', 84, seed=51, title='Alley (game over) - in the style of Persona 5'); S.bars(22); BAR = S.barlen(0)
    sx = S.track('Lead', 81, 0, 96, 64); ep = S.track('Rhodes', 4, 1, 100, 52); bs = S.track('Bass', 33, 2, 104, 64)
    gt = S.track('Jazz guitar', 26, 3, 80, 92); st = S.track('Strings', 49, 4, 70, 60); vb = S.track('Vibraphone', 11, 5, 76, 36); dr = S.track('Drums', 0, 9, 92, 64)
    In = [[('Dm9', 4)], [('Gm9', 2), ('A7b13', 2)]]
    A = [[('Dm9', 4)], [('G13', 4)], [('Bbmaj7', 4)], [('A7b13', 4)], [('Dm9', 4)], [('Fmaj7/C', 4)], [('Ebmaj7#11', 4)], [('A7sus4', 2), ('A7b9', 2)]]
    Bb = [[('Gm9', 4)], [('C13', 4)], [('Fmaj9', 4)], [('Bbmaj7', 4)], [('Em7b5', 4)], [('A7b9', 4)], [('Dm9', 4)], [('Ebmaj7', 2), ('A7#9', 2)]]
    Ae = [[('Dm9', 4)], [('G13', 4)], [('Ebmaj7#11', 4)], [('A7sus4', 2), ('A7b9', 2)]]
    H = In + A + Bb + Ae; tl = timeline(0, prog_of(H))
    mel(vb, 0, "A5:2 F5:2 E5:2 C5:2 D5:8 | r:4 D6:2 Bb5:2 A5:4 C#6:4 |", bar=BAR, v=64)
    ta = ("r:2 A4:2 C5:2 D5:4 E5:2 F5:4 | E5:8 D5:2 C5:2 A4:4 | D5:4 F5:4 A5:6 G5:2 | F5:6 E5:2 C#5:8 |"
          " r:2 A4:2 C5:2 D5:4 E5:2 F5:2 G5:2 | A5:6 G5:2 E5:4 C5:4 | D5:6 Bb4:2 A4:4 G4:4 | D5:4 E5:4 C#5:4 Bb4:4 |")
    tb = ("Bb5:6 A5:2 F5:4 D5:4 | E5:6 A5:2 G5:8 | A5:4 G5:2 A5:2 C6:4 A5:4 | D6:8 C6:4 A5:4 |"
          " G5:6 Bb5:2 D6:8 | C#6:4 Bb5:4 G5:4 E5:4 | F5:6 E5:2 D5:8 | G5:4 Bb5:4 C6:4 C#6:4 |")
    mel(sx, S.bar(2), ta, bar=BAR, v=86); mel(sx, S.bar(10), tb, bar=BAR, v=90)
    mel(sx, S.bar(18), "r:2 A4:2 C5:2 D5:4 E5:2 F5:4 | E5:8 D5:2 C5:2 A4:4 | D5:6 Bb4:2 A4:4 G4:4 | D5:4 E5:4 C#5:4 Bb4:4 |", bar=BAR, v=82)
    comp(ep, 0, tl, 'x--.....x-.x----', 22, 62, False, 58)
    bassline(bs, S.bar(2), tl, 'R---..5.R-..A...', 20, v=90)
    pad(st, timeline(S.bar(10), prog_of(Bb)), 60, True, 38, 4)
    for b in range(10, 18, 2): mel(gt, S.bar(b, 3), "A4:1 C5:1 D5:1 F5:1 |", bar=TPQ, v=58)
    beat(dr, S.bar(2), 20, {'k': 'm......m..m.....', 'x': '....x.......x...'}, vel=.8)
    beat(dr, S.bar(2), 20, {'h': 'xmxmxmxm', 'p': '..x...x.'}, steps=8, swing=.3, vel=.55)
    beat(dr, 0, 2, {'h': 'x.m.x.m.'}, steps=8, swing=.3, vel=.45)
    return S


SKIP = {'high_circus': 4, 'duel_moonlit': 4, 'duel_fog': 4}   # fight music: no slow intro, it starts where the band is in

def main(names):
    os.makedirs(OUT, exist_ok=True)
    for nm in names or SONGS:
        S = SONGS[nm](); path = os.path.join(OUT, nm + '.mid'); cnt = S.write(path, SKIP.get(nm, 0))
        print('%-15s %3d bars  %5d notes  %6.1f KB' % (nm, len(S.starts) - 1, cnt, os.path.getsize(path) / 1024))

if __name__ == '__main__':
    main(sys.argv[1:])
