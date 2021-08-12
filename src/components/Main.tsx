import React, { useState, useEffect } from 'react'

import Soundfont, { InstrumentName } from 'soundfont-player'

import { MarkerLabel, Marker } from './types'
import pc, { PitchClass } from '../theory/pitchClass'
import note, { Note } from '../theory/note'
import { getNotesInRange } from '../theory/interval'

import { useStateWhileMounted, useTuning, useScale, useChord } from '../hooks'

import { FretboardChart } from './FretboardChart'
import { DisplayPicker } from './DisplayPicker'
import { ModePicker } from './ModePicker'
import { Footer } from './Footer'
import { NoteList } from './NoteList'
import { TuningPicker } from './TuningPicker'
import { ChordPicker } from './ChordPicker'
import { ScalePicker } from './ScalePicker'
import { FretCountPicker } from './FretCountPicker'

import './App.css'

type MaybeSafariWindow = {
  webkitAudioContext: typeof AudioContext
}

export const Main: React.FC = () => {
  // N.B.: this only applies on first load, not resizing, but that's fine:
  // users can adjust as necessary
  const defaultFretCount = window.matchMedia('(max-height: 600px)').matches
    ? 7
    : 12
  const [fretCount, setFretCount] = useState(defaultFretCount)
  const [display, setDisplay] = useState<MarkerLabel>('note')

  const [tuning, setTuning] = useTuning()
  const [scale] = useScale()
  const [chord] = useChord()

  const [pendingPlayback, setPendingPlayback] = useState<Note | undefined>()
  const [soundPlayer, setSoundPlayer] = useStateWhileMounted<
    Soundfont.Player | undefined
  >(undefined)

  const [lastClickedPc, setLastClickedPc] = useStateWhileMounted<
    PitchClass | undefined
  >(undefined)
  const tempSetLastPc = (pc: PitchClass): void => {
    setLastClickedPc(pc)
    setTimeout(() => setLastClickedPc(undefined), 3000)
  }

  const handleMarkerClick = (marker: Marker) => {
    tempSetLastPc(marker.note.pitchClass)

    if (!soundPlayer) {
      setPendingPlayback(marker.note)
      const ac = new (AudioContext ||
        (window as unknown as MaybeSafariWindow).webkitAudioContext)()
      const instrumentPath = (process.env.PUBLIC_URL +
        '/fluid-r3-acoustic_guitar_steel-mp3.js') as InstrumentName
      Soundfont.instrument(ac, instrumentPath).then((guitar) => {
        setSoundPlayer(guitar)
      })
      return
    }

    const noteLabel = note.format(marker.note, true)
    soundPlayer.play(noteLabel)
  }

  useEffect(() => {
    if (soundPlayer && pendingPlayback) {
      const noteLabel = note.format(pendingPlayback, true)
      soundPlayer.stop()
      soundPlayer.play(noteLabel)
      setPendingPlayback(undefined)
    }
  }, [soundPlayer, pendingPlayback])

  const selected = scale || chord
  const markers = selected
    ? tuning.notes.flatMap((n, i) => {
        const startVal = note.value(n)
        const notes = getNotesInRange(n, fretCount, selected)
        return notes.map((fretboardNote) => ({
          string: i,
          fret: note.value(fretboardNote.note) - startVal,
          label:
            display === 'degree'
              ? String(fretboardNote.index)
              : pc.format(fretboardNote.note.pitchClass),
          note: fretboardNote.note,
          fill:
            lastClickedPc &&
            pc.equal(fretboardNote.note.pitchClass, lastClickedPc)
              ? 'gold'
              : 'white',
        }))
      })
    : []

  return (
    <>
      <div className='Main'>
        <FretboardChart
          markers={markers}
          onMarkerClick={handleMarkerClick}
          tuning={tuning}
          fretCount={fretCount}
        />
        <div className='ControlPanel'>
          <TuningPicker value={tuning} onChange={setTuning} />
          <FretCountPicker value={fretCount} onChange={setFretCount} />
          <ModePicker />
          {scale && <ScalePicker />}
          {chord && <ChordPicker />}
          <DisplayPicker value={display} onChange={setDisplay} />
          <hr />
          {scale ? 'scale degrees' : 'chord tones'}
          {selected && <NoteList notes={selected} onClick={tempSetLastPc} />}
        </div>
      </div>
      <Footer />
    </>
  )
}
