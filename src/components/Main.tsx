import React, { useState, useEffect } from 'react';

import Soundfont from 'soundfont-player';

import { MarkerLabel, Marker } from './types';
import pc, { PitchClass } from '../theory/pitchClass';
import note, { Note} from '../theory/note';
import { getNotesInRange } from '../theory/interval';

import { useStateWhileMounted, useTuning, useScale, useChord } from '../hooks';

import { FretboardChart } from './FretboardChart';
import { DisplayPicker } from './DisplayPicker';
import { ModePicker } from './ModePicker';
import { Footer } from './Footer';
import { NoteList } from './NoteList';
import { TuningPicker } from './TuningPicker';
import { ChordPicker } from './ChordPicker';
import { ScalePicker } from './ScalePicker';
import { FretCountPicker } from './FretCountPicker';

import './App.css';

export const Main: React.FC = () => {
  const [ fretCount, setFretCount ] = useState(12);
  const [ display, setDisplay ] = useState<MarkerLabel>('note');

  const [ tuning, setTuning ] = useTuning()
  const [ scale ] = useScale()
  const [ chord ] = useChord()
  
  const [ pendingPlayback, setPendingPlayback ] = useState<Note | undefined>();
  const [ soundPlayer, setSoundPlayer ] = useStateWhileMounted<Soundfont.Player | undefined>(undefined);

  const [ lastClickedPc, setLastClickedPc ] = useStateWhileMounted<PitchClass | undefined>(undefined)
  const tempSetLastPc = (pc: PitchClass): void => {
    setLastClickedPc(pc)
    setTimeout(() => setLastClickedPc(undefined), 3000)
  }

  const handleMarkerClick = (marker: Marker) => {
    tempSetLastPc(marker.note.pitchClass)

    if (!soundPlayer) {
      setPendingPlayback(marker.note);
      const ac = new AudioContext();
      Soundfont.instrument(ac, 'acoustic_guitar_steel', { soundfont: 'FluidR3_GM' }).then(guitar => {
        setSoundPlayer(guitar)
      })
      return;
    }

    const noteLabel = note.format(marker.note, true);
    soundPlayer.play(noteLabel);
  }

  useEffect(() => {
    if (soundPlayer && pendingPlayback) {
      const noteLabel = note.format(pendingPlayback, true);
      soundPlayer.stop();
      soundPlayer.play(noteLabel);
      setPendingPlayback(undefined);
    }
  }, [ soundPlayer, pendingPlayback ]);

  const selected = scale || chord;
  const markers = selected ? tuning.notes.flatMap((n, i) => {
    const startVal = note.value(n);
    const notes = getNotesInRange(n, fretCount, selected);
    return notes.map(fretboardNote => ({
      string: i,
      fret: note.value(fretboardNote.note) - startVal,
      label: display === 'degree' ? String(fretboardNote.index) : pc.format(fretboardNote.note.pitchClass),
      note: fretboardNote.note,
      fill: lastClickedPc && pc.equal(fretboardNote.note.pitchClass, lastClickedPc) ? 'gold' : 'white'
    }))
  }) : [];
return (
  <div>
<div className="Main">
  <FretboardChart markers={markers} onMarkerClick={handleMarkerClick} tuning={tuning} fretCount={fretCount} width={200} height={600} />
  <div className="ControlPanel">
    <ModePicker />
    {scale && <ScalePicker />}
    {chord && <ChordPicker />}
    <TuningPicker value={tuning} onChange={setTuning} />
    <FretCountPicker value={fretCount} onChange={setFretCount} />
    <DisplayPicker value={display} onChange={setDisplay} />
    {selected && <NoteList notes={selected} onClick={tempSetLastPc} />}
  </div>
</div>
<Footer />
</div>
)
}
