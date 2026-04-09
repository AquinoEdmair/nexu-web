export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  referral_code: string;
  referred_by: string | null;
  status: 'active' | 'blocked' | 'pending';
  email_verified_at: string | null;
  phone_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance_available: string;
  balance_in_operation: string;
  balance_total: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'deposit' | 'withdrawal' | 'commission' | 'yield' | 'referral_commission';
  amount: string;
  fee_amount: string;
  net_amount: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'processing';
  currency: string;
  external_tx_id: string | null;
  metadata: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface BalanceData {
  balance_available: string;
  balance_in_operation: string;
  balance_total: string;
  currency: string;
}

export interface BalanceHistoryEntry {
  date: string;
  balance_total: string;
  balance_available: string;
  balance_in_operation: string;
}

export interface DepositInvoice {
  invoice_id: string;
  address: string;
  currency: string;
  network: string | null;
  qr_code_url: string | null;
  status: 'awaiting_payment' | 'completed' | 'expired';
  amount_expected: string;
  amount_received: string | null;
  expires_at: string;
  created_at: string;
}

export interface YieldLog {
  id: string;
  applied_by: string;
  type: 'percentage' | 'fixed_amount';
  value: string;
  description: string | null;
  applied_at: string;
  created_at: string;
}

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: string;
  currency: string;
  destination_address: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  tx_hash: string | null;
  created_at: string;
  updated_at: string;
}
