import { note, parseNote, pc, NoteLetters, value, Accidental, NoteLetter, add, M } from './theory';

test('value', () => {
  const letters = NoteLetters;
  const octaves = [ 1, 2, 3 ];
  let prevFlatVal: number, prevNaturalVal: number, prevSharpVal: number;
  octaves.forEach(o => {
    letters.forEach(l => {
      const flatVal = value(note(pc(l, Accidental.Flat), o))
      const naturalVal = value(note(pc(l, Accidental.Natural), o))
      const sharpVal = value(note(pc(l, Accidental.Sharp), o))

      expect(flatVal).toBeLessThan(naturalVal);
      expect(flatVal).toBeLessThan(sharpVal);
      expect(naturalVal).toBeLessThan(sharpVal);

      if (prevFlatVal !== undefined) {
        if (l === NoteLetter.C || l === NoteLetter.F) {
          expect(flatVal).toEqual(prevNaturalVal);
          expect(naturalVal).toEqual(prevSharpVal);
        } else {
          expect(flatVal).toEqual(prevSharpVal);
        }
      }

      prevFlatVal = flatVal;
      prevNaturalVal = naturalVal;
      prevSharpVal = sharpVal;
    })
  })
})

test('parseNote', () => {
  const n = parseNote('c1');
  expect(n.octave).toEqual(1);
  expect(n.pitchClass.letter).toEqual(NoteLetter.C);
  expect(n.pitchClass.accidental).toEqual(Accidental.Natural);
})

test('add', () => {
  const n = parseNote('c1');
  const result = add(n, M(7));
  expect(result.pitchClass.letter).toEqual(NoteLetter.B);
  expect(result.pitchClass.accidental).toEqual(Accidental.Natural);
  expect(result.octave).toEqual(n.octave);
})

test('add in G', () => {
  const n = parseNote('g1');
  const result = add(n, M(7));
  expect(result.pitchClass.letter).toEqual(NoteLetter.F);
  expect(result.pitchClass.accidental).toEqual(Accidental.Sharp);
  expect(result.octave).toEqual(n.octave + 1);
})