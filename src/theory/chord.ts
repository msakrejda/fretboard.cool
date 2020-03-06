import pc, { PitchClass } from './pitchClass';
import { Interval, P, M, m } from './interval';

export interface Chord {
  readonly name: string;
  readonly root: PitchClass;
  readonly intervals: readonly Interval[];
}

export const ChordKinds = {
  major: [ P(1), M(3), P(5) ],
  minor: [ P(1), m(3), P(5) ],
  'dominant 7': [ P(1), M(3), P(5), m(7) ],
} as const;

export type ChordKind = keyof typeof ChordKinds;

export const chord = (name: string, root: PitchClass, intervals: readonly Interval[]): Chord => {
  return {
    name,
    root,
    intervals
  }
}

const urlEncode = (s: Chord): [ string, string ] => {
  return [ encodeURIComponent(pc.format(s.root, true).toLowerCase()), s.name ]
}

const urlDecode = (pcStr: string, nameStr: string): Chord => {
  const root = pc.parse(decodeURIComponent(pcStr));
  const name = decodeURIComponent(nameStr);
  const intervals = ChordKinds[name as keyof typeof ChordKinds];
  return chord(name, root, intervals);
}

export default {
  urlEncode,
  urlDecode,
}
