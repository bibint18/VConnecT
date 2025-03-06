// import React from 'react';

// interface StatsCardProps {
//   title: string;
//   value: string | number;
//   gradient?: boolean;
//   gradientColors?: string;
// }

// const StatsCard: React.FC<StatsCardProps> = ({ 
//   title, 
//   value, 
//   gradient = false,
//   gradientColors = 'from-purple-500 to-indigo-600'
// }) => {
//   return (
//     <div className={`rounded-lg ${gradient ? `bg-gradient-to-br ${gradientColors} text-white` : 'bg-white'} p-4 shadow-sm mb-4`}>
//       <div className="flex flex-col items-center justify-center">
//         <h3 className={`text-sm font-medium mb-1 ${gradient ? 'text-white text-opacity-80' : 'text-gray-500'}`}>{title}</h3>
//         <p className="text-2xl font-bold">{value}</p>
//       </div>
//     </div>
//   );
// };

// export default StatsCard;


import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  gradient?: boolean;
  gradientColors?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  gradient = false,
  gradientColors = 'from-purple-500 to-indigo-600'
}) => {
  return (
    <div className={`rounded-lg ${gradient ? `bg-gradient-to-br ${gradientColors} text-white` : 'bg-white'} p-6 shadow-sm`}>
      <div className="flex flex-col items-center justify-center">
        <h3 className={`text-sm font-medium mb-2 ${gradient ? 'text-white text-opacity-80' : 'text-gray-500'}`}>{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;