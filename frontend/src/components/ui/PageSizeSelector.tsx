import React from 'react';

interface PageSizeSelectorProps {
  currentSize: number;
  onSizeChange: (size: number) => void;
  minSize?: number;
  maxSize?: number;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  currentSize,
  onSizeChange,
  minSize = 5,
  maxSize = 50,
}) => {
  const pageSizeOptions = [5, 10, 20, 30, 50].filter(size => size >= minSize && size <= maxSize);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="page-size" className="text-sm font-medium text-gray-700">
        Items per page:
      </label>
      <select
        id="page-size"
        value={currentSize}
        onChange={e => onSizeChange(parseInt(e.target.value, 10))}
        className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        aria-label="Select number of items per page"
      >
        {pageSizeOptions.map(size => (
          <option key={size} value={size}>
            {size} items
          </option>
        ))}
      </select>
    </div>
  );
};
