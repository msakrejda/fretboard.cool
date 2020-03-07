import React from 'react';

type DropdownOption = string | {
  label: string;
  value: string;
};

export const Dropdown: React.FC<{
  value:string,
  options: DropdownOption[],
  onChange: (newValue: string) => void,
}> = ({value, options, onChange}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.currentTarget.value);
  }
  const valuesAndLabels = options.map(o => {
    return typeof o === "string" ? [ o, o ] : [ o.value, o.label ]
  })
  return (
    <div>
      <select value={value} onChange={handleChange}>
        {valuesAndLabels.map(([ value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
