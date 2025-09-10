import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const ExportForm = ({ offers, onClose }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const inRange = (offer) => {
    const rec = offer.fechaRecepcion || offer.fecha_recepcion;
    if (!fromDate && !toDate) return true;
    const d = rec ? new Date(rec) : null;
    if (!d) return false;
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;
    return true;
  };

  const handleExport = () => {
    const rows = (offers || []).filter(inRange).map((o) => ({
      'Nº Oferta': o.numeroOferta || o.numero_oferta,
      'Descripción': o.descripcion,
      'Cliente': o.cliente,
      'Cliente Final': o.clienteFinal || o.cliente_final,
      'Enviado por': o.enviadoPor || o.enviado_por,
      'Fecha Recepción': o.fechaRecepcion || o.fecha_recepcion,
      'Fecha Entrega': o.fechaEntrega || o.fecha_entrega,
      'Estado': o.estado,
      'Resultado': o.resultado,
      'Ingresos': o.ingresosEstimados || o.ingresos_estimados,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ofertas');
    XLSX.writeFile(wb, 'ofertas.xlsx');
    onClose();
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha desde</label>
          <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha hasta</label>
          <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md bg-white">Cancelar</button>
        <button onClick={handleExport} className="px-4 py-2 bg-blue-600 text-white rounded-md">Exportar</button>
      </div>
    </div>
  );
};

export default ExportForm;


