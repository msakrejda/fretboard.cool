import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import { FretboardChart, Marker } from './FretboardChart';

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
  const strings = ['g','d','a','e'];
  const markers: Marker[] = [];
  const [ fretCount, setFretCounnt ] = useState(12);
  const handleFretCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFretCounnt(parseInt(e.currentTarget.value, 10));
  }
  return (
    <div className="App">
      <input type="number" min={3} max={24} value={fretCount} onChange={handleFretCountChange} />
      <FretboardChart markers={markers} strings={strings} fretCount={fretCount} width={200} height={600} />
    </div>
  );
}

export default App;
