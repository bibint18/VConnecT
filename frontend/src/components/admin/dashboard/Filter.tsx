// import React from 'react';
// // import { ChevronDown } from 'lucide-react';

// const Filter: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg shadow-sm mb-6">
//       <div className="p-3">
//         <span className="text-purple-600 font-medium">Filter</span>
//       </div>
//       <div className="p-3 pt-0">
//         <div className="flex justify-between mb-3">
//           <div className="flex flex-col">
//             <span className="text-xs text-gray-500">Start</span>
//             <div className="text-sm font-medium">22-10</div>
//           </div>
//           <div className="flex flex-col">
//             <span className="text-xs text-gray-500">End</span>
//             <div className="text-sm font-medium">22-10</div>
//           </div>
//         </div>
//         <button className="w-full bg-gray-100 text-gray-700 py-1 rounded text-sm">Apply</button>
//       </div>
//     </div>
//   );
// };

// export default Filter;


import React from 'react';

const Filter: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Filter</h2>
      <div className="flex justify-between mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Start</span>
          <div className="text-sm font-medium">22-10</div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">End</span>
          <div className="text-sm font-medium">22-10</div>
        </div>
      </div>
      <button className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
        Apply
      </button>
    </div>
  );
};

export default Filter;