
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Search, SortAsc } from 'lucide-react';

interface RewardFilterProps {
  sortOptions: { label: string; value: string }[];
  filterOptions: { label: string; value: string }[];
  onFilterChange: (search: string, sort: string, filter: string) => void;
}

const RewardFilter: React.FC<RewardFilterProps> = ({ sortOptions, filterOptions, onFilterChange }) => {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState(sortOptions[0]?.value || '');
  const [filter, setFilter] = useState(filterOptions[0]?.value || '');

  const debounce = useCallback(
    <T extends (...args: any[]) => void>(fn: T, delay: number) => {
      let timeout: ReturnType<typeof setTimeout>;
      return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
      };
    },
    []
  );

  const handleFilterChange = useCallback(() => {
    onFilterChange(search, sort, filter);
  }, [search, sort, filter, onFilterChange]);

  const debouncedFilterChange = useMemo(
    () => debounce(handleFilterChange, 500),
    [handleFilterChange]
  );

  useEffect(() => {
    debouncedFilterChange();
  }, [search, sort, filter, debouncedFilterChange]); 

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4 bg-gray-900 rounded-xl p-4 border border-pink-500/20">
      <div className="relative w-full sm:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search rewards..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
      </div>
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <SortAsc className="w-5 h-5 text-gray-400" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-gray-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default RewardFilter;