// import React from 'react';
// import { Download, ChevronDown } from 'lucide-react';

// const DownloadReport: React.FC = () => {
//   return (
//     <div className="flex items-center bg-gray-200 rounded-lg overflow-hidden">
//       <div className="py-2 px-4 text-gray-700 text-sm">
//         <span>Download Report</span>
//       </div>
//       <div className="flex items-center gap-1 py-2 px-3 bg-gray-300 text-gray-700 text-sm">
//         <span>PDF</span>
//         <ChevronDown className="w-4 h-4" />
//       </div>
//       <button className="p-2 bg-black text-white">
//         <Download className="w-4 h-4" />
//       </button>
//     </div>
//   );
// };

// export default DownloadReport;



import React from 'react';
import { Download, ChevronDown } from 'lucide-react';

const DownloadReport: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Download Report</h2>
      <div className="flex items-center bg-gray-100 rounded-lg overflow-hidden">
        <div className="py-2 px-4 text-gray-700 text-sm">
          <span>Download Report</span>
        </div>
        <div className="flex items-center gap-1 py-2 px-3 bg-gray-200 text-gray-700 text-sm">
          <span>PDF</span>
          <ChevronDown className="w-4 h-4" />
        </div>
        <button className="p-2 bg-purple-600 text-white hover:bg-purple-700 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DownloadReport;