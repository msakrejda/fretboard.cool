import React from 'react';

import "./App.css";

export const FretCountPicker: React.FC<{value: number, onChange: (count: number) => void}> = ({value, onChange}) => {
  const handleFretCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.currentTarget.value, 10));
  }
  return <div className="FretCountPicker">
    over <label><input type="number" min={3} max={15} value={value} onChange={handleFretCountChange} /> frets</label> and
  </div>
}