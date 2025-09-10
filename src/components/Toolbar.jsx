import React from 'react';

const Toolbar = ({ 
  onCreateOffer, 
  onDeleteSelected, 
  onCreateFolder, 
  selectedOffers,
  onExportExcel,
  onFilterInProgress,
  isFiltered
}) => {

  return (
    <div className="flex flex-col space-y-3 w-full">
      <div className="flex items-center flex-wrap gap-3 justify-end w-full">

        {/* Botón Exportar Excel */}
        <button
          onClick={onExportExcel}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16" />
          </svg>
          Exportar Excel
        </button>

        {/* Botón Filtrar EN PROCESO */}
        <button
          onClick={onFilterInProgress}
          className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            isFiltered
              ? 'border-yellow-300 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 focus:ring-yellow-500'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
          </svg>
          {isFiltered ? 'Ver Todas' : 'Solo EN PROCESO'}
        </button>
      </div>


      <div className="flex items-center flex-wrap gap-3">
        {/* Botón Crear Nueva Oferta */}
        <button
          onClick={onCreateOffer}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Nueva Oferta
        </button>

        {/* Botón Eliminar Seleccionadas */}
        <button
          onClick={onDeleteSelected}
          disabled={selectedOffers.length === 0}
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            selectedOffers.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
          }`}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar Seleccionadas ({selectedOffers.length})
        </button>

        {/* Botón Crear Carpeta */}
        <button
          onClick={onCreateFolder}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          Crear Carpeta
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
