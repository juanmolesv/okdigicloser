-- CLIENTES (empresas que contratan OkDigiCloser)
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT,
  plan TEXT DEFAULT 'starter',
  status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  setup_paid BOOLEAN DEFAULT false,
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CERRADORES (configuración del cerrador IA de cada cliente)
CREATE TABLE closers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_description TEXT NOT NULL,
  product_price TEXT NOT NULL,
  product_benefits TEXT NOT NULL,
  common_objections TEXT,
  closing_goal TEXT NOT NULL,
  closing_action TEXT NOT NULL,
  tone TEXT DEFAULT 'profesional',
  language TEXT DEFAULT 'es',
  welcome_message TEXT,
  avatar_name TEXT DEFAULT 'Asesor IA',
  is_active BOOLEAN DEFAULT true,
  vapi_assistant_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CONVERSACIONES
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  closer_id UUID REFERENCES closers(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  prospect_name TEXT,
  prospect_email TEXT,
  prospect_phone TEXT,
  channel TEXT DEFAULT 'chat',
  status TEXT DEFAULT 'open',
  messages JSONB DEFAULT '[]',
  sale_value DECIMAL(10,2),
  commission_amount DECIMAL(10,2),
  commission_paid BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  closed_at TIMESTAMPTZ,
  notes TEXT
);

-- PAGOS Y COMISIONES
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  conversation_id UUID REFERENCES conversations(id),
  type TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'eur',
  stripe_payment_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE closers ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_own_data" ON clients FOR ALL USING (auth.uid()::text = id::text);
CREATE POLICY "closers_own_data" ON closers FOR ALL USING (
  client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text)
);
CREATE POLICY "conversations_own_data" ON conversations FOR ALL USING (
  client_id IN (SELECT id FROM clients WHERE auth.uid()::text = id::text)
);
CREATE POLICY "closer_public_insert" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "closer_public_messages" ON conversations FOR UPDATE USING (true);
