import React from 'react';

const OffersTable = ({ 
  offers, 
  selectedOffers, 
  onSelectOffer, 
  onSelectAll,
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
    return false; // Desactivamos el parpadeo
  };

  const allSelected = offers.length > 0 && offers.every(offer => selectedOffers.includes(offer.id));

  return (
    <div className="w-full">
      <div className="max-h-[60vh] overflow-y-auto">
        <table className="w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="px-2 py-2 text-center w-8">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked, offers)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Nº Oferta
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                Descripción
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Cliente
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                Cliente final
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Enviado por
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Fecha recep.
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Fecha entrega
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Estado
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                Resultado
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Ingresos
              </th>
              <th className="px-2 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                Días rest.
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-sm">
            {offers.map((offer) => {
              const diasRestantes = calcularDiasRestantes(offer.fechaEntrega, offer.fechaRecepcion);
              const debeParpadear = shouldBlink(offer.fechaEntrega, offer.fechaRecepcion, offer.estado);
              
              return (
                <tr
                  key={offer.id}
                  className={`hover:bg-gray-50 ${
                    debeParpadear ? 'animate-blink' : ''
                  } ${getRowColor(offer.resultado)} ${
                    (offer.estado || '').toUpperCase() === 'EN PROCESO' ? 'bg-yellow-50' : ''
                  }`}
                  onDoubleClick={() => onEditOffer && onEditOffer(offer)}
                >
                  <td className="px-2 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOffers.includes(offer.id)}
                      onChange={(e) => onSelectOffer(offer.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-2 py-2 text-center text-sm font-medium">
                    <div className="flex items-center gap-1">
                      <span className="truncate">{offer.numeroOferta}</span>
                      {offer.docsCount > 0 && (
                        <span title={`${offer.docsCount} documento(s)`} className="inline-flex items-center text-[9px] px-1 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200">DOCS</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    <div className="truncate" title={offer.descripcion}>
                      {offer.descripcion}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    <div className="truncate" title={offer.cliente}>
                      {offer.cliente}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    <div className="truncate" title={offer.clienteFinal}>
                      {offer.clienteFinal}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    <div className="truncate" title={offer.enviadoPor}>
                      {offer.enviadoPor}
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    {formatearFecha(offer.fechaRecepcion)}
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    {formatearFecha(offer.fechaEntrega)}
                  </td>
                  <td className="px-2 py-2 text-center">
                    <select
                      value={offer.estado || 'EN PROCESO'}
                      onChange={(e) => onUpdateStatus && onUpdateStatus(offer.id, e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-1 py-1 bg-white text-center"
                    >
                      {(statuses.length ? statuses : ['EN PROCESO','ENTREGADA']).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-center">
                    <select
                      value={offer.resultado || 'VACÍO'}
                      onChange={(e) => onUpdateResult && onUpdateResult(offer.id, e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-1 py-1 bg-white text-center"
                    >
                      {(results.length ? results : ['VACÍO','OK','KO','NO GO']).map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    €{(offer.ingresosEstimados || 0).toLocaleString()}
                  </td>
                  <td className="px-2 py-2 text-center text-sm">
                    {(() => {
                      const estado = (offer.estado || '').toUpperCase();
                      const resultado = (offer.resultado || '').toUpperCase();
                      if (estado.startsWith('ENTREGAD') || resultado === 'NO GO') {
                        return <span>-</span>;
                      }
                      return (
                        <span className={`inline-flex px-1 py-0.5 text-xs font-semibold rounded-full ${
                          diasRestantes < 0 
                            ? 'bg-red-100 text-red-800'
                            : diasRestantes <= 3
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {diasRestantes < 0 ? 'Vencida' : `${diasRestantes}d`}
                        </span>
                      );
                    })()}
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
