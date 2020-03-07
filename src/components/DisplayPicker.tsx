import React from 'react';

import { MarkerLabel } from './types';
import { Dropdown } from './Dropdown';
import { useScale } from '../hooks';

export const DisplayPicker: React.FC<{value: MarkerLabel, onChange: (display: MarkerLabel) => void}> = ({value, onChange}) => {
  const [ scale ] = useScale();

  const handleChange = (newMode: string) => {
    onChange(newMode as MarkerLabel);
  }
  return (
    <div className="DisplayPicker">
      label with
      <Dropdown value={value} options={[
        { value: 'degree', label: scale ? 'scale degree' : 'chord tone'},
        { value: 'note', label: 'note name' }
      ]} onChange={handleChange} />
    </div>
  )
}
