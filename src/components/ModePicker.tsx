import React from 'react';

import { Dropdown } from './Dropdown';
import { useScale, useChord } from '../hooks';
import config from '../config';

export const ModePicker: React.FC = () => {
  const [ scale, setScale] = useScale();
  const [ , setChord] = useChord();
  const handleChange = (newMode: string) => {
    if (newMode === 'scale') {
      setScale(config.defaultScale);
    } else {
      setChord(config.defaultChord);
    }
  }
  return (
    <div className='ModePicker'>
      Show the 
      <Dropdown value={scale ? 'scale' : 'chord tones'} options={[ 'scale', 'chord tones' ]} onChange={handleChange} />
    </div>
  )
}
