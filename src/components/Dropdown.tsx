import React from 'react';

type DropdownOption = string;

export const Dropdown: React.FC<{value:string, options: DropdownOption[], onChange: (newValue: string) => void}> = ({value, options, onChange}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    onChange(e.currentTarget.value);
  }
  return (
    <div>
      <select value={value} onChange={handleChange}>
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}