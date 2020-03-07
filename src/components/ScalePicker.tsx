import React from 'react';

import { scale, ScaleKind, ScaleKinds } from '../theory/scale';
import { PitchClass } from '../theory/pitchClass';
import { PitchClassPicker } from './PitchClassPicker';

import './ScalePicker.css';
import { useScale } from '../hooks';
import { Dropdown } from './Dropdown';

export const ScalePicker: React.FC = () => {
  const [ current, setCurrent ] = useScale();

  const handleKindChange = (kind: string) => {
    const newKind = kind as ScaleKind;
    const intervals = ScaleKinds[newKind];
    setCurrent(scale(newKind, current.root, intervals));
  }

  const handleRootChange = (newRoot: PitchClass):void => {
    setCurrent(scale(current.name, newRoot, current.intervals))
  }

  return (
    <div className='ScalePicker'>
      key:
      <PitchClassPicker value={current.root} onChange={handleRootChange} />
      <Dropdown value={current.name} options={Object.keys(ScaleKinds)} onChange={handleKindChange} />
    </div>
  )
}
