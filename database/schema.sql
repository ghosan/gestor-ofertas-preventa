-- Crear la tabla de ofertas
CREATE TABLE offers (
  id BIGSERIAL PRIMARY KEY,
  numero_oferta TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  cliente TEXT NOT NULL,
  cliente_final TEXT,
  enviado_por TEXT,
  fecha_recepcion DATE,
  fecha_entrega DATE,
  estado TEXT DEFAULT 'EN PROCESO',
  resultado TEXT DEFAULT 'OK',
  ingresos_estimados INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_offers_numero_oferta ON offers(numero_oferta);
CREATE INDEX idx_offers_cliente ON offers(cliente);
CREATE INDEX idx_offers_estado ON offers(estado);
CREATE INDEX idx_offers_resultado ON offers(resultado);

-- Tablas para combos
CREATE TABLE IF NOT EXISTS clients (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS sellers (
  id BIGSERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS offer_statuses (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL
);

-- Nuevo: tabla para resultados de propuesta (OK, KO, NO GO)
CREATE TABLE IF NOT EXISTS proposal_results (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL
);

-- Datos iniciales para combos
INSERT INTO offer_statuses (code) VALUES ('EN PROCESO'), ('ENTREGADA')
ON CONFLICT (code) DO NOTHING;

INSERT INTO proposal_results (code) VALUES ('VACÍO'), ('OK'), ('KO'), ('NO GO')
ON CONFLICT (code) DO NOTHING;

INSERT INTO clients (name) VALUES 
('TechCorp Solutions'), ('StartupXYZ'), ('EmpresaABC'), ('RetailMax'), ('ComercialPlus'), ('FashionStore')
ON CONFLICT (name) DO NOTHING;

INSERT INTO sellers (name) VALUES 
('Juan Pérez'), ('María García'), ('Carlos López'), ('Ana Martínez'), ('Roberto Silva'), ('Laura Rodríguez')
ON CONFLICT (name) DO NOTHING;

-- Insertar datos de ejemplo
INSERT INTO offers (numero_oferta, descripcion, cliente, cliente_final, enviado_por, fecha_recepcion, fecha_entrega, estado, resultado, ingresos_estimados) VALUES
('OF-2024-001', 'Sistema de gestión empresarial completo', 'TechCorp Solutions', 'TechCorp Solutions', 'Juan Pérez', '2024-01-15', '2024-02-15', 'EN PROCESO', 'OK', 45000),
('OF-2024-002', 'Desarrollo de aplicación móvil', 'StartupXYZ', 'StartupXYZ', 'María García', '2024-01-20', '2024-03-01', 'ENTREGADA', 'OK', 28000),
('OF-2024-003', 'Consultoría en transformación digital', 'EmpresaABC', 'EmpresaABC', 'Carlos López', '2024-01-25', '2024-02-28', 'EN PROCESO', 'NO GO', 15000),
('OF-2024-004', 'Implementación de CRM', 'RetailMax', 'RetailMax', 'Ana Martínez', '2024-02-01', '2024-02-05', 'EN PROCESO', 'KO', 32000),
('OF-2024-005', 'Sistema de facturación electrónica', 'ComercialPlus', 'ComercialPlus', 'Roberto Silva', '2024-02-10', '2024-02-12', 'EN PROCESO', 'OK', 18000),
('OF-2024-006', 'Plataforma de e-commerce', 'FashionStore', 'FashionStore', 'Laura Rodríguez', '2024-02-15', '2024-02-18', 'EN PROCESO', 'OK', 55000);

-- Habilitar Row Level Security (RLS) para acceso público
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir acceso público (lectura y escritura)
CREATE POLICY "Permitir acceso público a ofertas" ON offers
  FOR ALL USING (true) WITH CHECK (true);

-- RLS y políticas de solo lectura para tablas de combos
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_clients_read ON clients;
CREATE POLICY public_clients_read ON clients FOR SELECT USING (true);
DROP POLICY IF EXISTS public_clients_insert ON clients;
CREATE POLICY public_clients_insert ON clients FOR INSERT WITH CHECK (true);

ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_sellers_read ON sellers;
CREATE POLICY public_sellers_read ON sellers FOR SELECT USING (true);
DROP POLICY IF EXISTS public_sellers_insert ON sellers;
CREATE POLICY public_sellers_insert ON sellers FOR INSERT WITH CHECK (true);

ALTER TABLE offer_statuses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_statuses_read ON offer_statuses;
CREATE POLICY public_statuses_read ON offer_statuses FOR SELECT USING (true);
DROP POLICY IF EXISTS public_statuses_insert ON offer_statuses;
CREATE POLICY public_statuses_insert ON offer_statuses FOR INSERT WITH CHECK (true);

ALTER TABLE proposal_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS public_results_read ON proposal_results;
CREATE POLICY public_results_read ON proposal_results FOR SELECT USING (true);
DROP POLICY IF EXISTS public_results_insert ON proposal_results;
CREATE POLICY public_results_insert ON proposal_results FOR INSERT WITH CHECK (true);
