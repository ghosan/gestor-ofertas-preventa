import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase - estos valores los obtendrás de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-clave-publica'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Helpers de mapeo entre frontend (camelCase) y DB (snake_case)
const toDbOffer = (offer) => ({
  numero_oferta: offer.numeroOferta,
  descripcion: offer.descripcion,
  cliente: offer.cliente,
  cliente_final: offer.clienteFinal ?? offer.cliente,
  enviado_por: offer.enviadoPor,
  // No forzar null si no se envían; dejar como undefined para no pisar en updates parciales
  fecha_recepcion: offer.hasOwnProperty('fechaRecepcion') ? (offer.fechaRecepcion || null) : undefined,
  fecha_entrega: offer.hasOwnProperty('fechaEntrega') ? (offer.fechaEntrega || null) : undefined,
  estado: offer.estado,
  resultado: offer.resultado,
  ingresos_estimados: offer.ingresosEstimados ?? 0,
})

const fromDbOffer = (row) => ({
  id: row.id,
  numeroOferta: row.numero_oferta,
  descripcion: row.descripcion,
  cliente: row.cliente,
  clienteFinal: row.cliente_final,
  enviadoPor: row.enviado_por,
  fechaRecepcion: row.fecha_recepcion,
  fechaEntrega: row.fecha_entrega,
  estado: row.estado,
  resultado: row.resultado,
  ingresosEstimados: row.ingresos_estimados,
  created_at: row.created_at,
  updated_at: row.updated_at,
})

// Funciones para manejar las ofertas
export const offersService = {
  // Obtener todas las ofertas
  async getAllOffers() {
    const { data, error } = await supabase
      .from('offers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Error fetching offers:', error)
      return []
    }
    return (data || []).map(fromDbOffer)
  },

  // Crear una nueva oferta
  async createOffer(offer) {
    const { data, error } = await supabase
      .from('offers')
      .insert([toDbOffer(offer)])
      .select('*')
    
    if (error) {
      console.error('Error creating offer:', error)
      throw error
    }
    return fromDbOffer(data[0])
  },

  // Actualizar una oferta
  async updateOffer(id, updates) {
    const { data, error } = await supabase
      .from('offers')
      .update(toDbOffer({ ...updates, numeroOferta: updates.numeroOferta ?? undefined }))
      .eq('id', id)
      .select('*')
    
    if (error) {
      console.error('Error updating offer:', error)
      throw error
    }
    return fromDbOffer(data[0])
  },

  // Eliminar ofertas
  async deleteOffers(ids) {
    const { error } = await supabase
      .from('offers')
      .delete()
      .in('id', ids)
    
    if (error) {
      console.error('Error deleting offers:', error)
      throw error
    }
    return true
  }
}

// Servicios para combos
export const comboService = {
  async getClients() {
    const { data, error } = await supabase.from('clients').select('name').order('name')
    if (error) return []
    return data.map((r) => r.name)
  },
  async getSellers() {
    const { data, error } = await supabase.from('sellers').select('name').order('name')
    if (error) return []
    return data.map((r) => r.name)
  },
  async getStatuses() {
    const { data, error } = await supabase.from('offer_statuses').select('code').order('code')
    if (error) return []
    return data.map((r) => r.code)
  },
  async getProposalResults() {
    const { data, error } = await supabase.from('proposal_results').select('code').order('code')
    if (error) return []
    return data.map((r) => r.code)
  },
  async addClient(name) {
    const { error } = await supabase.from('clients').insert([{ name }])
    if (error) throw error
  },
  async addSeller(name) {
    const { error } = await supabase.from('sellers').insert([{ name }])
    if (error) throw error
  },
  async addStatus(code) {
    const { error } = await supabase.from('offer_statuses').insert([{ code }])
    if (error) throw error
  },
  async addProposalResult(code) {
    const { error } = await supabase.from('proposal_results').insert([{ code }])
    if (error) throw error
  }
}
