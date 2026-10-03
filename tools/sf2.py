"""Minimal SoundFont 2 reader: presets -> flat regions (preset and instrument zones merged), samples as 16-bit PCM."""
import struct

GEN = {0: 'startAddrsOffset', 1: 'endAddrsOffset', 2: 'startloopAddrsOffset', 3: 'endloopAddrsOffset', 4: 'startAddrsCoarse', 5: 'modLfoToPitch', 6: 'vibLfoToPitch',
       7: 'modEnvToPitch', 8: 'initialFilterFc', 9: 'initialFilterQ', 10: 'modLfoToFilterFc', 11: 'modEnvToFilterFc', 12: 'endAddrsCoarse', 13: 'modLfoToVolume',
       15: 'chorusEffectsSend', 16: 'reverbEffectsSend', 17: 'pan', 21: 'delayModLFO', 22: 'freqModLFO', 23: 'delayVibLFO', 24: 'freqVibLFO', 25: 'delayModEnv',
       26: 'attackModEnv', 27: 'holdModEnv', 28: 'decayModEnv', 29: 'sustainModEnv', 30: 'releaseModEnv', 31: 'keynumToModEnvHold', 32: 'keynumToModEnvDecay',
       33: 'delayVolEnv', 34: 'attackVolEnv', 35: 'holdVolEnv', 36: 'decayVolEnv', 37: 'sustainVolEnv', 38: 'releaseVolEnv', 39: 'keynumToVolEnvHold',
       40: 'keynumToVolEnvDecay', 41: 'instrument', 43: 'keyRange', 44: 'velRange', 45: 'startloopAddrsCoarse', 46: 'keynum', 47: 'velocity', 48: 'initialAttenuation',
       50: 'endloopAddrsCoarse', 51: 'coarseTune', 52: 'fineTune', 53: 'sampleID', 54: 'sampleModes', 56: 'scaleTuning', 57: 'exclusiveClass', 58: 'overridingRootKey'}
DEFAULT = {'initialFilterFc': 13500, 'initialFilterQ': 0, 'delayVolEnv': -12000, 'attackVolEnv': -12000, 'holdVolEnv': -12000, 'decayVolEnv': -12000,
           'sustainVolEnv': 0, 'releaseVolEnv': -12000, 'scaleTuning': 100, 'overridingRootKey': -1, 'keyRange': (0, 127), 'velRange': (0, 127),
           'pan': 0, 'initialAttenuation': 0, 'coarseTune': 0, 'fineTune': 0, 'sampleModes': 0, 'reverbEffectsSend': 0, 'exclusiveClass': 0, 'keynumToVolEnvHold': 0, 'keynumToVolEnvDecay': 0,
           'vibLfoToPitch': 0, 'freqVibLFO': 0, 'delayVibLFO': -12000, 'modEnvToPitch': 0, 'modEnvToFilterFc': 0, 'modLfoToPitch': 0, 'modLfoToFilterFc': 0, 'modLfoToVolume': 0}


def chunks(b, o, end):
    while o + 8 <= end:
        cid = b[o:o + 4]; sz = struct.unpack_from('<I', b, o + 4)[0]
        yield cid, o + 8, sz
        o += 8 + sz + (sz & 1)


class SF2:
    def __init__(s, path):
        b = open(path, 'rb').read(); s.b = b
        assert b[:4] == b'RIFF' and b[8:12] == b'sfbk'
        hd = {}
        for cid, o, sz in chunks(b, 12, len(b)):
            if cid == b'LIST':
                kind = b[o:o + 4]
                for c2, o2, s2 in chunks(b, o + 4, o + sz):
                    hd[(kind, c2)] = (o2, s2)
        so, ss = hd[(b'sdta', b'smpl')]; s.smpl = memoryview(b)[so:so + ss].cast('h')
        def rec(name, fmt):
            o, sz = hd[(b'pdta', name)]; n = struct.calcsize(fmt)
            return [struct.unpack_from(fmt, b, o + i * n) for i in range(sz // n)]
        s.phdr = rec(b'phdr', '<20sHHHIII'); s.pbag = rec(b'pbag', '<HH'); s.pgen = rec(b'pgen', '<Hh')
        s.inst = rec(b'inst', '<20sH'); s.ibag = rec(b'ibag', '<HH'); s.igen = rec(b'igen', '<Hh')
        s.shdr = rec(b'shdr', '<20sIIIIIBbHH')

    @staticmethod
    def name(x): return x.split(b'\0')[0].decode('latin-1')

    def zones(s, bags, gens, a, z):
        out = []
        for i in range(a, z):
            g0, g1 = bags[i][0], bags[i + 1][0]; d = {}
            for op, amt in gens[g0:g1]:
                nm = GEN.get(op)
                if nm in ('keyRange', 'velRange'): d[nm] = (amt & 255, (amt >> 8) & 255)
                elif nm: d[nm] = amt
            out.append(d)
        return out

    def presets(s):
        return [(s.name(p[0]), p[2], p[1]) for p in s.phdr[:-1]]   # name, bank, program

    def find(s, bank, prog):
        for i, p in enumerate(s.phdr[:-1]):
            if p[2] == bank and p[1] == prog: return i
        return None

    def regions(s, pi):
        """flat regions of preset index pi: dicts with generator values already merged (instrument + preset), plus 'sample' (shdr index)."""
        p0, p1 = s.phdr[pi], s.phdr[pi + 1]
        pz = s.zones(s.pbag, s.pgen, p0[3], p1[3]); out = []
        pglob = pz[0] if pz and 'instrument' not in pz[0] else {}
        for z in pz:
            if 'instrument' not in z: continue
            ii = z['instrument']; i0, i1 = s.inst[ii], s.inst[ii + 1]
            iz = s.zones(s.ibag, s.igen, i0[1], i1[1]); iglob = iz[0] if iz and 'sampleID' not in iz[0] else {}
            for q in iz:
                if 'sampleID' not in q: continue
                r = dict(DEFAULT)
                r.update(iglob); r.update(q)
                for src in (pglob, z):   # preset level generators add up (ranges intersect)
                    for k, v in src.items():
                        if k in ('instrument', 'sampleID'): continue
                        if k in ('keyRange', 'velRange'):
                            lo, hi = r[k]; r[k] = (max(lo, v[0]), min(hi, v[1]))
                        elif k in ('sampleModes', 'overridingRootKey', 'exclusiveClass'): pass
                        else: r[k] = r.get(k, DEFAULT.get(k, 0)) + v
                if r['keyRange'][0] > r['keyRange'][1] or r['velRange'][0] > r['velRange'][1]: continue
                out.append(r)
        return out

    def sample(s, i):
        h = s.shdr[i]; return dict(name=s.name(h[0]), start=h[1], end=h[2], ls=h[3], le=h[4], rate=h[5], key=h[6], tune=h[7], link=h[8], type=h[9])
