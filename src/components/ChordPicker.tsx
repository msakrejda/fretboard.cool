import React from 'react';

import { ChordKind, ChordKinds, chord } from '../theory/chord';

import { useChord } from '../hooks';

import { PitchClassPicker } from './PitchClassPicker';
import { PitchClass } from '../theory/pitchClass';

import { Dropdown } from './Dropdown';

import './App.css';

export const ChordPicker: React.FC = () => {
  const [ current, setCurrent ] = useChord();

  const handleKindChange = (name: string) => {
    const newKind = name as ChordKind;
    const intervals = ChordKinds[newKind];
    setCurrent(chord(newKind, current.root, intervals));
  }

  const handleRootChange = (newRoot: PitchClass):void => {
    if (current.intervals) {
      setCurrent(chord(current.name, newRoot, current.intervals))
    }
  }

  return (
    <div>
      <span className="FormLabel">chord</span>
      <div className="ScaleChordPicker">
        <PitchClassPicker value={current.root} onChange={handleRootChange} />
        <Dropdown value={current.name} options={Object.keys(ChordKinds)} onChange={handleKindChange} />
      </div>
    </div>
  )
}
