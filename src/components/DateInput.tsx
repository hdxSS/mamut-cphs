'use client';

import { useState, useRef, useEffect } from 'react';

interface DateInputProps {
  value: string; // yyyy-mm-dd format
  onChange: (value: string) => void; // yyyy-mm-dd format
  required?: boolean;
  className?: string;
  name?: string;
}

export default function DateInput({ value, onChange, required, className, name }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert yyyy-mm-dd to dd/mm/yyyy for display
  useEffect(() => {
    if (value) {
      const [year, month, day] = value.split('-');
      setDisplayValue(`${day}/${month}/${year}`);
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits

    // Format as dd/mm/yyyy while typing
    if (input.length >= 2) {
      input = input.slice(0, 2) + '/' + input.slice(2);
    }
    if (input.length >= 5) {
      input = input.slice(0, 5) + '/' + input.slice(5);
    }
    if (input.length > 10) {
      input = input.slice(0, 10);
    }

    setDisplayValue(input);

    // Convert to yyyy-mm-dd when complete
    if (input.length === 10) {
      const [day, month, year] = input.split('/');
      if (day && month && year && year.length === 4) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          onChange(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
        }
      }
    }
  };

  const handleBlur = () => {
    // Validate and format on blur
    if (displayValue.length === 10) {
      const [day, month, year] = displayValue.split('/');
      if (day && month && year) {
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          const validDay = date.getDate().toString().padStart(2, '0');
          const validMonth = (date.getMonth() + 1).toString().padStart(2, '0');
          const validYear = date.getFullYear();
          setDisplayValue(`${validDay}/${validMonth}/${validYear}`);
          onChange(`${validYear}-${validMonth}-${validDay}`);
        }
      }
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      name={name}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder="dd/mm/yyyy"
      required={required}
      className={className}
      maxLength={10}
    />
  );
}
