// import React from 'react';

// const Visitors: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg p-2 shadow-sm mb-6">
//       <div className="text-sm font-medium px-2 py-1">Visters</div>
//       <div className="flex rounded-md overflow-hidden">
//         <div className="bg-purple-600 flex-[0.6] flex items-center justify-center text-white py-1">
//           <span className="font-medium mr-1">60%</span>
//           <span className="text-sm">Desktop</span>
//         </div>
//         <div className="bg-purple-400 flex-[0.38] flex items-center justify-center text-white py-1">
//           <span className="font-medium mr-1">38%</span>
//           <span className="text-sm">Mobile</span>
//         </div>
//         <div className="bg-purple-200 text-purple-800 flex-[0.02] flex items-center justify-center py-1">
//           <span className="font-medium mr-1">02%</span>
//           <span className="text-sm">Others</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Visitors;


import React from 'react';

const Visitors: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Visitors</h2>
      <div className="flex rounded-lg overflow-hidden">
        <div className="bg-purple-600 flex-[0.6] flex items-center justify-center text-white py-3">
          <span className="font-medium mr-1">60%</span>
          <span className="text-sm">Desktop</span>
        </div>
        <div className="bg-purple-400 flex-[0.38] flex items-center justify-center text-white py-3">
          <span className="font-medium mr-1">38%</span>
          <span className="text-sm">Mobile</span>
        </div>
        <div className="bg-purple-200 text-purple-800 flex-[0.02] flex items-center justify-center py-3">
          <span className="font-medium mr-1">02%</span>
          <span className="text-sm">Others</span>
        </div>
      </div>
    </div>
  );
};

export default Visitors;