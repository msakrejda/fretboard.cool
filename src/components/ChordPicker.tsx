import React from 'react';

import { ChordKind, ChordKinds, chord } from '../theory/chord';

import { PitchClassPicker } from './PitchClassPicker';
import { PitchClass } from '../theory/pitchClass';
import { useChord } from '../hooks';

import './ChordPicker.css';

export const ChordPicker: React.FC = () => {
  const [ current, setCurrent ] = useChord();

  const options = Object.keys(ChordKinds).map(chord => {
    return <option key={chord} value={chord}>{chord}</option>
  })

  const handleKindChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKind = e.currentTarget.value as ChordKind;
    const intervals = ChordKinds[newKind];
    setCurrent(chord(newKind, current.root, intervals));
  }

  const handleRootChange = (newRoot: PitchClass):void => {
    setCurrent(chord(current.name, newRoot, current.intervals))
  }

  return (
    <div className="ChordPicker">
      root:
      <PitchClassPicker value={current.root} onChange={handleRootChange} />
      <select value={current.name} onChange={handleKindChange}>
        {options}
      </select>
    </div>
  )
}
