import React from 'react';

import { SelectionOption } from './types';

import "./App.css";

export const Dropdown: React.FC<{
  value:string,
  options: SelectionOption[],
  onChange: (newValue: string) => void,
}> = ({value, options, onChange}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.currentTarget.value);
  }
  const valuesAndLabels = options.map(o => {
    return typeof o === "string" ? [ o, o ] : [ o.value, o.label ]
  })
  return (
    <select className="Dropdown" value={value} onChange={handleChange}>
      {valuesAndLabels.map(([ value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  )
}
