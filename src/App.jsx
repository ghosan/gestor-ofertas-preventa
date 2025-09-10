import React, { useState, useEffect } from 'react';
import KpiCard from './components/KpiCard';
import SearchBar from './components/SearchBar';
import Toolbar from './components/Toolbar';
import OffersTable from './components/OffersTable';
import ExportForm from './components/ExportForm';
import { offersService, comboService } from './lib/supabase';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

function App() {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffers, setSelectedOffers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newOffer, setNewOffer] = useState({
    numeroOferta: '',
    descripcion: '',
    cliente: '',
    clienteFinal: '',
    enviadoPor: '',
    fechaRecepcion: '',
    fechaEntrega: '',
    estado: 'EN PROCESO',
    resultado: 'VACÍO',
    ingresosEstimados: 0
  });
  const [editOffer, setEditOffer] = useState(null);
  const [clients, setClients] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [results, setResults] = useState([]);
  const [showExport, setShowExport] = useState(false);

  // Cargar datos iniciales desde Supabase
  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    // Cargar combos
    loadCombos();
  }, []);

  const loadCombos = async () => {
    try {
      setClients(await comboService.getClients());
      const sellersFromDb = await comboService.getSellers();
      if (sellersFromDb && sellersFromDb.length) {
        setSellers(sellersFromDb);
      } else {
        // Fallback: deducir desde ofertas existentes
        const dedup = Array.from(new Set(offers.map(o => o.enviadoPor || o.enviado_por).filter(Boolean)));
        setSellers(dedup);
      }
      setStatuses(await comboService.getStatuses());
      setResults(await comboService.getProposalResults());
    } catch (e) {
      console.error('Error cargando combos', e);
    }
  };

  const loadOffers = async () => {
    try {
      const data = await offersService.getAllOffers();
      setOffers(data);
    } catch (error) {
      console.error('Error loading offers:', error);
      // Si hay error, cargar datos de ejemplo
      setOffers([
        {
          id: 1,
          numeroOferta: "OF-2024-001",
          descripcion: "Sistema de gestión empresarial completo",
          cliente: "TechCorp Solutions",
          clienteFinal: "TechCorp Solutions",
          enviadoPor: "Juan Pérez",
          fechaRecepcion: "2024-01-15",
          fechaEntrega: "2024-02-15",
          estado: "EN PROCESO",
          resultado: "OK",
          ingresosEstimados: 45000
        }
      ]);
    }
  };

  // Calcular KPIs
  const totalOfertas = offers.length;
  const ofertasGanadas = offers.filter(offer => offer.resultado === 'OK').length;

  // Funciones de búsqueda
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  // Funciones de selección
  const handleSelectOffer = (offerId, isSelected) => {
    if (isSelected) {
      setSelectedOffers([...selectedOffers, offerId]);
    } else {
      setSelectedOffers(selectedOffers.filter(id => id !== offerId));
    }
  };

  const handleSelectAll = (isSelected, filteredOffers) => {
    if (isSelected) {
      const allIds = filteredOffers.map(offer => offer.id);
      setSelectedOffers([...new Set([...selectedOffers, ...allIds])]);
    } else {
      const filteredIds = filteredOffers.map(offer => offer.id);
      setSelectedOffers(selectedOffers.filter(id => !filteredIds.includes(id)));
    }
  };

  // Funciones de toolbar
  const handleCreateOffer = async () => {
    setEditOffer(null);
    await loadCombos();
    setShowModal(true);
  };

  const handleDeleteSelected = async () => {
    if (selectedOffers.length > 0) {
      if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedOffers.length} oferta(s)?`)) {
        try {
          await offersService.deleteOffers(selectedOffers);
          setOffers(offers.filter(offer => !selectedOffers.includes(offer.id)));
          setSelectedOffers([]);
        } catch (error) {
          console.error('Error deleting offers:', error);
          alert('Error al eliminar las ofertas');
        }
      }
    }
  };

  const handleCreateFolder = () => {
    alert('Función de crear carpeta no implementada (placeholder)');
  };

  // Función para cargar archivos Excel/CSV
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = e.target.result;

      // Helpers
      const normalize = (s) =>
        (s || '')
          .toString()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .trim()
          .replace(/\s+/g, ' ');

      const excelDateToISO = (val) => {
        if (!val) return '';
        if (typeof val === 'number') {
          const d = XLSX.SSF.parse_date_code(val);
          if (!d) return '';
          const mm = String(d.m).padStart(2, '0');
          const dd = String(d.d).padStart(2, '0');
          return `${d.y}-${mm}-${dd}`;
        }
        // cadenas tipo 15/02/2024 o 2024-02-15
        const partsSlash = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(val);
        if (partsSlash) {
          const [d, m, y] = val.split('/');
          const yy = y.length === 2 ? `20${y}` : y;
          return `${yy}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        }
        return val; // ya ISO
      };

      const mapRow = (row, idx) => {
        // Normalizamos claves del row
        const entries = Object.entries(row).map(([k, v]) => [normalize(k), v]);
        const obj = Object.fromEntries(entries);
        const get = (...keys) => {
          for (const k of keys) {
            const nk = normalize(k);
            if (obj.hasOwnProperty(nk)) return obj[nk];
          }
          return undefined;
        };

        const numero = get('nº oferta','no oferta','numero oferta','numerooferta');
        const descripcion = get('descripcion','descripción');
        const cliente = get('cliente');
        const clienteFinal = get('cliente final','clientefinal') || cliente;
        const enviadoPor = get('enviado por','enviadopor');
        const fechaRecepcion = excelDateToISO(get('fecha recepcion','fecha recepción','fecharecepcion'));
        const fechaEntrega = excelDateToISO(get('fecha entrega','fechaentrega'));
        const estado = (get('estado') || 'EN PROCESO').toString().toUpperCase();
        const resultado = (get('resultado') || 'VACÍO').toString().toUpperCase();
        const ingresos = parseInt(get('ingresos','ingresosestimados') || '0');

        return {
          numeroOferta: (numero || '').toString(),
          descripcion: descripcion || '',
          cliente: cliente || '',
          clienteFinal,
          enviadoPor: enviadoPor || '',
          fechaRecepcion: fechaRecepcion || '',
          fechaEntrega: fechaEntrega || '',
          estado,
          resultado,
          ingresosEstimados: isNaN(ingresos) ? 0 : ingresos,
        };
      };

      const upsertAll = async (rows) => {
        const created = [];
        for (const r of rows) {
          const payload = {
            ...r,
            // Generar número si viene vacío
            numeroOferta: r.numeroOferta && r.numeroOferta.trim() ? r.numeroOferta : generateOfferNumber(r.fechaRecepcion, offers.length + created.length),
          };
          const saved = await offersService.createOffer(payload);
          created.push(saved);
        }
        setOffers([...created, ...offers]);
      };

      if (file.name.endsWith('.csv')) {
        Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
          complete: async (results) => {
            const processed = results.data.map(mapRow);
            await upsertAll(processed);
          }
        });
      } else {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        const processed = jsonData.map(mapRow);
        upsertAll(processed);
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // Generar número de oferta 001.m.yy
  const generateOfferNumber = (fechaRecepcion, existingCount = offers.length) => {
    const fecha = fechaRecepcion ? new Date(fechaRecepcion) : new Date();
    const month = fecha.getMonth() + 1; // 1-12
    const year = fecha.getFullYear() % 100; // dos dígitos
    const order = (existingCount + 1).toString().padStart(3, '0');
    return `${order}.${month}.${year}`;
  };

  // Guardar (crear o editar) oferta
  const handleSaveOffer = async () => {
    if (newOffer.descripcion && newOffer.cliente) {
      try {
        const payload = {
          ...newOffer,
          numeroOferta: editOffer ? newOffer.numeroOferta : generateOfferNumber(newOffer.fechaRecepcion, offers.length),
          ingresosEstimados: parseInt(newOffer.ingresosEstimados)
        };

        if (editOffer) {
          const updated = await offersService.updateOffer(editOffer.id, payload);
          setOffers(offers.map(o => (o.id === editOffer.id ? updated : o)));
        } else {
          const createdOffer = await offersService.createOffer(payload);
          setOffers([createdOffer, ...offers]);
        }
        setNewOffer({
          numeroOferta: '',
          descripcion: '',
          cliente: '',
          clienteFinal: '',
          enviadoPor: '',
          fechaRecepcion: '',
          fechaEntrega: '',
          estado: 'EN PROCESO',
          resultado: 'OK',
          ingresosEstimados: 0
        });
        setShowModal(false);
      } catch (error) {
        console.error('Error creating offer:', error);
        alert('Error al guardar la oferta');
      }
    } else {
      alert('Por favor completa los campos obligatorios: Descripción y Cliente');
    }
  };

  const handleEditOffer = (offer) => {
    setEditOffer(offer);
    setNewOffer({
      numeroOferta: offer.numero_oferta || offer.numeroOferta || '',
      descripcion: offer.descripcion || '',
      cliente: offer.cliente || '',
      clienteFinal: offer.cliente_final || offer.clienteFinal || offer.cliente || '',
      enviadoPor: offer.enviado_por || offer.enviadoPor || '',
      fechaRecepcion: offer.fecha_recepcion || offer.fechaRecepcion || '',
      fechaEntrega: offer.fecha_entrega || offer.fechaEntrega || '',
      estado: offer.estado || 'EN PROCESO',
      resultado: offer.resultado || 'OK',
      ingresosEstimados: offer.ingresos_estimados || offer.ingresosEstimados || 0
    });
    setShowModal(true);
  };

  const handleUpdateStatus = async (id, estado) => {
    try {
      const updated = await offersService.updateOffer(id, { estado });
      setOffers(offers.map(o => (o.id === id ? updated : o)));
    } catch (e) {
      alert('No se pudo actualizar el estado');
    }
  }

  const handleUpdateResult = async (id, resultado) => {
    try {
      const updated = await offersService.updateOffer(id, { resultado });
      setOffers(offers.map(o => (o.id === id ? updated : o)));
    } catch (e) {
      alert('No se pudo actualizar el resultado');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center">
              Gestor de Ofertas de Preventa
            </h1>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Sistema de gestión y seguimiento de ofertas comerciales
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-full 2xl:max-w-[1400px] mx-auto">
        {/* KPIs */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <KpiCard 
            title="Total de Ofertas" 
            value={totalOfertas} 
          />
          <KpiCard 
            title="Ofertas Ganadas" 
            value={ofertasGanadas} 
          />
        </div>

        {/* Barra de herramientas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            />
            <div className="w-full lg:w-auto lg:ml-4">
              <div className="flex lg:justify-end">
                <Toolbar 
              onCreateOffer={handleCreateOffer}
              onDeleteSelected={handleDeleteSelected}
              onCreateFolder={handleCreateFolder}
              selectedOffers={selectedOffers}
              onFileUpload={handleFileUpload}
              onExportExcel={() => setShowExport(true)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de ofertas */}
        <OffersTable 
          offers={offers}
          selectedOffers={selectedOffers}
          onSelectOffer={handleSelectOffer}
          onSelectAll={handleSelectAll}
          searchTerm={searchTerm}
          onEditOffer={handleEditOffer}
          onUpdateStatus={handleUpdateStatus}
          statuses={statuses}
          results={results}
          onUpdateResult={handleUpdateResult}
        />
        </div>
      </div>
      {/* Modal Exportar Excel */}
      {showExport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-24 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Exportar ofertas a Excel</h3>
              <button onClick={() => setShowExport(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <ExportForm offers={offers} onClose={() => setShowExport(false)} />
          </div>
        </div>
      )}

      {/* Modal para crear nueva oferta */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-gray-900 text-center w-full">
                  Crear Nueva Oferta
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nº Oferta *
                  </label>
                  <input
                    type="text"
                    value={newOffer.numeroOferta}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                    placeholder="Se genera automáticamente"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    value={newOffer.cliente}
                    onChange={(e) => setNewOffer({...newOffer, cliente: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clients.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente final
                  </label>
                  <select
                    value={newOffer.clienteFinal}
                    onChange={(e) => setNewOffer({...newOffer, clienteFinal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">(igual que Cliente)</option>
                    {clients.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                  </label>
                  <textarea
                    value={newOffer.descripcion}
                    onChange={(e) => setNewOffer({...newOffer, descripcion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Descripción de la oferta"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enviado por
                  </label>
                  <select
                    value={newOffer.enviadoPor}
                    onChange={(e) => setNewOffer({...newOffer, enviadoPor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selecciona un vendedor</option>
                    {(sellers && sellers.length ? sellers : ['Juan Pérez','María García']).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ingresos Estimados
                  </label>
                  <input
                    type="number"
                    value={newOffer.ingresosEstimados}
                    onChange={(e) => setNewOffer({...newOffer, ingresosEstimados: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Recepción
                  </label>
                  <input
                    type="date"
                    value={newOffer.fechaRecepcion}
                    onChange={(e) => setNewOffer({...newOffer, fechaRecepcion: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Entrega
                  </label>
                  <input
                    type="date"
                    value={newOffer.fechaEntrega}
                    onChange={(e) => setNewOffer({...newOffer, fechaEntrega: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={newOffer.estado}
                    onChange={(e) => setNewOffer({...newOffer, estado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(statuses.length ? statuses : ['EN PROCESO','ENTREGADA']).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resultado
                  </label>
                  <select
                    value={newOffer.resultado}
                    onChange={(e) => setNewOffer({...newOffer, resultado: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {(results && results.length ? results : ['VACÍO','OK','KO','NO GO']).map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveOffer}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Guardar Oferta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
