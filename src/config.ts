import { Tunings } from "./tuning";
import { scale, ScaleKinds } from "./theory/scale";
import { chord, ChordKinds } from "./theory/chord";
import { pc } from "./theory/pitchClass";
import { NoteLetter } from "./theory/letter";

const config = {
  defaultTuning: Tunings[0],
  defaultScale: scale('major', pc(NoteLetter.G), ScaleKinds.major),
  defaultChord: chord('major', pc(NoteLetter.G), ChordKinds.major)
}

export default config;