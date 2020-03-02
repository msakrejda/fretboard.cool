import note, { Note } from "./theory/note";

export const scaleLength = (fretCount:number, fretboardLen: number):number => {
  const lastFretPos = fretboardLen;
  const lastFretNum = fretCount;

  return lastFretPos / (1 - Math.pow(2, -lastFretNum/12));
}

export const fretPositions = (fretCount: number, scaleLength: number, fretWidth: number): number[] => {
  return Array(fretCount).fill(undefined).map((_val, i) => {
    const fretNum = i + 1;
    return scaleLength * (1 - Math.pow(2, -fretNum / 12)) - fretWidth;
  })
}

export const stringPositions = (stringCount: number, fretboardWidth: number, stringWidth: number): number[] => {
  const stringInset = 8;
  const stringPositions = Array(stringCount).fill(undefined).map((s, i) => {
    return stringInset + i * ((fretboardWidth - (2 * stringInset)) / (stringCount - 1)) - stringWidth / 2;
  })
  return stringPositions;
}

export interface Tuning {
  instrument: string;
  name: string;
  notes: Note[];
}

export const tuning = (instrument: string, name: string, notes: string[]) => {
  return {
    instrument,
    name,
    notes: notes.map(n => note.parse(n))
  }
}

// instruments clustered together; standard tuning always first if exists
export const Tunings = [
  tuning('mandolin', 'standard', ['g3','d4','a4','e5']),
  tuning('guitar', 'standard', ['e2', 'a2', 'd3', 'g3', 'b3', 'e4']),
  tuning('guitar', 'drop d', ['d2', 'a2', 'd3', 'g3', 'b3', 'e4']),
  tuning('guitar', 'open d', ['d2', 'a2', 'd3', 'f#3', 'a3', 'd4']),
  tuning('guitar', 'open g', ['d2', 'g2', 'd3', 'g3', 'b3', 'd4']),
  tuning('ukulele', 'standard', ['g4', 'c4', 'e4', 'a4'])
] as const;
