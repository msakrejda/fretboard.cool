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
  fret: number;
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
  const smallestFretDistance = fretPos[fretPos.length - 1] - fretPos[fretPos.length - 2];
  const markerRadius = Math.max(1, (smallestFretDistance - 3) / 2);
  // TODO: fix positioning of open string markers
  const markerY = (fret: number):number => {
    if (fret === 0) {
      return -20;
    }
    // N.B.: need to map fret numbers to fret position indexes
    const prev = fret === 1 ? 0 : fretPos[fret - 2];
    const curr = fretPos[fret - 1];

    return (prev + curr) / 2
  }

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
          <Translate key={i} x={stringPos[marker.string]} y={markerY(marker.fret)}>
            <FretMarker marker={marker} radius={markerRadius}/>
          </Translate>
        ))}
      </Translate>
    </svg>
  )
}

const FretMarker: React.FunctionComponent<{ marker: Marker, radius: number }> = ({marker, radius}) => {
  return (
    <>
      <circle r={radius} fill='white' stroke='black' strokeWidth={1} />
      <text dominantBaseline='middle' textAnchor='middle'>{marker.label}</text>
    </>
  );
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