import React from 'react';

import pc, { PitchClass } from '../theory/pitchClass'
import accidental, { Accidental, Accidentals } from '../theory/accidental'
import { NoteLetter, NoteLetters } from '../theory/letter'
import { Dropdown } from './Dropdown';

export const PitchClassPicker: React.FC<{value: PitchClass, onChange: (pitchClass: PitchClass) => void}> = ({value, onChange}) => {
  const handleLetterChange = (letter: string) => {
    const newLetter = letter as NoteLetter;
    const newAccidental = value.accidental;

    onChange(pc.pc(newLetter, newAccidental));
  }

  const handleAccidentalChange = (accidental: string) => {
    const newAccidental = parseInt(accidental, 10) as Accidental;
    onChange(pc.pc(value.letter, newAccidental));
  }
  
  return (
    <div>
      <Dropdown value={value.letter} options={
        NoteLetters.map(n => ({ value: n, label: NoteLetter[n]}))
      } onChange={handleLetterChange} />
      <Dropdown value={value.letter} options={
        Accidentals.map(a => ({ value: String(a), label: accidental.format(a) }))
      } onChange={handleAccidentalChange} />
    </div>
  )
}
