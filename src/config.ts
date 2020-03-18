import { Tunings, Tuning } from './tuning'
import { scale, ScaleKinds, Scale } from './theory/scale'
import { chord, ChordKinds, Chord } from './theory/chord'
import { pc } from './theory/pitchClass'
import { NoteLetter } from './theory/letter'
import { MarkerMode } from './components/types'

type Config = {
  defaultTuning: Tuning
  defaultScale: Scale
  defaultChord: Chord
  defaultMarkerMode: MarkerMode
}

const config: Config = {
  defaultTuning: Tunings[0],
  defaultScale: scale('major', pc(NoteLetter.G), ScaleKinds.major),
  defaultChord: chord('major', pc(NoteLetter.G), ChordKinds.major),
  defaultMarkerMode: 'scale',
}

export default config
