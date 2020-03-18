import { createContext } from 'react'
import { AppContextValues, AppContextParams } from './components/types'

const noOp = (_v: AppContextParams): void => {}

export const AppContext = createContext<
  [AppContextValues, (v: AppContextParams) => void]
>([
  {
    tuning: undefined,
    scale: undefined,
    chord: undefined,
    prevChord: undefined,
    prevScale: undefined,
  },
  noOp,
])
