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
  return (
    <input
      type="date"
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className={className}
    />
  );
}
