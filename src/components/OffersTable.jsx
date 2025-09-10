import React from 'react';

const OffersTable = ({ 
  offers, 
  selectedOffers, 
  onSelectOffer, 
  onSelectAll,
  searchTerm,
  onEditOffer,
  onUpdateStatus,
  onUpdateResult,
  statuses = [],
  results = []
}) => {
  // Función para calcular días restantes
  const calcularDiasRestantes = (fechaEntrega, fechaRecepcion) => {
    if (!fechaEntrega || !fechaRecepcion) return 0;
    
    const fechaEntregaObj = new Date(fechaEntrega);
    const fechaRecepcionObj = new Date(fechaRecepcion);
    
    if (isNaN(fechaEntregaObj.getTime()) || isNaN(fechaRecepcionObj.getTime())) {
      return 0;
    }
    
    const hoy = new Date();
    const diffTime = fechaEntregaObj - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) return '-';
    return fechaObj.toLocaleDateString('es-ES');
  };

  // Función para obtener el color de la fila según el resultado
  const getRowColor = (resultado) => {
    switch (resultado) {
      case 'KO':
        return 'text-red-600';
      case 'OK':
        return 'text-green-600';
      case 'NO GO':
        return 'text-black';
      default:
        return 'text-gray-900';
    }
  };

  // Función para verificar si la fila debe parpadear
  const shouldBlink = (fechaEntrega, fechaRecepcion, estado) => {
    // Nuevo criterio: mientras esté EN PROCESO, siempre parpadea (independiente de fechas)
    return estado === 'EN PROCESO';
  };

  // Filtrar ofertas según el término de búsqueda
  const filteredOffers = offers.filter(offer => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      offer.numeroOferta.toLowerCase().includes(searchLower) ||
      offer.cliente.toLowerCase().includes(searchLower) ||
      offer.descripcion.toLowerCase().includes(searchLower)
    );
  });

  const allSelected = filteredOffers.length > 0 && filteredOffers.every(offer => selectedOffers.includes(offer.id));

  return (
    <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left w-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked, filteredOffers)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Nº Oferta
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                Descripción de la oferta
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Cliente
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                Cliente final
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                Enviado por
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Fecha recepción
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Fecha entrega
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Estado
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Resultado de la propuesta
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Ingresos estimados
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Días restantes
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {filteredOffers.map((offer) => {
              const diasRestantes = calcularDiasRestantes(offer.fechaEntrega, offer.fechaRecepcion);
              const debeParpadear = shouldBlink(offer.fechaEntrega, offer.fechaRecepcion, offer.estado);
              
              return (
                <tr
                  key={offer.id}
                  className={`hover:bg-gray-50 ${
                    debeParpadear ? 'animate-blink' : ''
                  } ${getRowColor(offer.resultado)}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedOffers.includes(offer.id)}
                      onChange={(e) => onSelectOffer(offer.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {offer.numeroOferta}
                  </td>
                  <td className="px-6 py-4 text-sm max-w-xs">
                    <div className="truncate" title={offer.descripcion}>
                      {offer.descripcion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {offer.cliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {offer.clienteFinal}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {offer.enviadoPor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatearFecha(offer.fechaRecepcion)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {formatearFecha(offer.fechaEntrega)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={offer.estado || 'EN PROCESO'}
                      onChange={(e) => onUpdateStatus && onUpdateStatus(offer.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
                    >
                      {(statuses.length ? statuses : ['EN PROCESO','ENTREGADA']).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={offer.resultado || 'VACÍO'}
                      onChange={(e) => onUpdateResult && onUpdateResult(offer.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded-md px-2 py-1 bg-white"
                    >
                      {(results.length ? results : ['VACÍO','OK','KO','NO GO']).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    €{(offer.ingresosEstimados || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {(() => {
                      const estado = (offer.estado || '').toUpperCase();
                      const resultado = (offer.resultado || '').toUpperCase();
                      if (estado.startsWith('ENTREGAD') || resultado === 'NO GO') {
                        return <span>-</span>;
                      }
                      return (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          diasRestantes < 0 
                            ? 'bg-red-100 text-red-800'
                            : diasRestantes <= 3
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {diasRestantes < 0 ? 'Vencida' : `${diasRestantes} días`}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => onEditOffer && onEditOffer(offer)}
                      className="px-3 py-1 text-blue-700 border border-blue-600 rounded-md hover:bg-blue-50"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OffersTable;
