import React from 'react';
import { format } from 'date-fns';

export default function DatePicker({ value, onChange }) {
  return (
    <input
      type="datetime-local"
      value={format(new Date(value), "yyyy-MM-dd'T'HH:mm")}
      onChange={(e) => onChange(new Date(e.target.value).toISOString())}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
    />
  );
}