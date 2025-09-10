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
      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
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
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Acciones</th>
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
                  onDoubleClick={() => onEditOffer && onEditOffer(offer)}
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
                    <div className="flex items-center gap-2">
                      <span>{offer.numeroOferta}</span>
                      {offer.docsCount > 0 && (
                        <span title={`${offer.docsCount} documento(s)`} className="inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">DOCS</span>
                      )}
                    </div>
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
                  <td className="px-3 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center gap-1">
                      <button title="Abrir"
                        className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                        onClick={() => onEditOffer && onEditOffer(offer)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      </button>
                      {offer.docsCount>0 && (
                        <a title="Ver documentos" href="#" className="w-8 h-8 inline-flex items-center justify-center rounded-full bg-violet-50 text-violet-700 hover:bg-violet-100"
                          onClick={(e)=>{e.preventDefault(); onEditOffer && onEditOffer(offer);}}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v10l9-5-9-5z"/></svg>
                        </a>
                      )}
                    </div>
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
