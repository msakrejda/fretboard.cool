import React, { useState } from 'react';

import { Tuning, ScaleKinds, NoteLetters, NoteLetter, parseNote, pc, scale, ScaleKind, Accidental, Accidentals, formatAccidental, PitchClass, formatPitchClass } from './theory';
import { getNotesOnString } from './util';
import { FretboardChart } from './FretboardChart';

import './App.css';

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

type MarkerText = 'note' | 'degree';

const App: React.FC = () => {
  const [ fretCount, setFretCount ] = useState(12);
  const [ tuning, setTuning ] = useState(Tuning.mandolin.standard);
  const [ key, setKey ] = useState<PitchClass>(pc(NoteLetter.G));
  const [ scaleKind, setScaleKind ] = useState<ScaleKind>('major');
  const [ display, setDisplay ] = useState<MarkerText>('note');

  const selectedScale = scale(key, ScaleKinds[scaleKind]);
  const stringNotes = tuning.map(parseNote);
  const markers = stringNotes.flatMap((n, i) => {
    const notes = getNotesOnString(n, fretCount, selectedScale);
    return notes.map(fretboardNote => ({
      string: i,
      label: display === 'degree' ? String(fretboardNote.degree) : formatPitchClass(fretboardNote.note.pitchClass),
      fret: fretboardNote.fret,
    }))
  })

  return (
    <div className="Main">
      <FretboardChart markers={markers} tuning={tuning} fretCount={fretCount} width={200} height={600} />
      <div>
        <FretCountSelector value={fretCount} onChange={setFretCount} />
        <TuningSelector value={tuning} onChange={setTuning} />
        <KeySelector value={key} onChange={setKey} />
        <ScaleSelector value={scaleKind} onChange={setScaleKind} />
        <DisplaySelector value={display} onChange={setDisplay} />
      </div>
    </div>
  );
}

const DisplaySelector: React.FC<{value: MarkerText, onChange: (display: MarkerText) => void}> = ({value, onChange}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.currentTarget.value as MarkerText);
  }
  return (
    <div>
      show
      <label>
        <input type="radio" name="display" value='degree' checked={value === 'degree'} onChange={handleChange} />  
        scale degree
      </label>
      <label>
        <input type="radio" name="display" value='note' checked={value === 'note'} onChange={handleChange} />
        note name
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
      scale:
      <select value={value} onChange={handleChange}>
        {options}
      </select>
    </div>
  )
}


const KeySelector: React.FC<{value: PitchClass, onChange: (pitchClass: PitchClass) => void}> = ({value, onChange}) => {
  const handleLetterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLetter = e.currentTarget.value as NoteLetter;
    const newAccidental = value.accidental;

    onChange(pc(newLetter, newAccidental));
  }

  const handleAccidentalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccidental = parseInt(e.currentTarget.value, 10) as Accidental;
    onChange(pc(value.letter, newAccidental));
  }
  
  return (
    <div>
    key:
    <select value={value.letter} onChange={handleLetterChange}>
      {NoteLetters.map(n => <option key={n} value={n}>{NoteLetter[n]}</option>)}
    </select>
    <select value={value.accidental} onChange={handleAccidentalChange}>
      {Accidentals.map(a => <option key={a} value={a}>{formatAccidental(a)}</option>)}
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
