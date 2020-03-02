import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Soundfont from 'soundfont-player';

import pc, { PitchClass } from '../theory/pitchClass';
import note, { Note} from '../theory/note';

import { getNotesInRange } from '../theory/interval';
import { FretboardChart, Marker } from './FretboardChart';
import { SyncContextWithRoute, useTuning, useScale, useChord } from './SyncContextWithRoute';

import { About } from './About';
import { Footer } from './Footer';
import { NoteList } from './NoteList';
import { TuningPicker } from './TuningPicker';
import { ChordPicker } from './ChordPicker';
import { ScalePicker } from './ScalePicker';

import './App.css';
import { useStateWhileMounted } from '../hooks';

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

type MarkerLabel = 'note' | 'degree';
type MarkerMode = 'scale' | 'arpeggio';

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
                <FretCountSelector value={fretCount} onChange={setFretCount} />
                <TuningPicker value={tuning} onChange={setTuning} />
                <ModeSelector value={mode} onChange={setMode} />
                {mode === 'scale' && <ScalePicker />}
                {mode === 'arpeggio' && <ChordPicker />}
                <DisplaySelector value={display} onChange={setDisplay} mode={mode}/>
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

const DisplaySelector: React.FC<{value: MarkerLabel, onChange: (display: MarkerLabel) => void, mode: MarkerMode}> = ({value, onChange, mode}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value as MarkerLabel);
  }
  return (
    <div>
      label:
      <label>
        <input type="radio" name="display" value='degree' checked={value === 'degree'} onChange={handleChange} />  
        {mode === 'scale' ? 'scale degree' : 'chord tone'}
      </label>
      <label>
        <input type="radio" name="display" value='note' checked={value === 'note'} onChange={handleChange} />
        note name
      </label>
    </div>
  )
}

const ModeSelector: React.FC<{value: MarkerMode, onChange: (mode: MarkerMode) => void}> = ({value, onChange}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value as MarkerMode);
  }
  return (
    <div>
      mode:
      <label>
        <input type="radio" name="mode" value='scale' checked={value === 'scale'} onChange={handleChange} />  
        scale
      </label>
      <label>
        <input type="radio" name="mode" value='arpeggio' checked={value === 'arpeggio'} onChange={handleChange} />
        arpeggio
      </label>
    </div>
  )
}

const FretCountSelector: React.FC<{value: number, onChange: (count: number) => void}> = ({value, onChange}) => {
  const handleFretCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.currentTarget.value, 10));
  }
  return <div>
    <label>frets: <input type="number" min={3} max={24} value={value} onChange={handleFretCountChange} /></label>
  </div>
}

const App = () => (
  <Router>
    <SyncContextWithRoute>
      <RefactorMe />
    </SyncContextWithRoute>
  </Router>
)

export default App;
