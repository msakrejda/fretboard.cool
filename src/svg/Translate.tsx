import React from 'react';
import { translate } from './util';

export const Translate: React.FunctionComponent<{x?: number, y?: number}> = ({
  x = 0, y = 0, children
}) => {
  return <g transform={translate(x, y)}>{children}</g>
}
