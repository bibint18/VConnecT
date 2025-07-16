import { Dispatch, SetStateAction } from "react";
import { BarChart2 } from "lucide-react";

interface SortFilterProps {
  sortOption: string;
  setSortOption: Dispatch<SetStateAction<string>>;
}

export default function SortFilter({ sortOption, setSortOption }: SortFilterProps) {
  return (
    <div className="flex items-center gap-6 p-2 bg-white rounded-full shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2 text-gray-600 font-medium cursor-pointer hover:bg-orange-500 hover:text-white rounded-full transition-all duration-300">
        <BarChart2 className="h-5 w-5" />
        <span>Sort By</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2">
        <select
          className="bg-transparent border-none text-gray-800 text-base cursor-pointer focus:outline-none"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="A-Z">A-Z</option>
          <option value="Z-A">Z-A</option>
          <option value="recent">Recently Joined</option>
        </select>
      </div>
    </div>
  );
}