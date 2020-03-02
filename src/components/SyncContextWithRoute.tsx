import React, { useMemo, useContext } from 'react';

import { Tuning, Tunings } from '../util';

import { useRouteMatch, useHistory } from 'react-router-dom';
import pc from '../theory/pitchClass';
import { chord, Chord, ChordKinds } from '../theory/chord';
import { scale, Scale, ScaleKinds } from '../theory/scale';
import { NoteLetter } from '../theory/letter';

export const TuningContext = React.createContext<[ Tuning | undefined, (t: Tuning) => void ] | undefined>(undefined);
export const ScaleContext = React.createContext<[ Scale | undefined, (s: Scale) => void ] | undefined>(undefined);
export const ChordContext = React.createContext<[ Chord | undefined, (c: Chord) => void ] | undefined>(undefined);

export const useTuning = (): [ Tuning, (t: Tuning) => void ] => {
  const val = useContext(TuningContext);
  if (val) {
    const [ tuning , setTuning ] = val;
    return [ tuning || Tunings[0], setTuning ];
  }
  return [ Tunings[0], () => {} ];
}

export const useScale = (): [ Scale, (t: Scale) => void ] => {
  const val = useContext(ScaleContext);
  const defaultScale = scale('major', pc.pc(NoteLetter.G), ScaleKinds.major)
  if (val) {
    const [ scale , setScale ] = val;
    return [ scale || defaultScale, setScale ];
  }
  return [ defaultScale, () => {} ];
}

export const useChord = (): [ Chord, (t: Chord) => void ] => {
  const val = useContext(ChordContext);
  const defaultChord = chord('major', pc.pc(NoteLetter.G), ChordKinds.major)
  if (val) {
    const [ chord , setChord ] = val;
    return [ chord || defaultChord, setChord ];
  }
  return [ defaultChord, () => {} ];
}

const toUrlVal = (name: string):string => name.replace(/ /g, '-');
const fromUrlVal = (name: string):string => name.replace(/-/g, ' ');

export const SyncContextWithRoute: React.FC = ({children}) => {
  const scaleMatch = useRouteMatch<{
    tuning: string,
    pitchClass: string,
    scale: string,
  }>("/:tuning/scales/:pitchClass/:scale");
  const chordMatch = useRouteMatch<{
    tuning: string,
    pitchClass: string,
    chord: string
  }>("/:tuning/arpeggios/:pitchClass/:chord");
  console.log('scale match is', scaleMatch);
  console.log('chord match is', chordMatch);

  const history = useHistory();

  const routeTuning = scaleMatch?.params?.tuning || chordMatch?.params?.tuning;
  const tuning = useMemo(() => {
    if (!routeTuning) {
      return undefined;
    }
    const [ instrument, name ] = routeTuning.split(':');
    const unescapedName = fromUrlVal(name)
    return Tunings.find(t => t.instrument === instrument && t.name === unescapedName)
  }, [ routeTuning ]);

  const ctxtScale = useMemo(() => {
    if (!scaleMatch) {
      return undefined;
    }
    const name = fromUrlVal(scaleMatch.params.scale);
    const intervals = ScaleKinds[name as keyof typeof ScaleKinds];
    const root = pc.parse(scaleMatch.params.pitchClass)
    return chord(name, root, intervals);
  }, [ scaleMatch ]);
  const ctxtChord = useMemo(() => {
    if (!chordMatch) {
      return undefined;
    }
    const name = fromUrlVal(chordMatch.params.chord);
    const intervals = ChordKinds[name as keyof typeof ChordKinds];
    const root = pc.parse(chordMatch.params.pitchClass)
    return scale(name, root, intervals)
  }, [ chordMatch ]);

  const makeScaleUrl = (t: Tuning, scale: Scale):string => {
    return `/${t.instrument}:${toUrlVal(t.name)}/scales/${pc.format(scale.root, true).toLowerCase()}/${toUrlVal(scale.name)}`;
  }
  const makeChordUrl = (t: Tuning, chord: Chord):string => {
    return `/${t.instrument}:${toUrlVal(t.name)}/arpeggios/${pc.format(chord.root, true).toLowerCase()}/${toUrlVal(chord.name)}`;
  }

  const setTuning = (t: Tuning):void => {
    if (ctxtScale) {
      history.push(makeScaleUrl(t, ctxtScale));
    } else if (ctxtChord) {
      history.push(makeChordUrl(t, ctxtChord));
    }
  }

  const setScale = (s: Scale):void => {
    if (!tuning) {
      return;
    }
    const newRoute = makeScaleUrl(tuning, s);
    history.push(newRoute)
  }

  const setChord = (c: Chord):void => {
    if (!tuning) {
      return;
    }
    const newRoute = makeChordUrl(tuning, c);
    history.push(newRoute);
  }

  return (
    <TuningContext.Provider value={[ tuning, setTuning ]}>
      <ScaleContext.Provider value={[ ctxtScale, setScale ]}>
        <ChordContext.Provider value={[ ctxtChord, setChord ]}>
          {children}
        </ChordContext.Provider>
      </ScaleContext.Provider>
    </TuningContext.Provider>
  )
}
