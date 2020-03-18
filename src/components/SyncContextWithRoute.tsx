import React, { useCallback, useMemo, useState, useEffect } from 'react'

import tun, { Tuning } from '../tuning'

import {
  useRouteMatch,
  useHistory,
  Redirect,
  useLocation,
} from 'react-router-dom'
import c, { Chord } from '../theory/chord'
import s, { Scale } from '../theory/scale'

import { AppContext } from '../context'
import config from '../config'
import { RouteContextValues, AppContextParams, AppContextValues } from './types'

type ScaleRouteMatch = {
  tuning: string
  pitchClass: string
  scale: string
}

type ChordRouteMatch = {
  tuning: string
  pitchClass: string
  chord: string
}

const isScaleRouteMatch = (
  match: ScaleRouteMatch | ChordRouteMatch | undefined
): match is ScaleRouteMatch => {
  return match !== undefined && 'scale' in match
}

const decodeRoute = (
  match: ScaleRouteMatch | ChordRouteMatch | undefined
): RouteContextValues => {
  if (!match) {
    return {
      tuning: undefined,
      scale: undefined,
      chord: undefined,
    }
  }
  const tuning = tun.urlDecode(match.tuning)
  let scale, chord
  if (isScaleRouteMatch(match)) {
    scale = s.urlDecode(match.pitchClass, match.scale)
  } else {
    chord = c.urlDecode(match.pitchClass, match.chord)
  }

  return {
    tuning,
    scale,
    chord,
  }
}

export const SyncContextWithRoute: React.FC = ({ children }) => {
  const location = useLocation()
  const history = useHistory()

  const scaleMatch = useRouteMatch<ScaleRouteMatch>(
    '/:tuning/scales/:pitchClass/:scale'
  )
  const chordMatch = useRouteMatch<ChordRouteMatch>(
    '/:tuning/arpeggios/:pitchClass/:chord'
  )

  const routeContext = useMemo(() => {
    return decodeRoute(scaleMatch?.params || chordMatch?.params)
    // Unfortunately, matches are not stable across renders, so we cannot use them for
    // deps. However, since the matches can only change when the location itself
    // changes, we can use that instead, though we do need to disable the linter warning.
    //
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
  const [context, setContext] = useState<AppContextValues>({
    ...routeContext,
    prevChord: undefined,
    prevScale: undefined,
  })
  useEffect(() => {
    setContext((c) => ({
      ...routeContext,
      prevChord: c?.chord || c?.prevChord,
      prevScale: c?.scale || c?.prevScale,
    }))
  }, [routeContext])
  const { tuning, scale, chord } = context

  const updateRouteContext = useCallback(
    (newContext: AppContextParams) => {
      const merged = {
        ...routeContext,
        ...newContext,
      }
      history.push(makeUrl(merged))
    },
    [routeContext, history]
  )

  const invalidRouteFallbackUrl = makeScaleUrl(
    config.defaultTuning,
    config.defaultScale
  )
  return (
    <AppContext.Provider value={[context, updateRouteContext]}>
      {tuning && (scale || chord) ? (
        children
      ) : (
        <Redirect to={invalidRouteFallbackUrl} />
      )}
    </AppContext.Provider>
  )
}

const makeUrl = (context: RouteContextValues): string => {
  if (context.scale) {
    return makeScaleUrl(context.tuning, context.scale)
  } else {
    return makeChordUrl(context.tuning, context.chord)
  }
}

const makeScaleUrl = (t: Tuning, scale: Scale): string => {
  const [pitchClass, scaleKind] = s.urlEncode(scale)
  return `/${tun.urlEncode(t)}/scales/${pitchClass}/${scaleKind}`
}

const makeChordUrl = (t: Tuning, chord: Chord): string => {
  const [pitchClass, chordKind] = s.urlEncode(chord)
  return `/${tun.urlEncode(t)}/arpeggios/${pitchClass}/${chordKind}`
}
