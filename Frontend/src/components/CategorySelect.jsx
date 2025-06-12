import React from 'react';

export default function CategorySelect({ categories, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2 border"
        required
      >
        <option value="">Select a category</option>
        {categories.map(category => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>
      {value && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
          {React.createElement(
            categories.find(c => c.id === value)?.icon || null,
            { className: "w-5 h-5 text-gray-500" }
          )}
        </div>
      )}
    </div>
  );
}