import React, { useState, useEffect } from 'react'

import { Dropdown } from './Dropdown'

import { Tuning, Tunings } from '../tuning'

export const TuningPicker: React.FC<{
  value: Tuning
  onChange: (newTuning: Tuning) => void
}> = ({ value, onChange }) => {
  const [instrument, setInstrument] = useState(value.instrument)
  const [tuningName, setTuning] = useState(value.name)
  useEffect(() => {
    const instrumentTuning = Tunings.find(
      (t) => t.instrument === instrument && t.name === tuningName
    )
    if (instrumentTuning) {
      onChange(instrumentTuning)
    }
  }, [instrument, tuningName, onChange])
  const handleInstrumentChange = (newInstrument: string): void => {
    const newTuning = Tunings.find((t) => t.instrument === instrument)
    if (newTuning) {
      setInstrument(newInstrument)
      setTuning(newTuning.name)
    }
  }
  const instrumentOptions = Array.from(
    new Set(Tunings.map((t) => t.instrument))
  )
  const tuningOptions = Tunings.filter((t) => t.instrument === instrument).map(
    (t) => t.name
  )

  return (
    <>
      <Dropdown
        label='instrument'
        value={instrument}
        options={instrumentOptions}
        onChange={handleInstrumentChange}
      />
      {tuningOptions.length > 1 && (
        <Dropdown
          label='tuning'
          value={tuningName}
          options={tuningOptions}
          onChange={setTuning}
        />
      )}
    </>
  )
}
