import { useState, useContext, useEffect, useRef, useCallback, useLayoutEffect } from 'react'

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

export type Dimensions = {
  width: number;
  height: number;
}

export function useDimensions<T extends HTMLElement>(): [
  React.Ref<T>,
  Dimensions | undefined
] {
  const resizeTimeoutMillis = 100;
  const ref = useRef<T>(null);
  const [ dimensions, setDimensions ] = useState<Dimensions | undefined>(undefined);

  useLayoutEffect(() => {
    let lastResize: number | undefined;
    const handleResize = () => {
      if (lastResize) {
        window.clearTimeout(lastResize);
      }
      lastResize = window.setTimeout(() => {
        const currElem = ref.current;
        if (!currElem) {
          return;
        }
        const { width, height } = currElem.getBoundingClientRect();
        setDimensions({ width, height });
        lastResize = undefined;
      }, resizeTimeoutMillis);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (lastResize) {
        window.clearTimeout(lastResize);
      }
    };
  }, []);
  return [ref, dimensions];
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
