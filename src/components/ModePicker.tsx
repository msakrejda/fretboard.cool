import React from 'react'

import { Dropdown } from './Dropdown'
import { useScale, useChord } from '../hooks'
import config from '../config'

export const ModePicker: React.FC = () => {
  const [scale, setScale, previousScale] = useScale()
  const [, setChord, previousChord] = useChord()
  const handleChange = (newMode: string) => {
    if (newMode === 'scale') {
      setScale(previousScale || config.defaultScale)
    } else {
      setChord(previousChord || config.defaultChord)
    }
  }
  return (
    <Dropdown
      label='show'
      value={scale ? 'scale' : 'chord tones'}
      options={['scale', 'chord tones']}
      onChange={handleChange}
    />
  )
}
