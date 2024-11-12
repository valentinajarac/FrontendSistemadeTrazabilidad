import { useState, useMemo } from 'react';

export function useTableFilter<T>(data: T[], searchKeys: (keyof T)[]) {
  const [filterValue, setFilterValue] = useState('');

  const filteredData = useMemo(() => {
    if (!filterValue) return data;

    return data.filter((item) =>
      searchKeys.some((key) => {
        const value = item[key];
        if (typeof value === 'string' || typeof value === 'number') {
          return String(value)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        return false;
      })
    );
  }, [data, filterValue, searchKeys]);

  return { filteredData, filterValue, setFilterValue };
}