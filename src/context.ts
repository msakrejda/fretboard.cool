import { createContext } from 'react';
import { Tuning } from './tuning';

import { Scale } from './theory/scale';
import { Chord } from './theory/chord';

export const TuningContext = createContext<[ Tuning | undefined, (t: Tuning) => void ] | undefined>(undefined);
export const ScaleContext = createContext<[ Scale | undefined, (s: Scale) => void ] | undefined>(undefined);
export const ChordContext = createContext<[ Chord | undefined, (c: Chord) => void ] | undefined>(undefined);

