import { Dispatch, SetStateAction } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

export default function AdminPagination({ page, setPage, totalPages }: PaginationProps) {
  return (
    <div className="flex justify-center gap-2 mt-8">
      <button
        disabled={page === 1}
        onClick={() => setPage((prev) => prev - 1)}
        className="px-4 py-2 w-[100px] rounded-full bg-orange-300 text-orange-800 font-medium hover:bg-orange-600 hover:text-orange-900 transition-all duration-300 disabled:bg-gray-500 disabled:text-gray-600 "
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="px-3 py-2">{page}</span>
      <button
        disabled={page >= totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="px-4 py-2 w-[100px] rounded-full bg-orange-300 text-orange-800 font-medium hover:bg-orange-600 hover:text-orange-900 transition-all duration-300 disabled:bg-gray-200 disabled:text-gray-600"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}