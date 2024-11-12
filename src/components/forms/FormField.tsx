import React from 'react';
import { ValidationError } from '../../types';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  error?: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  options,
  min,
  max,
  pattern,
  placeholder,
  disabled = false
}) => {
  const inputClasses = `
    w-full px-3 py-2 rounded-md border
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring focus:ring-red-200' 
      : 'border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200'}
    disabled:bg-gray-100 disabled:cursor-not-allowed
  `;

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          disabled={disabled}
          required={required}
        >
          <option value="">Seleccione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={inputClasses}
          required={required}
          min={min}
          max={max}
          pattern={pattern}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};