import { PitchClass } from './pitchClass';
import { Interval, P, M, m } from './interval';

export interface Chord {
  readonly pitchClass: PitchClass,
  readonly intervals: readonly Interval[]
}

export const ChordKinds = {
  major: [ P(1), M(3), P(5) ],
  minor: [ P(1), m(3), P(5) ],
  'dominant 7': [ P(1), m(3), P(5), m(7) ],
} as const;
