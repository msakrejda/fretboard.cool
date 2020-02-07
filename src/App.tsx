import React, { useState } from 'react';

import { Tuning, ScaleKinds, NoteLetters, NoteLetter, parseNote, pc, scale, ScaleKind, Accidental, Accidentals, formatAccidental } from './theory';
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

const App: React.FC = () => {
  const [ fretCount, setFretCount ] = useState(12);
  const [ tuning, setTuning ] = useState(Tuning.mandolin.standard);
  const [ key, setKey ] = useState<NoteLetter>(NoteLetter.G);
  const [ scaleKind, setScaleKind ] = useState<ScaleKind>('major');
  const [ accidental, setAccidental ] = useState<Accidental>(Accidental.Natural);

  const selectedPc = pc(key, accidental);
  const selectedScale = scale(selectedPc, ScaleKinds[scaleKind]);
  const stringNotes = tuning.map(parseNote);
  const markers = stringNotes.flatMap((n, i) => {
    const notes = getNotesOnString(n, fretCount, selectedScale);
    return notes.map(fretboardNote => ({
      string: i,
      label: String(fretboardNote.degree),
      fret: fretboardNote.fret,
    }))
  })

  return (
    <div className="App">
      <div>
        frets:
        <FretCountSelector value={fretCount} onChange={setFretCount} />
        tuning:
        <TuningSelector value={tuning} onChange={setTuning} />
        key:
        <NoteLetterSelector value={key} onChange={setKey} />
        <AccidentalSelector value={accidental} onChange={setAccidental} />
        scale:
        <ScaleSelector value={scaleKind} onChange={setScaleKind} />
      </div>
      <FretboardChart markers={markers} tuning={tuning} fretCount={fretCount} width={200} height={600} />
    </div>
  );
}

const ScaleSelector: React.FC<{value: ScaleKind, onChange: (scale: ScaleKind) => void}> = ({value, onChange}) => {
  const options = Object.keys(ScaleKinds).map(scale => {
    return <option key={scale} value={scale}>{scale}</option>
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value as ScaleKind);
  }
  
  return (
    <select value={value} onChange={handleChange}>
      {options}
    </select>
  )
}

const NoteLetterSelector: React.FC<{value: NoteLetter, onChange: (key: NoteLetter) => void}> = ({value, onChange}) => {
  const options = NoteLetters.map(noteLetter => {
    return <option key={noteLetter} value={noteLetter}>{NoteLetter[noteLetter]}</option>
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value as NoteLetter);
  }

  return (
    <select value={value} onChange={handleChange}>
      {options}
    </select>
  )
}

const AccidentalSelector: React.FC<{value: Accidental, onChange: (accidental: Accidental) => void}> = ({value, onChange}) => {
  const options = Accidentals.map(accidental => {
    return <option key={accidental} value={accidental}>{formatAccidental(accidental)}</option>
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(parseInt(e.currentTarget.value, 10) as Accidental);
  }
  
  return (
    <select value={value} onChange={handleChange}>
      {options}
    </select>
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
    <select value={value.join(',')} onChange={handleChange}>
      {options}
    </select>
  )
}

const FretCountSelector: React.FC<{value: number, onChange: (count: number) => void}> = ({value, onChange}) => {
  const handleFretCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.currentTarget.value, 10));
  }
  return <input type="number" min={3} max={24} value={value} onChange={handleFretCountChange} />
}

export default App;
