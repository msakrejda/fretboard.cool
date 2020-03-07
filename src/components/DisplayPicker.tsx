import React from 'react';

import { MarkerLabel, MarkerMode } from './types';
import { Dropdown } from './Dropdown';

export const DisplayPicker: React.FC<{value: MarkerLabel, onChange: (display: MarkerLabel) => void, mode: MarkerMode}> = ({value, onChange, mode}) => {
  const handleChange = (newMode: string) => {
    onChange(newMode as MarkerLabel);
  }
  return (
    <div className="DisplayPicker">
      label with
      <Dropdown value={value} options={[
        { value: 'degree', label: mode === 'scale' ? 'scale degree' : 'chord tone'},
        { value: 'note', label: 'note name' }
      ]} onChange={handleChange} />
    </div>
  )
}
