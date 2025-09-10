import React from 'react';

const KpiCard = ({ title, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center">
        <div className={`w-4 h-4 rounded-full ${colorClasses[color]} mr-3`}></div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
