


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