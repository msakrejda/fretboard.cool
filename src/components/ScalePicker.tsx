import React from 'react';

import { scale, ScaleKind, ScaleKinds } from '../theory/scale';
import { useScale } from './SyncContextWithRoute';
import { PitchClass } from '../theory/pitchClass';
import { PitchClassPicker } from './PitchClassPicker';

import './ScalePicker.css';

export const ScalePicker: React.FC = () => {
  const [ current, setCurrent ] = useScale();

  const options = Object.keys(ScaleKinds).map(scale => {
    return <option key={scale} value={scale}>{scale}</option>
  })

  const handleKindChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newKind = e.currentTarget.value as ScaleKind;
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
      <select value={current.name} onChange={handleKindChange}>
        {options}
      </select>
    </div>
  )
}


