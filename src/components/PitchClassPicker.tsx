import React from 'react';

import pc, { PitchClass } from '../theory/pitchClass'
import accidental, { Accidental, Accidentals } from '../theory/accidental'
import { NoteLetter, NoteLetters } from '../theory/letter'

export const PitchClassPicker: React.FC<{value: PitchClass, onChange: (pitchClass: PitchClass) => void}> = ({value, onChange}) => {
  const handleLetterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLetter = e.currentTarget.value as NoteLetter;
    const newAccidental = value.accidental;

    onChange(pc.pc(newLetter, newAccidental));
  }

  const handleAccidentalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccidental = parseInt(e.currentTarget.value, 10) as Accidental;
    onChange(pc.pc(value.letter, newAccidental));
  }
  
  return (
    <div>
      <select value={value.letter} onChange={handleLetterChange}>
        {NoteLetters.map(n => <option key={n} value={n}>{NoteLetter[n]}</option>)}
      </select>
      <select value={value.accidental} onChange={handleAccidentalChange}>
        {Accidentals.map(a => <option key={a} value={a}>{accidental.format(a)}</option>)}
      </select>
    </div>
  )
}
