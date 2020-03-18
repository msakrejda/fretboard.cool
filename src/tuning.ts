import note, { Note } from './theory/note'

export interface Tuning {
  instrument: string
  name: string
  notes: Note[]
}

export const tuning = (instrument: string, name: string, notes: string[]) => {
  return {
    instrument,
    name,
    notes: notes.map((n) => note.parse(n)),
  }
}

// instruments clustered together; standard tuning always first if exists
export const Tunings = [
  tuning('mandolin', 'standard', ['g3', 'd4', 'a4', 'e5']),
  tuning('guitar', 'standard', ['e2', 'a2', 'd3', 'g3', 'b3', 'e4']),
  tuning('guitar', 'drop d', ['d2', 'a2', 'd3', 'g3', 'b3', 'e4']),
  tuning('guitar', 'open d', ['d2', 'a2', 'd3', 'f#3', 'a3', 'd4']),
  tuning('guitar', 'open g', ['d2', 'g2', 'd3', 'g3', 'b3', 'd4']),
  tuning('ukulele', 'standard', ['g4', 'c4', 'e4', 'a4']),
] as const

const urlEncode = (t: Tuning): string => {
  return encodeURIComponent(t.instrument + ':' + t.name)
}

const urlDecode = (tStr: string | undefined): Tuning | undefined => {
  if (tStr === undefined) {
    return undefined
  }
  const decoded = decodeURIComponent(tStr)
  const [instrument, name] = decoded.split(':')
  return Tunings.find((t) => t.instrument === instrument && t.name === name)
}

export default {
  urlEncode,
  urlDecode,
}
