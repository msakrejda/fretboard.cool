import note from './note';
import interval, { add } from './interval';

describe.each([
  [ 'c1', 'M7', 'b1' ],
  [ 'bb3', 'M2', 'c4' ],
])('add(%s, %s)', (noteStr, intervalStr, expectedStr) => {
  test('it adds correctly', () => {
    const n = note.parse(noteStr);
    const i = interval.parse(intervalStr);
    const expected = note.parse(expectedStr);
    const result = add(n, i);
    expect(note.equal(result, expected)).toEqual(true);
  })
})
