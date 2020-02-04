import React from 'react';

import { translate, scaleLength, fretPositions, stringPositions } from './util';
/*

 - fingerboard
 - fretboard dots?
 - frets
 - nut
 - strings

 - fret numbers

 - open / muted notes
 - note markers

*/
type SizeProps = {
  width: number;
  height: number;
}

export type Marker = {
  string: number;
  fret: number | null;
  label: string;
}

export const FretboardChart: React.FunctionComponent<SizeProps & {
  markers: Marker[],
  tuning: string[],
  fretCount: number,
}> = ({
  width,
  height,
  tuning,
  fretCount,
  markers
}) => {
  const numberedFrets = [ 3, 5, 7, 9, 12 ].filter(f => f <= fretCount);

  const leftMargin = 20;
  const bottomMargin = 10;
  const topMargin = 30;
  const fretboardSize = {
    width: width - leftMargin,
    height: height - topMargin - bottomMargin,
  }

  const scaleLen = scaleLength(fretCount, fretboardSize.height);
  // TODO: account for string and fret width in positioning
  const fretPos = fretPositions(fretCount, scaleLen);
  const stringPos = stringPositions(tuning.length, fretboardSize.width);

  return (
    <svg width={width} height={height}>
      <Translate x={leftMargin} y={topMargin}>
        <Fretboard {...fretboardSize} />
        <Nut width={fretboardSize.width} height={3} />
        {fretPos.map((yOffset) => (
          <Translate key={yOffset} y={yOffset}>
            <Fret width={fretboardSize.width} height={2} />
          </Translate>
        ))}
        {stringPos.map(xOffset => (
          <Translate key={xOffset} x={xOffset}>
            <String width={2} height={fretboardSize.height} />
          </Translate>
        ))}
        {numberedFrets.map(n => (
          <Translate key={n} y={fretPos[n - 1]}>
            <FretNumber label={n.toString()} />
          </Translate>
        ))}
        {markers.map((marker, i) => (
          <Translate key={i} x={stringPos[marker.string]} y={fretPos[(marker.fret || 0) - 1]}>
            <circle r={3} />
          </Translate>
        ))}
      </Translate>
    </svg>
  )
}

const Fretboard: React.FunctionComponent<SizeProps> = (props) => {
  return <rect fill='wheat' {...props} />
}

const Nut: React.FunctionComponent<SizeProps> = (props) => {
  return <rect fill='black' {...props} />
}

const Fret: React.FunctionComponent<SizeProps> = (props) => {
  return <rect fill='darkslategray' {...props} />
}

// TODO: rename--this clashes with built-in String function
const String: React.FunctionComponent<SizeProps> = (props) => {
  return <rect fill='#6d432f' {...props} />
}

const FretNumber: React.FC<{label: string}> = ({label}) => {
  return <text dominantBaseline='middle' textAnchor='end'>{label}&nbsp;</text>
}

const Translate: React.FunctionComponent<{x?: number, y?: number}> = ({
  x = 0, y = 0, children
}) => {
  return <g transform={translate(x, y)}>{children}</g>
}