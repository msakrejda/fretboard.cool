import { Note, Scale, Chord, nextAtOrBelow, value, P, add } from './theory';

export const translate = (x: number, y: number):string => `translate(${x},${y})`;

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

type FretboardNote = {
  note: Note,
  fret: number,
  degree: number,
}

export const getNotesOnString = (stringRoot: Note, fretCount: number, from: Scale | Chord): FretboardNote[] => {
  const start = nextAtOrBelow(from.pitchClass, stringRoot);
  const result: FretboardNote[] = [];
  if (!start) {
    return result;
  }
  const startValue = value(stringRoot)
  const maxValue = startValue + fretCount;
  let currInterval = 0;
  let currRoot = start;
  let curr = start;
  let currValue = value(curr);
  while (currValue <= maxValue) {
    const currFret = currValue - startValue;
    if (currFret >= 0) {
      result.push({
        note: curr,
        fret: currFret,
        degree: from.intervals[currInterval].number,
      })
    }

    currInterval += 1;
    if (currInterval === from.intervals.length) {
      currInterval = 0;
      currRoot = add(currRoot, P(8));
    }
    curr = add(currRoot, from.intervals[currInterval]);
    currValue = value(curr);
  }
  return result;
}