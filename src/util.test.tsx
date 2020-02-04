import { getNotesOnString } from './util';
import { note, pc, NoteLetter, scale, ScaleKinds } from './theory';

test('notesOnString', () => {
  const str = note(pc(NoteLetter.G), 4);
  const from = scale(pc(NoteLetter.G), ScaleKinds.major);
  const notes = getNotesOnString(str, 12, from);
})