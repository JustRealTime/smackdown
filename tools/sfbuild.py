#!/usr/bin/env python3
"""Builds music/gm.sf: the part of a General MIDI SoundFont (default GeneralUser GS) that the game's MIDI songs use, as 4-bit IMA ADPCM.

  python3 tools/sfbuild.py path/to/GeneralUser-GS.sf2

Only the instruments (programs) and drum notes that appear in music/*.mid are kept; samples are cut after the loop end and compressed 4:1.
Format (read by game.html, `SFK`): 'TBSF', u32 length of the JSON, JSON, then the ADPCM data of all samples.
  JSON {"s": [[byteOffset, sampleCount, rate, firstSample], ...],
        "p": {"bank:program": [[keyLo, keyHi, velLo, velHi, sample, rootKey, cents, loopMode, attenuationCb, pan, filterFcCents, filterQcb,
                                delay, attack, hold, decay, sustainCb, release (timecents), exclusiveClass, keyScale, keyToHold, keyToDecay, loopStart, loopEnd, startOffset], ...]}}
Licence of the default font: see THIRD_PARTY.md.
"""
import glob, json, os, struct, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sf2 import SF2

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
STEP = [7, 8, 9, 10, 11, 12, 13, 14, 16, 17, 19, 21, 23, 25, 28, 31, 34, 37, 41, 45, 50, 55, 60, 66, 73, 80, 88, 97, 107, 118, 130, 143, 157, 173, 190, 209, 230, 253, 279, 307, 337, 371, 408, 449, 494, 544, 598, 658, 724, 796, 876, 963, 1060, 1166, 1282, 1411, 1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024, 3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484, 7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899, 15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794, 32767]
IDX = [-1, -1, -1, -1, 2, 4, 6, 8]


def midi_use():
    """programs per channel and drum notes used by the songs (reads the MIDI files without any library)."""
    progs, drums = set(), set()
    for f in glob.glob(os.path.join(ROOT, 'music', '*.mid')):
        b = open(f, 'rb').read(); p = 14
        for _ in range(int.from_bytes(b[10:12], 'big')):
            ln = int.from_bytes(b[p + 4:p + 8], 'big'); q = p + 8; end = q + ln; run = 0
            def vlq():
                nonlocal q
                v = 0
                while True:
                    c = b[q]; q += 1; v = (v << 7) | (c & 127)
                    if not c & 128: return v
            ch_prog = {}
            while q < end:
                vlq(); st = b[q]
                if st < 128: st = run
                else: q += 1
                if st == 0xff: q += 1; l = vlq(); q += l
                elif st in (0xf0, 0xf7): l = vlq(); q += l
                else:
                    run = st; hi = st & 0xf0; ch = st & 15; a = b[q]; q += 1; v = 0
                    if hi not in (0xc0, 0xd0): v = b[q]; q += 1
                    if hi == 0xc0 and ch != 9: progs.add(a)
                    if hi == 0x90 and v > 0 and ch == 9: drums.add(a)
            p = end
    return sorted(progs), sorted(drums)


def encode(pcm, lo, hi):
    """IMA ADPCM of pcm[lo:hi]; returns (bytes, predictor, stepIndex). The first sample is the predictor."""
    pred = pcm[lo] if hi > lo else 0; idx = 0; out = bytearray(); hold = -1; p = pred
    for i in range(lo + 1, hi):
        x = pcm[i]
        d = x - p; code = 0
        if d < 0: code = 8; d = -d
        st = STEP[idx]; diff = st >> 3
        if d >= st: code |= 4; d -= st; diff += st
        st >>= 1
        if d >= st: code |= 2; d -= st; diff += st
        st >>= 1
        if d >= st: code |= 1; diff += st
        p = p - diff if code & 8 else p + diff
        if p > 32767: p = 32767
        elif p < -32768: p = -32768
        idx += IDX[code & 7]
        if idx < 0: idx = 0
        elif idx > 88: idx = 88
        if hold < 0: hold = code
        else: out.append(hold | (code << 4)); hold = -1
    if hold >= 0: out.append(hold)
    return bytes(out), pred


def main(sf2path):
    sf = SF2(sf2path); progs, drums = midi_use()
    print('programs', progs, 'drum notes', drums)
    want = [(0, p) for p in progs] + [(128, 0)]; presets = {}; used = {}
    for bank, prog in want:
        pi = sf.find(bank, prog)
        if pi is None: raise SystemExit('missing preset %d:%d' % (bank, prog))
        regs = []
        for r in sf.regions(pi):
            if bank == 128 and not any(r['keyRange'][0] <= d <= r['keyRange'][1] for d in drums): continue
            sid = r['sampleID']; h = sf.sample(sid)
            if h['type'] & 0x8000: raise SystemExit('ROM sample')
            used.setdefault(sid, len(used)); n = h['end'] - h['start']
            off = lambda c, f: f + c * 32768
            ls = h['ls'] - h['start'] + off(r.get('startloopAddrsCoarse', 0), r.get('startloopAddrsOffset', 0))
            le = h['le'] - h['start'] + off(r.get('endloopAddrsCoarse', 0), r.get('endloopAddrsOffset', 0))
            st0 = off(r.get('startAddrsCoarse', 0), r.get('startAddrsOffset', 0))
            root = r['overridingRootKey'] if r['overridingRootKey'] >= 0 else (h['key'] if h['key'] < 128 else 60)
            cents = r['coarseTune'] * 100 + r['fineTune'] + h['tune']
            mode = r['sampleModes'] & 3
            regs.append([r['keyRange'][0], r['keyRange'][1], r['velRange'][0], r['velRange'][1], used[sid], root, cents, mode, r['initialAttenuation'], r['pan'],
                         r['initialFilterFc'], r['initialFilterQ'], r['delayVolEnv'], r['attackVolEnv'], r['holdVolEnv'], r['decayVolEnv'], r['sustainVolEnv'],
                         r['releaseVolEnv'], r['exclusiveClass'], r['scaleTuning'], r['keynumToVolEnvHold'], r['keynumToVolEnvDecay'], ls, le, st0])
        presets['%d:%d' % (bank, prog)] = regs
    order = sorted(used, key=lambda k: used[k]); samples = []; blob = bytearray(); raw = 0
    for k, sid in enumerate(order):
        h = sf.sample(sid); lo, hi = h['start'], h['end']
        data, pred = encode(sf.smpl, lo, hi); samples.append([len(blob), hi - lo, h['rate'], pred]); blob += data; raw += (hi - lo) * 2
        if k % 25 == 0: print('encoded', k, '/', len(order), end='\r')
    js = json.dumps({'s': samples, 'p': presets}, separators=(',', ':')).encode()
    out = os.path.join(ROOT, 'music', 'gm.sf')
    with open(out, 'wb') as f: f.write(b'TBSF' + struct.pack('<I', len(js)) + js + bytes(blob))
    print('\n%d samples, %.1f MB PCM -> %.1f MB ADPCM, index %d KB, music/gm.sf %.1f MB' % (len(order), raw / 1e6, len(blob) / 1e6, len(js) // 1024, os.path.getsize(out) / 1e6))


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else os.path.expanduser('~/GeneralUser-GS.sf2'))
