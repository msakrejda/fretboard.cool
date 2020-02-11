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

export const nextLetterSemitones = (letter: NoteLetter): number => {
  const letterSemitones = [ 0, 2, 4, 5, 7, 9, 11 ];
  return letterSemitones[NoteLetters.indexOf(letter)];
}