import { PitchClass } from './pitchClass';
import { Interval, P, M, m } from './interval';

export interface Scale {
  readonly name: string;
  readonly root: PitchClass;
  readonly intervals: readonly Interval[];
}

export const ScaleKinds = {
  'major': [ P(1), M(2), M(3), P(4), P(5), M(6), M(7) ],
  'minor': [ P(1), M(2), m(3), P(4), P(5), m(6), m(7) ],
  'major pentatonic': [ P(1), M(2), M(3), P(5), M(6) ],
  'minor pentatonic': [ P(1), m(3), P(4), P(5), m(7) ],
} as const;

export type ScaleKind = keyof typeof ScaleKinds;

export const scale = (name: string, root: PitchClass, intervals: readonly Interval[]): Scale => {
  return {
    name,
    root,
    intervals
  }
}
