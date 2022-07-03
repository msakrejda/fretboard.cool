import React from 'react'

import './App.css'

export const FretCountPicker: React.FC<{
  value: number
  onChange: (count: number) => void
}> = ({ value, onChange }) => {
  const handleFretCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.currentTarget.value, 10)
    const newValue = isNaN(parsed) ? 12 : parsed
    const constrained = Math.min(Math.max(newValue, 3), 15)
    onChange(constrained)
  }
  return (
    <div className='FretCountPicker'>
      <label className='FormLabel'>
        frets
        <input
          type='number'
          min={3}
          max={15}
          value={value}
          onChange={handleFretCountChange}
        />
      </label>
    </div>
  )
}
