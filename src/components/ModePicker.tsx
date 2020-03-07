import React from 'react';

import { MarkerMode } from './types';
import { Dropdown } from './Dropdown';

export const ModePicker: React.FC<{value: MarkerMode, onChange: (mode: MarkerMode) => void}> = ({value, onChange}) => {
  const handleChange = (newMode: string) => {
    onChange(newMode as MarkerMode);
  }
  return (
    <div className='ModePicker'>
      show the 
      <Dropdown value={value} options={[ 'scale', 'chord tones' ]} onChange={handleChange} />
    </div>
  )
}
