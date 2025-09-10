import React from 'react';

const KpiCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 w-full max-w-xs mx-auto">
      <div className="text-center">
        <h3 className="text-xs font-medium text-gray-500 tracking-wide">
          {title}
        </h3>
        <p className="text-2xl font-semibold text-gray-900 mt-1">
          {value}
        </p>
      </div>
    </div>
  );
};

export default KpiCard;
