import React from 'react';

const colorMap = {
  blue: 'bg-blue-50 text-blue-700',
  green: 'bg-green-50 text-green-700',
  yellow: 'bg-yellow-50 text-yellow-700',
  gray: 'bg-gray-50 text-gray-700',
};

const KpiCard = ({ title, value, tone = 'blue' }) => {
  const toneClasses = colorMap[tone] || colorMap.blue;
  return (
    <div className={`rounded-xl shadow-sm p-4 border border-gray-200 w-full max-w-xs mx-auto ${toneClasses}`}>
      <div className="text-center">
        <h3 className="text-xs font-medium tracking-wide opacity-80">{title}</h3>
        <p className="text-2xl font-semibold mt-0.5">{value}</p>
      </div>
    </div>
  );
};

export default KpiCard;
