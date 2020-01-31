import React, { useState } from 'react';

import { Tuning, Scales, NoteLetters, NoteLetter } from './theory';
import { FretboardChart, Marker } from './FretboardChart';

import './App.css';

/*

routes:
 * /about
 * /{tuning}/scales/{key}/{scale}
 * /{tuning}/arpeggios/{key}/{chord}

where:
 * tuning: guitar | drop-d | open-g | (potentially other guitar tunings) | mandolin | ukulele | /(?:[a-g][1-8])+/
 * key: [A-G][#b]?
 * scale: major | minor | dorian or whatever teoria considers a scale
 * chord: whatever teoria considers a chord

*/

const App: React.FC = () => {
  const markers: Marker[] = [];
  const [ fretCount, setFretCount ] = useState(12);
  const [ strings, setStrings ] = useState(Tuning.mandolin.standard);
  const [ key, setKey ] = useState('G');
  const [ scale, setScale ] = useState('major');

  /*  
  now for each string:
   - starting with the root of the scale below the string note
     - go through all 

   - for all the notes in the string,
       for notes that occur in the scale
       range(notes: Array<string|number>, options) => string[]
  */

  return (
    <div className="App">
      <div>
        frets:
        <FretCountSelector value={fretCount} onChange={setFretCount} />
        tuning:
        <TuningSelector value={strings} onChange={setStrings} />
        key:
        <KeySelector value={key} onChange={setKey} />
        scale:
        <ScaleSelector value={scale} onChange={setScale} />
      </div>
      <FretboardChart markers={markers} strings={strings} fretCount={fretCount} width={200} height={600} />
    </div>
  );
}

const ScaleSelector: React.FC<{value: string, onChange: (scale: string) => void}> = ({value, onChange}) => {
  const options = Object.keys(Scales).map(scale => {
    return <option key={scale} value={scale}>{scale}</option>
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value);
  }
  
  return (
    <select value={value} onChange={handleChange}>
      {options}
    </select>
  )
}

const KeySelector: React.FC<{value: string, onChange: (key: string) => void}> = ({value, onChange}) => {
  const options = NoteLetters.map(noteLetter => {
    return <option key={noteLetter} value={noteLetter}>{NoteLetter[noteLetter]}</option>
  })

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.currentTarget.value);
  }
  
  return (
    <select value={value} onChange={handleChange}>
      {options}
    </select>
  )
}

const TuningSelector: React.FC<{value: string[], onChange: (strings: string[]) => void}> = ({value, onChange}) => {
  const options = Object.entries(Tuning).flatMap((([family, tunings]) => {
    const { standard, ...rest } = tunings;
    const std = <option key={family} value={standard.join(',')}>{family}</option>
    const others = Object.entries(rest).map(([key, tuning]) => {
      return <option key={`${family}:${key}`} value={tuning.join(',')}>&nbsp;&nbsp;{key}</option>
    })
    return [ std, ...others ]
  }));

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
