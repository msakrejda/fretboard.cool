import { useState, useContext, useEffect, useRef } from 'react'

import { Tuning } from './tuning';
import config from './config';
import { TuningContext, ScaleContext, ChordContext } from './context';
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

const noOp = () => {};

export const useTuning = (): [ Tuning, (t: Tuning) => void ] => {
  const val = useContext(TuningContext);
  if (!val) {
    return [ config.defaultTuning, noOp ];
  }

  const [ tuning , setTuning ] = val;
  return [ tuning || config.defaultTuning, setTuning ];
}

export const useScale = (): [ Scale, (t: Scale) => void ] => {
  const val = useContext(ScaleContext);
  if (!val) {
    return [ config.defaultScale, noOp ];
  }

  const [ scaleVal , setScale ] = val;
  return [ scaleVal || config.defaultScale, setScale ];
}

export const useChord = (): [ Chord, (t: Chord) => void ] => {
  const val = useContext(ChordContext);
  if (!val) {
    return [ config.defaultChord, noOp ];
  }

  const [ chordVal , setChord ] = val;
  return [ chordVal || config.defaultChord, setChord ];
}
