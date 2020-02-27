import React, { useState, useEffect } from 'react';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Soundfont from 'soundfont-player';

import { Tuning } from '../theory';
import accidental, { Accidental, Accidentals } from '../theory/accidental';
import { NoteLetters, NoteLetter } from '../theory/letter';
import pc, { PitchClass } from '../theory/pitchClass';
import note, { Note} from '../theory/note';
import { scale, ScaleKind, ScaleKinds } from '../theory/scale';
import { chord, ChordKind, ChordKinds } from '../theory/chord';

import interval, { add, getNotesInRange, PitchClassSequence } from '../theory/interval';
import { FretboardChart, Marker, FretMarker } from './FretboardChart';

import { About } from './About';
import { Footer } from './Footer';

import './App.css';
import { Translate } from '../svg/Translate';
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

/*

routes:
 * /about
 * /{tuning}/scales/{key}/{scale}
 * /{tuning}/arpeggios/{key}/{chord}

where:
 * tuning: guitar | drop-d | open-g | (potentially other guitar tunings) | mandolin | ukulele | /(?:[a-g][#b]?[1-8])+/
 * key: [A-G][#b]?
 * scale: major | minor | modes, pentatonics, etc
 * chord: major, minor, sevenths, etc.

*/

type MarkerLabel = 'note' | 'degree';
type MarkerMode = 'scale' | 'arpeggio';

const App: React.FC = () => {
  const [ fretCount, setFretCount ] = useState(12);
  const [ tuning, setTuning ] = useState(Tuning.mandolin.standard);
  const [ key, setKey ] = useState<PitchClass>(pc.pc(NoteLetter.G));
  const [ mode, setMode ] = useState<MarkerMode>('scale');
  const [ scaleKind, setScaleKind ] = useState<ScaleKind>('major');
  const [ chordKind, setChordKind ] = useState<ChordKind>('major');
  const [ display, setDisplay ] = useState<MarkerLabel>('note');

  const [ pendingPlayback, setPendingPlayback ] = useState<Note | undefined>();
  const [ soundPlayer, setSoundPlayer ] = useState<Soundfont.Player | undefined>();

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
      // TODO: deal with unmounting race condition
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

  const selected = mode === 'scale' ? scale(key, ScaleKinds[scaleKind]) : chord(key, ChordKinds[chordKind]);
  const stringNotes = tuning.map(note.parse);
  const markers = stringNotes.flatMap((n, i) => {
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
      <Router>
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
                  <TuningSelector value={tuning} onChange={setTuning} />
                  <ModeSelector value={mode} onChange={setMode} />
                  <KeySelector value={key} onChange={setKey} mode={mode} />
                  {mode === 'scale' && <ScaleSelector value={scaleKind} onChange={setScaleKind} />}
                  {mode === 'arpeggio' && <ChordSelector value={chordKind} onChange={setChordKind} />}
                  <DisplaySelector value={display} onChange={setDisplay} mode={mode}/>
                  <NoteList notes={selected} onClick={tempSetLastPc} />
                </div>
              </div>
              <Footer />
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

const NoteList: React.FC<{notes: PitchClassSequence, onClick: (pc: PitchClass) => void}> = ({notes, onClick}) => {
  const markerRadius = 10;
  const strokeWidth = 1;
  const width = markerRadius * 2 + 2 * strokeWidth;
  const height = markerRadius * 2 + 2 * strokeWidth;
  // The octave is not important here, but we need notes instead of pitch classes
  // since the add function does not support adding an interval to a pitch class (TODO: fix this)
  const rootNote = note.note(notes.root, 4)
  return (
    <div>
      <ol className="NoteList">
        {notes.intervals.map((int, i) => {
          const currNote = add(rootNote, int);
          const label = pc.format(currNote.pitchClass)
          const handleMarkerClick = () => {
            onClick(currNote.pitchClass)
          }
          const ListMarker: React.FC<{label: string}> = ({label}) => {
            return <Translate x={markerRadius + strokeWidth} y={markerRadius + strokeWidth}>
              <circle r={markerRadius} fill='white' stroke='black' strokeWidth={strokeWidth} onClick={handleMarkerClick} />
              <text dominantBaseline='middle' textAnchor='middle' pointerEvents='none'>{label}</text>
            </Translate>
          }

          return <li><svg width={width} height={height}><ListMarker label={label} /></svg> {i === 0 ? 'root' : interval.format(int)}</li>
        })}
      </ol>
    </div>
  )
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

const ScaleSelector: React.FC<{value: ScaleKind, onChange: (scale: ScaleKind) => void}> = ({value, onChange}) => {
  const options = Object.keys(ScaleKinds).map(scale => {
    return <option key={scale} value={scale}>{scale}</option>
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value as ScaleKind);
  }
  
  return (
    <div>
      <select value={value} onChange={handleChange}>
        {options}
      </select>
    </div>
  )
}

const ChordSelector: React.FC<{value: ChordKind, onChange: (chord: ChordKind) => void}> = ({value, onChange}) => {
  const options = Object.keys(ChordKinds).map(chord => {
    return <option key={chord} value={chord}>{chord}</option>
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value as ChordKind);
  }
  
  return (
    <div>
      <select value={value} onChange={handleChange}>
        {options}
      </select>
    </div>
  )
}


const KeySelector: React.FC<{value: PitchClass, onChange: (pitchClass: PitchClass) => void, mode: MarkerMode}> = ({value, onChange, mode}) => {
  const handleLetterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLetter = e.currentTarget.value as NoteLetter;
    const newAccidental = value.accidental;

    onChange(pc.pc(newLetter, newAccidental));
  }

  const handleAccidentalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccidental = parseInt(e.currentTarget.value, 10) as Accidental;
    onChange(pc.pc(value.letter, newAccidental));
  }
  
  return (
    <div>
    {mode === 'scale' ? 'key' : 'root'}
    <select value={value.letter} onChange={handleLetterChange}>
      {NoteLetters.map(n => <option key={n} value={n}>{NoteLetter[n]}</option>)}
    </select>
    <select value={value.accidental} onChange={handleAccidentalChange}>
      {Accidentals.map(a => <option key={a} value={a}>{accidental.format(a)}</option>)}
    </select>
    </div>
  )
}

const TuningSelector: React.FC<{value: string[], onChange: (strings: string[]) => void}> = ({value, onChange}) => {
  const options = Object.entries(Tuning).map((([family, tunings]) => {
    const { standard, ...rest } = tunings;
    const std = <option key={family} value={standard.join(',')}>{family}</option>
    const others = Object.entries(rest).map(([key, tuning]) => {
      return <option key={`${family}:${key}`} value={tuning.join(',')}>&nbsp;&nbsp;{key}</option>
    })
    return [ std, ...others ]
  })).reduce((list, curr) => list.concat(curr), []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value.split(','));
  }
  
  return (
    <div>
      tuning:
      <select value={value.join(',')} onChange={handleChange}>
        {options}
      </select>
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

export default App;
