import React from 'react';
import { motion } from 'framer-motion';
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <div className="pagination mt-4 sm:mt-6 flex justify-center items-center gap-2">
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base ${
          currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        variants={buttonVariants}
        whileHover={currentPage !== 1 ? 'hover' : undefined}
        whileTap={currentPage !== 1 ? 'tap' : undefined}
      >
        Previous
      </motion.button>
      <span className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base">
        Page {currentPage} of {totalPages}
      </span>
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 sm:px-4 py-1 sm:py-2 rounded-md text-sm sm:text-base ${
          currentPage === totalPages ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
        variants={buttonVariants}
        whileHover={currentPage !== totalPages ? 'hover' : undefined}
        whileTap={currentPage !== totalPages ? 'tap' : undefined}
      >
        Next
      </motion.button>
    </div>
  );
};

export default Pagination;