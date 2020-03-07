import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Soundfont from 'soundfont-player';

import pc, { PitchClass } from '../theory/pitchClass';
import note, { Note} from '../theory/note';
import { getNotesInRange } from '../theory/interval';

import { useStateWhileMounted, useTuning, useScale, useChord } from '../hooks';

import { SyncContextWithRoute } from './SyncContextWithRoute';

import { FretboardChart } from './FretboardChart';
import { DisplayPicker } from './DisplayPicker';
import { ModePicker } from './ModePicker';
import { About } from './About';
import { Footer } from './Footer';
import { NoteList } from './NoteList';
import { TuningPicker } from './TuningPicker';
import { ChordPicker } from './ChordPicker';
import { ScalePicker } from './ScalePicker';
import { FretCountPicker } from './FretCountPicker';

import { MarkerLabel, MarkerMode, Marker } from './types';

import './App.css';

const colors = {
   c1a: '#267257',
   c1b: '#72AB97',
   c1c: '#478E75',
   c1d: '#0E553C',
   c1e: '#003925',

   c2a: '#2A4D6E',
   c2b: '#728CA6',
   c2c: '#4A6B8A',
   c2d: '#133353',
   c2e: '#041E37',

   c3a: '#AA7C39',
   c3b: '#FFDCAA',
   c3c: '#D4A96A',
   c3d: '#805415',
   c3e: '#553200',

   c4a: '#AA5D39',
   c4b: '#FFC6AA',
   c4c: '#D48D6A',
   c4d: '#803815',
   c4e: '#551C00',
}

const RefactorMe: React.FC = () => {
  const [ fretCount, setFretCount ] = useState(12);
  const [ mode, setMode ] = useState<MarkerMode>('scale');
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

  const selected = mode === 'scale' ? scale : chord;
  const markers = tuning.notes.flatMap((n, i) => {
    const startVal = note.value(n);
    const notes = getNotesInRange(n, fretCount, selected);
    return notes.map(fretboardNote => ({
      string: i,
      fret: note.value(fretboardNote.note) - startVal,
      label: display === 'degree' ? String(fretboardNote.index) : pc.format(fretboardNote.note.pitchClass),
      note: fretboardNote.note,
      fill: lastClickedPc && pc.equal(fretboardNote.note.pitchClass, lastClickedPc) ? 'gold' : 'white'
    }))
  })

  return (
    <div className="Content">
      <Switch>
        <Route path='/about'>
          <About />
        </Route>
        <Route path='*'>
          <div>
            <div className="Main">
              <FretboardChart markers={markers} onMarkerClick={handleMarkerClick} tuning={tuning} fretCount={fretCount} width={200} height={600} />
              <div>
                <TuningPicker value={tuning} onChange={setTuning} />
                <ModePicker value={mode} onChange={setMode} />
                {mode === 'scale' && <ScalePicker />}
                {mode === 'chord tones' && <ChordPicker />}
                <FretCountPicker value={fretCount} onChange={setFretCount} />
                <DisplayPicker value={display} onChange={setDisplay} mode={mode}/>
                <NoteList notes={selected} onClick={tempSetLastPc} />
              </div>
            </div>
            <Footer />
          </div>
        </Route>
      </Switch>
    </div>
  );
}

const App = () => (
  <Router>
    <SyncContextWithRoute>
      <RefactorMe />
    </SyncContextWithRoute>
  </Router>
)

export default App;
