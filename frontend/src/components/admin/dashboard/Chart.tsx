// import React from 'react';

// const Chart: React.FC = () => {
//   return (
//     <div className="relative bg-white rounded-lg p-4 shadow-sm h-80 mb-6">
//       {/* In a real application, you would use a charting library like Chart.js or Recharts */}
//       <div className="h-full w-full relative overflow-hidden">
//         {/* We would normally use a chart library here, this is just a placeholder */}
//         <div 
//           className="absolute inset-0 opacity-50" 
//           style={{
//             background: 'linear-gradient(to bottom, rgba(255, 99, 132, 0.5), transparent)',
//             clipPath: 'path("M0,100 Q50,30 100,70 T200,50 T300,80 T400,60 V100 H0 Z")'
//           }}
//         ></div>
//         <div 
//           className="absolute inset-0 opacity-50" 
//           style={{
//             background: 'linear-gradient(to bottom, rgba(54, 162, 235, 0.5), transparent)',
//             clipPath: 'path("M0,80 Q50,90 100,60 T200,80 T300,40 T400,60 V100 H0 Z")'
//           }}
//         ></div>
//       </div>
//       <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
//         <div>8,00,00</div>
//         <div>7,00,00</div>
//         <div>6,00,00</div>
//         <div>5,00,00</div>
//         <div>4,00,00</div>
//         <div>3,00,00</div>
//         <div>2,00,00</div>
//         <div>1,00,00</div>
//         <div>0</div>
//       </div>
//     </div>
//   );
// };

// export default Chart;


import React from 'react';

const Chart: React.FC = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
      <div className="h-64 bg-gradient-to-b from-purple-50 to-white rounded-lg">
        {/* Placeholder for a chart library */}
        <div className="h-full flex items-end justify-between px-4">
          <div className="w-8 bg-purple-500 rounded-t-lg" style={{ height: '60%' }}></div>
          <div className="w-8 bg-purple-400 rounded-t-lg" style={{ height: '80%' }}></div>
          <div className="w-8 bg-purple-300 rounded-t-lg" style={{ height: '40%' }}></div>
          <div className="w-8 bg-purple-200 rounded-t-lg" style={{ height: '70%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Chart;