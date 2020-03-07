import { createContext } from 'react';
import { RouteContextValues } from './components/types';

const noOp = (_v: Partial<RouteContextValues>): void => {};

export const RouteContext = createContext<[ RouteContextValues, (v: Partial<RouteContextValues>) => void ]>([
  {
    tuning: undefined, scale: undefined, chord: undefined
  },
  noOp
]);
