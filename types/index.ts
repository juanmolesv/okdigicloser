export interface Client {
  id: string;
  email: string;
  company_name: string;
  contact_name: string;
  phone?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  status: 'active' | 'paused' | 'cancelled';
  stripe_customer_id?: string;
  setup_paid: boolean;
  commission_rate: number;
  created_at: string;
}

export interface Closer {
  id: string;
  client_id: string;
  name: string;
  product_name: string;
  product_description: string;
  product_price: string;
  product_benefits: string;
  common_objections?: string;
  closing_goal: string;
  closing_action: string;
  tone: 'profesional' | 'cercano' | 'urgente' | 'consultivo';
  language: string;
  welcome_message?: string;
  avatar_name: string;
  is_active: boolean;
  vapi_assistant_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface Conversation {
  id: string;
  closer_id: string;
  client_id: string;
  prospect_name?: string;
  prospect_email?: string;
  prospect_phone?: string;
  channel: 'chat' | 'voice' | 'whatsapp';
  status: 'open' | 'closed_won' | 'closed_lost' | 'follow_up';
  messages: Message[];
  sale_value?: number;
  commission_amount?: number;
  commission_paid: boolean;
  started_at: string;
  closed_at?: string;
  notes?: string;
}

export interface Payment {
  id: string;
  client_id: string;
  conversation_id?: string;
  type: 'setup_fee' | 'commission';
  amount: number;
  currency: string;
  stripe_payment_id?: string;
  status: 'pending' | 'paid' | 'failed';
  created_at: string;
}

export interface DebateResult {
  finalResponse: string;
  processingMs: number;
}
