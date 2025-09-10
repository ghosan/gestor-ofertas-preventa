import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase - estos valores los obtendrás de tu proyecto en Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'tu-clave-publica'

export const supabase = createClient(supabaseUrl, supabaseKey)

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
    return data || []
  },

  // Crear una nueva oferta
  async createOffer(offer) {
    const { data, error } = await supabase
      .from('offers')
      .insert([offer])
      .select()
    
    if (error) {
      console.error('Error creating offer:', error)
      throw error
    }
    return data[0]
  },

  // Actualizar una oferta
  async updateOffer(id, updates) {
    const { data, error } = await supabase
      .from('offers')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating offer:', error)
      throw error
    }
    return data[0]
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
  }
}
