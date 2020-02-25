import React from 'react';

import { scaleLength, fretPositions, stringPositions } from '../util';
import { Note } from '../theory/note';
import { Translate } from '../svg/Translate';

import './FretboardChart.css';

type SizeProps = {
  width: number;
  height: number;
}

export type Marker = {
  string: number;
  fret: number;
  label: string;
  note: Note;
  fill: string;
}

export const FretboardChart: React.FunctionComponent<SizeProps & {
  markers: Marker[],
  tuning: string[],
  fretCount: number,
  onMarkerClick: (marker: Marker) => void,
}> = ({
  width,
  height,
  tuning,
  fretCount,
  markers,
  onMarkerClick,
}) => {
  const numberedFrets = [ 3, 5, 7, 9, 12 ].filter(f => f <= fretCount);

  const minMargin = 20;
  const bottomMargin = 10;
  const topMargin = 30;
  const maxFretboardWidth = tuning.length * 30;
  const fretboardSize = {
    width: Math.min(width - 2 * minMargin, maxFretboardWidth),
    height: height - topMargin - bottomMargin,
  }
  const leftMargin = (width - fretboardSize.width) / 2;

  const nutWidth = 4;
  const fretWidth = 2;
  const stringWidth = 2;

  const scaleLen = scaleLength(fretCount, fretboardSize.height);

  const fretPos = fretPositions(fretCount, scaleLen, fretWidth);
  const stringPos = stringPositions(tuning.length, fretboardSize.width, stringWidth);
  const smallestFretDistance = fretPos[fretPos.length - 1] - fretPos[fretPos.length - 2];

  const openStringMarkerOffset = topMargin - 15;
  const markerRadius = Math.max(1, 
    Math.min(
      (smallestFretDistance - fretWidth) / 2,
      (stringPos[1] - stringPos[0] - stringWidth) / 2,
      (topMargin - openStringMarkerOffset), // distance to nut
      openStringMarkerOffset // distance to top of chart
    ) - 1 // we want at least one pixel clearance from any of the above
  );
  const markerX = (m: Marker): number => stringPos[m.string]
  const markerY = (m: Marker):number => {
    const fret = m.fret;
    if (fret === 0) {
      return -openStringMarkerOffset;
    }
    // N.B.: need to map fret numbers to fret position indexes
    const prev = fret === 1 ? 0 : fretPos[fret - 2];
    const curr = fretPos[fret - 1];

    return (prev + curr) / 2 + (fretWidth / 2)
  }

  return (
    <svg width={width} height={height}>
      <Translate x={leftMargin} y={topMargin}>
        <Fretboard {...fretboardSize} />
        <Nut width={fretboardSize.width} height={nutWidth} />
        {fretPos.map((yOffset) => (
          <Translate key={yOffset} y={yOffset}>
            <Fret width={fretboardSize.width} height={fretWidth} />
          </Translate>
        ))}
        {stringPos.map(xOffset => (
          <Translate key={xOffset} x={xOffset}>
            <String width={stringWidth} height={fretboardSize.height} />
          </Translate>
        ))}
        {numberedFrets.map(n => (
          <Translate key={n} y={fretPos[n - 1]}>
            <FretNumber label={n.toString()} />
          </Translate>
        ))}
        {markers.map((marker, i) => (
          <Translate key={i} x={markerX(marker)} y={markerY(marker)}>
            <FretMarker marker={marker} radius={markerRadius} onClick={onMarkerClick}/>
          </Translate>
        ))}
      </Translate>
    </svg>
  )
}

export const FretMarker: React.FunctionComponent<{ marker: Marker, radius: number, onClick: (marker: Marker) => void }> = ({marker, radius, onClick}) => {
  const handleMarkerClick = () => {
    onClick(marker)
  }
  return (
    <>
      <circle className='FretMarker' r={radius} fill={marker.fill} stroke='black' strokeWidth={1} onClick={handleMarkerClick} />
      <text dominantBaseline='middle' textAnchor='middle' pointerEvents='none'>{marker.label}</text>
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

// TODO: rename--this shadows built-in String function
const String: React.FunctionComponent<SizeProps> = (props) => {
  return <rect fill='#6d432f' {...props} />
}

const FretNumber: React.FC<{label: string}> = ({label}) => {
  return <text dominantBaseline='middle' textAnchor='end'>{label}&nbsp;</text>
}
