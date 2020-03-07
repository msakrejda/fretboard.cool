import React, { useCallback, useMemo } from 'react';

import tun, { Tuning } from '../tuning';

import { useRouteMatch, useHistory, Redirect, useLocation } from 'react-router-dom';
import { Chord } from '../theory/chord';
import s, { Scale } from '../theory/scale';

import { TuningContext, ScaleContext, ChordContext } from '../context';
import config from '../config';

type ScaleRouteMatch = {
  tuning: string,
  pitchClass: string,
  scale: string,
}

type ChordRouteMatch = {
  tuning: string,
  pitchClass: string,
  chord: string
}

const isScaleRouteMatch = (match: ScaleRouteMatch | ChordRouteMatch | undefined): match is ScaleRouteMatch => {
  return match !== undefined && 'scale' in match;
}

type RouteContextValues = {
  tuning: Tuning | undefined,
  scale: Scale | undefined,
  chord: Chord | undefined,
}

const decodeRoute = (match: ScaleRouteMatch | ChordRouteMatch | undefined): RouteContextValues => {
  if (!match) {
    return {
      tuning: undefined,
      scale: undefined,
      chord: undefined
    }
  }
  const tuning = tun.urlDecode(match.tuning);
  let scale, chord
  if (isScaleRouteMatch(match)) {
    scale = s.urlDecode(match.pitchClass, match.scale)
  } else {
    chord = s.urlDecode(match.pitchClass, match.chord)
  }

  return {
    tuning,
    scale,
    chord
  }
}

export const SyncContextWithRoute: React.FC = ({children}) => {
  const location = useLocation();
  const scaleMatch = useRouteMatch<ScaleRouteMatch>("/:tuning/scales/:pitchClass/:scale");
  const chordMatch = useRouteMatch<ChordRouteMatch>("/:tuning/arpeggios/:pitchClass/:chord");

  const { tuning, scale, chord } = useMemo(() => {
    return decodeRoute(scaleMatch?.params || chordMatch?.params)
    // Unfortunately, matches are not stable across renders, so we cannot use them for
    // deps. However, since the matches can only change when the location itself
    // changes, we can use that instead, though we do need to disable the linter warning.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ location.pathname ])

  const history = useHistory();
  const setTuning = useCallback((t: Tuning):void => {
    if (scale) {
      history.push(makeScaleUrl(t, scale));
    } else if (chord) {
      history.push(makeChordUrl(t, chord));
    }
  }, [ history, scale, chord ]);

  const setScale = useCallback((s: Scale):void => {
    if (!tuning) {
      return;
    }
    const newRoute = makeScaleUrl(tuning, s);
    history.push(newRoute)
  }, [ history, tuning, ]);

  const setChord = (c: Chord):void => {
    if (!tuning) {
      return;
    }
    const newRoute = makeChordUrl(tuning, c);
    history.push(newRoute);
  }

  const invalidRouteFallbackUrl = makeScaleUrl(config.defaultTuning, config.defaultScale)
  return (
    <TuningContext.Provider value={[ tuning, setTuning ]}>
      <ScaleContext.Provider value={[ scale, setScale ]}>
        <ChordContext.Provider value={[ chord, setChord ]}>
          {tuning && (scale || chord)
            ? children
            : <Redirect to={invalidRouteFallbackUrl} />}
        </ChordContext.Provider>
      </ScaleContext.Provider>
    </TuningContext.Provider>
  )
}


const makeScaleUrl = (t: Tuning, scale: Scale):string => {
  const [ pitchClass, scaleKind ] = s.urlEncode(scale);
  return `/${tun.urlEncode(t)}/scales/${pitchClass}/${scaleKind}`;
}

const makeChordUrl = (t: Tuning, chord: Chord):string => {
  const [ pitchClass, chordKind ] = s.urlEncode(chord);
  return `/${tun.urlEncode(t)}/arpeggios/${pitchClass}/${chordKind}`;
}
