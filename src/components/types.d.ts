import { Note } from '../theory/note'

export type RouteContextValues = {
  tuning: Tuning | undefined
  scale: Scale | undefined
  chord: Chord | undefined
}

export type AppContextValues = RouteContextValues & {
  prevScale: Scale | undefined
  prevChord: Chord | undefined
}

export type AppContextParams = Partial<
  Omit<AppContextValues, 'preChord' | 'prevScale'>
>

export type Marker = {
  string: number
  fret: number
  label: string
  note: Note
  fill: string
}

export type MarkerLabel = 'note' | 'degree'
export type MarkerMode = 'scale' | 'chord tones'

export type SelectionOption =
  | string
  | {
      label: string
      value: string
    }
