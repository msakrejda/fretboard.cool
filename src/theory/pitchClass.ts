import accidental, { Accidental } from './accidental';
import { NoteLetter, NoteLetters } from './letter';

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

export const equal = (pc1: PitchClass, pc2: PitchClass): boolean => {
  return pc1.letter === pc2.letter && pc1.accidental === pc2.accidental;
}

export const parse = (pcName: string): PitchClass => {
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

export const format = (pc: PitchClass, ascii: boolean = false): string => {
  const acc = pc.accidental === Accidental.Natural ? '' : accidental.format(pc.accidental, ascii);
  return `${pc.letter}${acc}`
}

export default {
  pc,
  format,
  parse,
  equal
}
