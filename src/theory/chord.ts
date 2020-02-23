import { PitchClass } from './pitchClass';
import { Interval, P, M, m, PitchClassSequence } from './interval';

export type Chord = PitchClassSequence;

export const ChordKinds = {
  major: [ P(1), M(3), P(5) ],
  minor: [ P(1), m(3), P(5) ],
  'dominant 7': [ P(1), M(3), P(5), m(7) ],
} as const;

export type ChordKind = keyof typeof ChordKinds;

export const chord = (root: PitchClass, intervals: readonly Interval[]): Chord => {
  return {
    root,
    intervals
  }
}
