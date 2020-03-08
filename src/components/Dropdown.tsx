import React from 'react';

import { SelectionOption } from './types';

import "./App.css";

export const Dropdown: React.FC<{
  label?: string,
  value: string,
  options: SelectionOption[],
  onChange: (newValue: string) => void,
}> = ({label, value, options, onChange}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.currentTarget.value);
  }
  const valuesAndLabels = options.map(o => {
    return typeof o === "string" ? [ o, o ] : [ o.value, o.label ]
  })
  return (
    <div className="Dropdown">
      <label className="FormLabel">
        {label}
        <select value={value} onChange={handleChange}>
          {valuesAndLabels.map(([ value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
