import React, { useState, useEffect } from 'react';
import KpiCard from './components/KpiCard';
import SearchBar from './components/SearchBar';
import Toolbar from './components/Toolbar';
import OffersTable from './components/OffersTable';
import { offersService } from './lib/supabase';
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
    resultado: 'OK',
    ingresosEstimados: 0
  });

  // Cargar datos iniciales desde Supabase
  useEffect(() => {
    loadOffers();
  }, []);

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
  const handleCreateOffer = () => {
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
      
      if (file.name.endsWith('.csv')) {
        // Procesar CSV
        Papa.parse(data, {
          header: true,
          complete: (results) => {
            const processedData = results.data.map((row, index) => ({
              id: offers.length + index + 1,
              numeroOferta: row['Nº Oferta'] || row['numeroOferta'] || '',
              descripcion: row['Descripción'] || row['descripcion'] || '',
              cliente: row['Cliente'] || row['cliente'] || '',
              clienteFinal: row['Cliente Final'] || row['clienteFinal'] || row['Cliente'] || row['cliente'] || '',
              enviadoPor: row['Enviado por'] || row['enviadoPor'] || '',
              fechaRecepcion: row['Fecha Recepción'] || row['fechaRecepcion'] || '',
              fechaEntrega: row['Fecha Entrega'] || row['fechaEntrega'] || '',
              estado: row['Estado'] || row['estado'] || 'EN PROCESO',
              resultado: row['Resultado'] || row['resultado'] || 'OK',
              ingresosEstimados: parseInt(row['Ingresos'] || row['ingresosEstimados'] || '0')
            }));
            setOffers([...offers, ...processedData]);
          }
        });
      } else {
        // Procesar Excel
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        const processedData = jsonData.map((row, index) => ({
          id: offers.length + index + 1,
          numeroOferta: row['Nº Oferta'] || row['numeroOferta'] || '',
          descripcion: row['Descripción'] || row['descripcion'] || '',
          cliente: row['Cliente'] || row['cliente'] || '',
          clienteFinal: row['Cliente Final'] || row['clienteFinal'] || row['Cliente'] || row['cliente'] || '',
          enviadoPor: row['Enviado por'] || row['enviadoPor'] || '',
          fechaRecepcion: row['Fecha Recepción'] || row['fechaRecepcion'] || '',
          fechaEntrega: row['Fecha Entrega'] || row['fechaEntrega'] || '',
          estado: row['Estado'] || row['estado'] || 'EN PROCESO',
          resultado: row['Resultado'] || row['resultado'] || 'OK',
          ingresosEstimados: parseInt(row['Ingresos'] || row['ingresosEstimados'] || '0')
        }));
        
        setOffers([...offers, ...processedData]);
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // Función para guardar nueva oferta
  const handleSaveOffer = async () => {
    if (newOffer.numeroOferta && newOffer.descripcion && newOffer.cliente) {
      try {
        const offer = {
          ...newOffer,
          ingresosEstimados: parseInt(newOffer.ingresosEstimados)
        };
        const createdOffer = await offersService.createOffer(offer);
        setOffers([createdOffer, ...offers]);
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
        alert('Error al crear la oferta');
      }
    } else {
      alert('Por favor completa los campos obligatorios: Nº Oferta, Descripción y Cliente');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestor de Ofertas de Preventa
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sistema de gestión y seguimiento de ofertas comerciales
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <KpiCard 
            title="Total de Ofertas" 
            value={totalOfertas} 
            color="blue" 
          />
          <KpiCard 
            title="Ofertas Ganadas" 
            value={ofertasGanadas} 
            color="green" 
          />
        </div>

        {/* Barra de herramientas */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <SearchBar 
              searchTerm={searchTerm} 
              onSearchChange={handleSearchChange} 
            />
            <Toolbar 
              onCreateOffer={handleCreateOffer}
              onDeleteSelected={handleDeleteSelected}
              onCreateFolder={handleCreateFolder}
              selectedOffers={selectedOffers}
              onFileUpload={handleFileUpload}
            />
          </div>
        </div>

        {/* Tabla de ofertas */}
        <OffersTable 
          offers={offers}
          selectedOffers={selectedOffers}
          onSelectOffer={handleSelectOffer}
          onSelectAll={handleSelectAll}
          searchTerm={searchTerm}
        />
      </div>

      {/* Modal para crear nueva oferta */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
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
                    onChange={(e) => setNewOffer({...newOffer, numeroOferta: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="OF-2024-XXX"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <input
                    type="text"
                    value={newOffer.cliente}
                    onChange={(e) => setNewOffer({...newOffer, cliente: e.target.value, clienteFinal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del cliente"
                  />
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
                  <input
                    type="text"
                    value={newOffer.enviadoPor}
                    onChange={(e) => setNewOffer({...newOffer, enviadoPor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del vendedor"
                  />
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
                    <option value="EN PROCESO">EN PROCESO</option>
                    <option value="ENTREGADA">ENTREGADA</option>
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
                    <option value="OK">OK</option>
                    <option value="KO">KO</option>
                    <option value="NO GO">NO GO</option>
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
