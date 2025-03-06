// import React from 'react';
// import Chart from './Chart';
// import StatsCard from './Stats-card';
// import Visitors from './Visitors';
// import Filter from './Filter';
// import DownloadReport from './Download-report';

// const DashboardContent: React.FC = () => {
//   return (
//     <div className="flex p-4 bg-gray-50">
//       <div className="flex-1 mr-4">
//         <Chart />
//         <Visitors />
//       </div>
//       <div className="w-72">
//         <StatsCard title="Total Premium" value="₹ 5,55,000" />
        
//         <div className="flex gap-4 mb-4">
//           <StatsCard title="user Dropped" value="2,500" />
//           <StatsCard 
//             title="new Premium" 
//             value="1033" 
//             gradient={true} 
//             gradientColors="from-purple-600 to-indigo-700" 
//           />
//         </div>
        
//         <div className="flex gap-4 mb-4">
//           <StatsCard title="Total Users" value="3033" />
//           <StatsCard 
//             title="new Users" 
//             value="103" 
//             gradient={true} 
//             gradientColors="from-purple-600 to-indigo-700" 
//           />
//         </div>
        
//         <div className="flex gap-4 mb-4">
//           <StatsCard title="Not Renewed" value="500" />
//           <StatsCard 
//             title="total Premium" 
//             value="2222" 
//             gradient={true} 
//             gradientColors="from-purple-600 to-indigo-700" 
//           />
//         </div>
        
//         <Filter />
//         <DownloadReport />
//       </div>
//     </div>
//   );
// };

// export default DashboardContent;




import React from 'react';
import Chart from './Chart';
import StatsCard from './Stats-card';
import Visitors from './Visitors';
import Filter from './Filter';
import DownloadReport from './Download-report';

const DashboardContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        <Chart />
        <Visitors />
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        <StatsCard title="Total Premium" value="₹ 5,55,000" />
        <div className="grid grid-cols-2 gap-4">
          <StatsCard title="User Dropped" value="2,500" />
          <StatsCard 
            title="New Premium" 
            value="1033" 
            gradient={true} 
            gradientColors="from-purple-600 to-indigo-700" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatsCard title="Total Users" value="3033" />
          <StatsCard 
            title="New Users" 
            value="103" 
            gradient={true} 
            gradientColors="from-purple-600 to-indigo-700" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <StatsCard title="Not Renewed" value="500" />
          <StatsCard 
            title="Total Premium" 
            value="2222" 
            gradient={true} 
            gradientColors="from-purple-600 to-indigo-700" 
          />
        </div>
        <Filter />
        <DownloadReport />
      </div>
    </div>
  );
};

export default DashboardContent;