import { NoteLetters, nextLetterSemitones } from './letter';
import { pc } from './pitchClass';
import quality, { Quality } from './quality';
import { Accidental } from './accidental';
import note, { Note } from './note';

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

export const add = (n: Note, interval: Interval):Note => {
  const noteIdx = NoteLetters.indexOf(n.pitchClass.letter);
  const newIdx = noteIdx + (interval.number - 1);
  let newOctave = n.octave;
  let normalizedIdx = newIdx;
  while (normalizedIdx >= NoteLetters.length) {
    newOctave += 1;
    normalizedIdx -= NoteLetters.length;
  }

  const newNoteLetter = NoteLetters[normalizedIdx];

  const semitonesTraversed = (nextLetterSemitones(newNoteLetter) - nextLetterSemitones(n.pitchClass.letter)) + (newOctave - n.octave) * 12 - n.pitchClass.accidental;
  const semitonesDesired = semitones(interval);
  const offset = semitonesDesired - semitonesTraversed;
  const newAccidental = offset in Accidental ? offset : undefined;
  if (newAccidental === undefined) {
    throw new Error(`unknown accidental offset: could not add ${format(interval)} to ${note.format(n)}`)
  }

  return note.note(pc(newNoteLetter, newAccidental), newOctave);
}

export const format = (i: Interval): string => {
  return quality.format(i.quality) + String(i.number);
}

export const parse = (str: string): Interval => {
  if (str.length !== 2) {
    throw new Error('unknown interval: ' + str);
  }

  const [ qualityStr, numberStr ] = str.split('');
  const number = parseInt(numberStr, 10);
  if (!isIntervalNumber(number)) {
    throw new Error('unknown interval number: ' + numberStr);
  }

  const q = quality.parse(qualityStr);
  if (isMajorMinor(number) && quality.isMajorMinor(q)) {
    return { quality: q, number }
  } else if (isPerfect(number) && quality.isPerfect(q)) {
    return { quality: q, number }
  } else {
    throw new Error('unknown interval: ' + str);
  }
}

export default {
  parse,
  format,
}