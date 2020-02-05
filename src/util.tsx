import { Note, Scale, Chord, nextAtOrBelow, value, P, add } from './theory';

export const translate = (x: number, y: number):string => `translate(${x},${y})`;

export const scaleLength = (fretCount:number, fretboardLen: number):number => {
  const lastFretPos = fretboardLen;
  const lastFretNum = fretCount;

  return lastFretPos / (1 - Math.pow(2, -lastFretNum/12));
}

export const fretPositions = (fretCount: number, scaleLength: number): number[] => {
  return Array(fretCount).fill(undefined).map((_val, i) => {
    const fretNum = i + 1;
    return scaleLength * (1 - Math.pow(2, -fretNum / 12))
  })
}

export const stringPositions = (stringCount: number, fretboardWidth: number): number[] => {
  const stringInset = 8;
  const stringPositions = Array(stringCount).fill(undefined).map((s, i) => {
    return stringInset + i * ((fretboardWidth - (2 * stringInset)) / (stringCount - 1))
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
  let currDegree = 0;
  let currRoot = start;
  let curr = start;
  let currValue = value(curr);
  while (currValue <= maxValue) {
    const currFret = currValue - startValue;
    if (currFret >= 0) {
      result.push({
        note: curr,
        fret: currFret,
        degree: currDegree + 1,
      })
    }

    currDegree += 1;
    if (currDegree === from.intervals.length) {
      currDegree = 0;
      currRoot = add(currRoot, P(8));
    }
    curr = add(currRoot, from.intervals[currDegree]);
    currValue = value(curr);
  }
  return result;
}