import React from 'react';

const Tabs = ({ active, onChange }) => {
  const tabs = [
    { id: 'general', label: 'Información General' },
    { id: 'stats', label: 'Estadísticas' },
  ];

  return (
    <div className="border-b border-gray-200 mb-4">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`whitespace-nowrap py-2 px-3 border-b-2 font-medium text-sm ${
              active === t.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Tabs;


