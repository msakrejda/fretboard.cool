import React, { useContext } from 'react';

import tun, { Tuning, Tunings } from '../tuning';

import { useRouteMatch, useHistory, Redirect } from 'react-router-dom';
import pc from '../theory/pitchClass';
import { chord, Chord, ChordKinds } from '../theory/chord';
import s, { scale, Scale, ScaleKinds } from '../theory/scale';
import { NoteLetter } from '../theory/letter';

export const TuningContext = React.createContext<[ Tuning | undefined, (t: Tuning) => void ] | undefined>(undefined);
export const ScaleContext = React.createContext<[ Scale | undefined, (s: Scale) => void ] | undefined>(undefined);
export const ChordContext = React.createContext<[ Chord | undefined, (c: Chord) => void ] | undefined>(undefined);

const DEFAULT_TUNING = Tunings[0];
const DEFAULT_SCALE = scale('major', pc.pc(NoteLetter.G), ScaleKinds.major)
const DEFAULT_CHORD = chord('major', pc.pc(NoteLetter.G), ChordKinds.major)

export const useTuning = (): [ Tuning, (t: Tuning) => void ] => {
  const val = useContext(TuningContext);
  if (!val) {
    return [ DEFAULT_TUNING, () => {} ];
  }

  const [ tuning , setTuning ] = val;
  return [ tuning || DEFAULT_TUNING, setTuning ];
}

export const useScale = (): [ Scale, (t: Scale) => void ] => {
  const val = useContext(ScaleContext);
  if (!val) {
    return [ DEFAULT_SCALE, () => {} ];
  }

  const [ scaleVal , setScale ] = val;
  return [ scaleVal || DEFAULT_SCALE, setScale ];
}

export const useChord = (): [ Chord, (t: Chord) => void ] => {
  const val = useContext(ChordContext);
  if (!val) {
    return [ DEFAULT_CHORD, () => {} ];
  }

  const [ chordVal , setChord ] = val;
  return [ chordVal || DEFAULT_CHORD, setChord ];
}

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

  const history = useHistory();

  const routeTuning = scaleMatch?.params.tuning || chordMatch?.params.tuning;
  const tuning = routeTuning ? tun.urlDecode(routeTuning) : undefined;
  const ctxtScale = scaleMatch ? s.urlDecode(scaleMatch.params.pitchClass, scaleMatch.params.scale) : undefined;
  const ctxtChord = chordMatch ? s.urlDecode(chordMatch.params.pitchClass, chordMatch.params.chord) : undefined;

  const makeScaleUrl = (t: Tuning, scale: Scale):string => {
    const [ pitchClass, scaleKind ] = s.urlEncode(scale);
    return `/${tun.urlEncode(t)}/scales/${pitchClass}/${scaleKind}`;
  }
  const makeChordUrl = (t: Tuning, chord: Chord):string => {
    const [ pitchClass, chordKind ] = s.urlEncode(chord);
    return `/${tun.urlEncode(t)}/arpeggios/${pitchClass}/${chordKind}`;
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

  const [ defaultPc, defaultScale ] = s.urlEncode(DEFAULT_SCALE);
  const invalidRouteFallbackUrl = `/${tun.urlEncode(DEFAULT_TUNING)}/scales/${defaultPc}/${defaultScale}`;
  return (
    <TuningContext.Provider value={[ tuning, setTuning ]}>
      <ScaleContext.Provider value={[ ctxtScale, setScale ]}>
        <ChordContext.Provider value={[ ctxtChord, setChord ]}>
          {tuning && (ctxtScale || ctxtChord)
            ? children
            : <Redirect to={invalidRouteFallbackUrl} />}
        </ChordContext.Provider>
      </ScaleContext.Provider>
    </TuningContext.Provider>
  )
}
