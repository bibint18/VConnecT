import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
}

export default function AdminSearchBar({ searchTerm, setSearchTerm }: SearchBarProps) {
  return (
    <div className="relative max-w-md w-full">
      <input
        type="text"
        placeholder="Search users here"
        className="w-full pl-3 pr-10 py-3 rounded-full bg-white shadow-sm focus:ring-2 focus:ring-orange-300 outline-none transition-all duration-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-500" />
    </div>
  );
}