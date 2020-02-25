import { useState, useEffect, useRef } from 'react'

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
