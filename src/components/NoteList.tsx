import React from 'react'

import pc, { PitchClass } from '../theory/pitchClass'
import interval, { add, PitchClassSequence } from '../theory/interval'
import note from '../theory/note'

import { Translate } from '../svg/Translate'

export const NoteList: React.FC<{
  notes: PitchClassSequence
  onClick: (pc: PitchClass) => void
}> = ({ notes, onClick }) => {
  const markerRadius = 12
  const strokeWidth = 1
  const width = markerRadius * 2 + 2 * strokeWidth
  const height = markerRadius * 2 + 2 * strokeWidth
  // The octave is not important here, but we need notes instead of pitch classes
  // since the add function does not support adding an interval to a pitch class (TODO: fix this)
  const rootNote = note.note(notes.root, 4)
  return (
    <div>
      <ol className='NoteList'>
        {notes.intervals.map((int, i) => {
          const currNote = add(rootNote, int)
          const label = pc.format(currNote.pitchClass)
          const handleMarkerClick = () => {
            onClick(currNote.pitchClass)
          }
          const ListMarker: React.FC<{ label: string }> = ({ label }) => {
            return (
              <Translate
                x={markerRadius + strokeWidth}
                y={markerRadius + strokeWidth}>
                <circle
                  r={markerRadius}
                  fill='white'
                  stroke='black'
                  strokeWidth={strokeWidth}
                  onClick={handleMarkerClick}
                />
                <text
                  textRendering='optimizeLegibility'
                  textLength={markerRadius * 2 * 0.8}
                  dominantBaseline='middle'
                  textAnchor='middle'
                  pointerEvents='none'>
                  {label}
                </text>
              </Translate>
            )
          }

          return (
            <li key={label}>
              <svg width={width} height={height}>
                <ListMarker label={label} />
              </svg>{' '}
              {i === 0 ? 'root' : interval.format(int, true)}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
