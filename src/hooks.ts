import { useState, useContext, useEffect, useRef, useCallback } from 'react'

import { Tuning } from './tuning';
import { RouteContext } from './context';
import { Scale } from './theory/scale';
import { Chord } from './theory/chord';

export const useStateWhileMounted = <T>(initialValue: T): [ T, (newValue: T) => void ] => {
  const [ val, setVal ] = useState<T>(initialValue)
  const unmounted = useRef(false)
  useEffect(() => {
    return () => { unmounted.current = true }
  }, [])
  const setWhileMounted = (newVal: T) => {
    if (unmounted.current) {
      return
    }
    setVal(newVal)
  }
  return [ val, setWhileMounted ]
}

/** generic hooks above, app-specific hooks below **/

export const useTuning = (): [ Tuning, (t: Tuning) => void ] => {
  const [ context, updateContext ] = useContext(RouteContext);

  const setTuning = useCallback((tuning: Tuning): void => {
    updateContext({ tuning })
  }, [updateContext])
  return [ context.tuning, setTuning ];
}

export const useScale = (): [ Scale, (t: Scale) => void ] => {
  const [ context, updateContext ] = useContext(RouteContext);

  const setScale = (scale: Scale): void => {
    updateContext({ scale, chord: undefined })
  }
  return [ context.scale, setScale ];
}

export const useChord = (): [ Chord, (t: Chord) => void ] => {
  const [ context, updateContext ] = useContext(RouteContext);

  const setChord = (chord: Chord): void => {
    updateContext({ chord, scale: undefined })
  }
  return [ context.chord, setChord ];
}
