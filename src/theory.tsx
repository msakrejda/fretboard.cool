export enum NoteLetter {
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  A = 'A',
  B = 'B'
}

export const NoteLetters = [
  NoteLetter.C,
  NoteLetter.D,
  NoteLetter.E,
  NoteLetter.F,
  NoteLetter.G,
  NoteLetter.A,
  NoteLetter.B
]

export enum Accidental {
  DoubleFlat = -2,
  Flat = -1,
  Natural = 0,
  Sharp = 1,
  DoubleSharp = 2
}

export const Accidentals = [
  Accidental.Flat,
  Accidental.Natural,
  Accidental.Sharp,
]

export const formatAccidental = (value: Accidental):string => {
  return {
    [Accidental.DoubleFlat]: '𝄫',
    [Accidental.Flat]: '♭',
    [Accidental.Natural]: '♮',
    [Accidental.Sharp]: '♯',
    [Accidental.DoubleSharp]: '𝄪',
  }[value];
}

export const adjust = (accidental: Accidental, semitones: number): Accidental | undefined => {
  const newAccidental = accidental + semitones;
  return newAccidental in Accidental ? newAccidental : undefined;
}

export interface PitchClass {
  letter: NoteLetter;
  accidental: Accidental;
}

export const pc = (letter: NoteLetter, accidental: Accidental = Accidental.Natural) => {
  return {
    letter,
    accidental
  }
}

export const pcEqual = (pc1: PitchClass, pc2: PitchClass): boolean => {
  return pc1.letter === pc2.letter && pc1.accidental === pc2.accidental;
}

export interface Note {
  pitchClass: PitchClass;
  octave: number;
}

export const note = (pitchClass: PitchClass, octave: number):Note => {
  return {
    pitchClass,
    octave
  }
}
export const noteEqual = (n1: Note, n2: Note):boolean => {
  return pcEqual(n1.pitchClass, n2.pitchClass) && n1.octave === n2.octave;
}

export const value = (note: Note): number => {
  const val = {
    [NoteLetter.C]: 1,
    [NoteLetter.D]: 3,
    [NoteLetter.E]: 5,
    [NoteLetter.F]: 6,
    [NoteLetter.G]: 8,
    [NoteLetter.A]: 10,
    [NoteLetter.B]: 12
  }
  return val[note.pitchClass.letter] + note.pitchClass.accidental + (12 * note.octave);
}

export enum Quality {
  Major,
  Minor,
  Augmented,
  Diminished,
  Perfect
}

type MajorMinorQuality = Quality.Major | Quality.Minor | Quality.Augmented | Quality.Diminished;
type PerfectQuality = Quality.Perfect | Quality.Augmented | Quality.Diminished;

export const isMajorMinorQuality = (value: Quality): value is MajorMinorQuality => {
  return [Quality.Major, Quality.Minor, Quality.Augmented, Quality.Diminished].includes(value)
}

export const isPerfectQuality = (value: Quality): value is PerfectQuality => {
  return [Quality.Perfect, Quality.Augmented, Quality.Diminished].includes(value)
}

type MajorMinorIntervalNumber = 2 | 3 | 6 | 7;
type PerfectIntervalNumber = 1 | 4 | 5 | 8;
type IntervalNumber = MajorMinorIntervalNumber | PerfectIntervalNumber;

function isIntervalNumber (value: number): value is IntervalNumber {
  return value >= 1 && value <= 8;
}

function isPerfect (value: IntervalNumber): value is PerfectIntervalNumber {
  return [ 1, 4, 5, 8 ].includes(value);
}

function isMajorMinor (value: IntervalNumber): value is MajorMinorIntervalNumber {
  return [ 2, 3, 6, 7 ].includes(value);
}

type PerfectInterval = {
  quality: Quality.Perfect | Quality.Augmented | Quality.Diminished,
  number: PerfectIntervalNumber
}

type MajorMinorInterval = {
  quality: Quality.Major | Quality.Minor | Quality.Augmented | Quality.Diminished,
  number: MajorMinorIntervalNumber
}

export type Interval =  PerfectInterval | MajorMinorInterval;

export const semitones = (interval: Interval): number => {
  const intervalDefaultSemitones = {
    1: 0,
    2: 2,
    3: 4,
    4: 5,
    5: 7,
    6: 9,
    7: 11,
    8: 12
  }
  const offsets = {
    [Quality.Major]: 0,
    [Quality.Minor]: -1,
    [Quality.Perfect]: 0,
    [Quality.Augmented]: 1,
    [Quality.Diminished]: isMajorMinor(interval.number) ? -1 : -2,
  };

  return intervalDefaultSemitones[interval.number] + offsets[interval.quality];
}

export const P = (number: PerfectIntervalNumber): PerfectInterval => {
  return {
    quality: Quality.Perfect,
    number,
  }
}

export const A = (number: IntervalNumber): Interval => {
  return {
    quality: Quality.Augmented,
    number
  }
}

export const d = (number: IntervalNumber): Interval => {
  return {
    quality: Quality.Diminished,
    number
  }
}

export const M = (number: MajorMinorIntervalNumber): MajorMinorInterval => {
  return {
    quality: Quality.Major,
    number
  }
}

export const m = (number: MajorMinorIntervalNumber): MajorMinorInterval => {
  return {
    quality: Quality.Minor,
    number
  }
}

export interface Scale {
  readonly pitchClass: PitchClass,
  readonly intervals: readonly Interval[]
}

export const ScaleKinds = {
  'major': [ P(1), M(2), M(3), P(4), P(5), M(6), M(7) ],
  'minor': [ P(1), M(2), m(3), P(4), P(5), m(6), m(7) ],
  'major pentatonic': [ P(1), M(2), M(3), P(5), M(6) ],
  'minor pentatonic': [ P(1), m(3), P(4), P(5), m(7) ],
} as const;

export type ScaleKind = keyof typeof ScaleKinds;

export const scale = (pitchClass: PitchClass, intervals: readonly Interval[]): Scale => {
  return {
    pitchClass,
    intervals
  }
}

export interface Chord {
  readonly pitchClass: PitchClass,
  readonly intervals: readonly Interval[]
}

export const ChordKinds = {
  major: [ P(1), M(3), P(5) ],
  minor: [ P(1), m(3), P(5) ],
  'dominant 7': [ P(1), m(3), P(5), m(7) ],
} as const;

export const add = (n: Note, interval: Interval):Note => {
  const noteLetters = [ NoteLetter.C, NoteLetter.D, NoteLetter.E, NoteLetter.F, NoteLetter.G, NoteLetter.A, NoteLetter.B ];
  const noteIdx = noteLetters.indexOf(n.pitchClass.letter);
  const newIdx = noteIdx + (interval.number - 1);
  let newOctave = n.octave;
  let normalizedIdx = newIdx;
  while (normalizedIdx >= noteLetters.length) {
    newOctave += 1;
    normalizedIdx -= noteLetters.length;
  }

  const newNoteLetter = noteLetters[normalizedIdx];
  // corresponding to array above
  const letterSemitones = [ 0, 2, 4, 5, 7, 9, 11 ];
  const semitonesTraversed = (letterSemitones[normalizedIdx] - letterSemitones[noteIdx]) + (newOctave - n.octave) * 12 - n.pitchClass.accidental;
  const semitonesDesired = semitones(interval);
  const offset = semitonesDesired - semitonesTraversed;
  const newAccidental = offset in Accidental ? offset : undefined;

  return note(pc(newNoteLetter, newAccidental), newOctave);
}

export const nextAtOrBelow = (pitchClass: PitchClass, startNote: Note): Note | undefined => {
  const maybeNext = note(pitchClass, startNote.octave);
  if (value(maybeNext) <= value(startNote)) {
    return maybeNext;
  } else if (startNote.octave === 1) {
    return undefined;
  } else {
    return note(pitchClass, startNote.octave - 1);
  }
}

export const parseInterval = (str: string): Interval => {
  if (str.length !== 2) {
    throw new Error('unknown interval: ' + str);
  }

  const [ qualityStr, numberStr ] = str.split('');
  const number = parseInt(numberStr, 10);
  if (!isIntervalNumber(number)) {
    throw new Error('unknown interval number: ' + numberStr);
  }

  if (isMajorMinor(number)) {
    const qualities: { [shorthand: string]: MajorMinorQuality } = {
      d: Quality.Diminished,
      m: Quality.Minor,
      M: Quality.Major,
      A: Quality.Augmented,
    };
    const quality = qualities[qualityStr];
    if (quality === undefined) {
      throw new Error('unknown interval quality: ' + qualityStr);
    }
    return {
      quality: qualities[qualityStr],
      number
    }
  } else if (isPerfect(number)) {
    const qualities: { [shorthand: string]: PerfectQuality } = {
      d: Quality.Diminished,
      P: Quality.Perfect,
      A: Quality.Augmented,
    };
    const quality = qualities[qualityStr];
    if (quality === undefined) {
      throw new Error('unknown interval quality: ' + qualityStr);
    }
    return {
      quality: qualities[qualityStr],
      number
    }
  } else {
    throw new Error('unknown interval: ' + str);
  }
}

export const parsePitchClass = (pcName: string): PitchClass => {
  const [ letter, maybeAccidental, ...rest ] = pcName.split('');
  if (rest.length !== 0) {
    throw new Error('unknown pitch class: ' + pcName);
  }
  const upcaseLetter = letter.toUpperCase();
  if (!NoteLetters.includes(upcaseLetter as NoteLetter)) {
    throw new Error('unknown note letter: ' + letter);
  }
  const accidental = !maybeAccidental || maybeAccidental === '♮'
    ? Accidental.Natural
    : maybeAccidental === '#' || maybeAccidental === '♯'
    ? Accidental.Sharp
    : maybeAccidental === 'b' || maybeAccidental === '♭'
    ? Accidental.Flat
    : undefined;

  if (accidental === undefined) {
    throw new Error('unknown accidental: ' + maybeAccidental);
  }

  return pc(upcaseLetter as NoteLetter, accidental);
}

export const formatPitchClass = (pc: PitchClass): string => {
  const accidental = pc.accidental === Accidental.Natural ? '' : formatAccidental(pc.accidental);
  return `${pc.letter}${accidental}`
}

export const parseNote = (noteName: string): Note => {
  const maybeNoteParts = noteName.match(/(^\D+)(\d+)/);
  if (!maybeNoteParts) {
    throw new Error('unknown note: ' + maybeNoteParts);
  }
  const [ , maybePc, octaveStr ] = maybeNoteParts;
  const pitchClass = parsePitchClass(maybePc);
  const octave = parseInt(octaveStr, 10);

  return note(pitchClass, octave);
}

export const Tuning = {
  mandolin: {
    standard: ['g3','d4','a4','e5']
  },
  guitar: {
    standard: ['e2', 'a2', 'd3', 'g3', 'b3', 'e4'],
    'drop d': ['d2', 'a2', 'd3', 'g3', 'b3', 'e4'],
    'open d': ['d2', 'a2', 'd3', 'f#3', 'a3', 'd4'],
    'open g': ['d2', 'g2', 'd3', 'g3', 'b3', 'd4'],
  },
  ukulele: {
    standard: ['g4', 'c4', 'e4', 'a4']
  }
}
