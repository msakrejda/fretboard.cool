import { useState, useContext, useEffect, useRef, useCallback } from 'react'

import { Tuning } from './tuning';
import { AppContext } from './context';
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
  const [ context, updateContext ] = useContext(AppContext);

  const setTuning = useCallback((tuning: Tuning): void => {
    updateContext({ tuning })
  }, [updateContext])
  return [ context.tuning, setTuning ];
}

export const useScale = (): [ Scale, (t: Scale) => void, Scale | undefined ] => {
  const [ context, updateContext ] = useContext(AppContext);

  const setScale = (scale: Scale): void => {
    updateContext({ scale, chord: undefined })
  }
  return [ context.scale, setScale, context.prevScale ];
}

export const useChord = (): [ Chord, (t: Chord) => void, Chord | undefined ] => {
  const [ context, updateContext ] = useContext(AppContext);

  const setChord = (chord: Chord): void => {
    updateContext({ chord, scale: undefined })
  }
  return [ context.chord, setChord, context.prevChord ];
}
