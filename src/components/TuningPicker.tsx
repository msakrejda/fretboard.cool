import React from 'react';

import { Tuning, Tunings } from '../tuning';

export const TuningPicker: React.FC<{value: Tuning, onChange: (newTuning: Tuning) => void}> = ({value, onChange}) => {
  const options = Tunings.map(tuning => {
    const value = [ tuning.instrument, tuning.name ].join(',');
    return (
      tuning.name === 'standard'
      ? <option key={value} value={value}>
          {tuning.instrument}
        </option>
      : <option key={value} value={value}>
          &nbsp;&nbsp;{tuning.name}
        </option>
    )
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [ instrument, name ] = e.currentTarget.value.split(',')
    const newTuning = Tunings.find(t => t.instrument === instrument && t.name === name);
    if (newTuning) {
      onChange(newTuning);
    }
  }

  const val = [ value.instrument, value.name ].join(',');
  return (
    <div>
      tuning:
      <select value={val} onChange={handleChange}>
        {options}
      </select>
    </div>
  )
}
