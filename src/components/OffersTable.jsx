import React from 'react';

const OffersTable = ({ 
  offers, 
  selectedOffers, 
  onSelectOffer, 
  onSelectAll,
  searchTerm 
}) => {
  // Función para calcular días restantes
  const calcularDiasRestantes = (fechaEntrega, fechaRecepcion) => {
    const fechaEntregaObj = new Date(fechaEntrega);
    const fechaRecepcionObj = new Date(fechaRecepcion);
    const hoy = new Date();
    const diffTime = fechaEntregaObj - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Función para formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES');
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
  const shouldBlink = (fechaEntrega, fechaRecepcion) => {
    const diasRestantes = calcularDiasRestantes(fechaEntrega, fechaRecepcion);
    return diasRestantes <= 3 && diasRestantes >= 0;
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
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => onSelectAll(e.target.checked, filteredOffers)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nº Oferta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción de la oferta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente final
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Enviado por
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha recepción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha entrega
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resultado de la propuesta
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ingresos estimados
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Días restantes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOffers.map((offer) => {
              const diasRestantes = calcularDiasRestantes(offer.fechaEntrega, offer.fechaRecepcion);
              const debeParpadear = shouldBlink(offer.fechaEntrega, offer.fechaRecepcion);
              
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      offer.estado === 'ENTREGADA' 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {offer.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {offer.resultado}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    €{offer.ingresosEstimados.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      diasRestantes < 0 
                        ? 'bg-red-100 text-red-800'
                        : diasRestantes <= 3
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {diasRestantes < 0 ? 'Vencida' : `${diasRestantes} días`}
                    </span>
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
