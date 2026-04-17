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
  balance_in_operation: string;
  balance_total: string;
  currency: string;
}

export interface BalanceHistoryEntry {
  date: string;
  balance_total: string;
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
  pay_amount: string | null;
  amount_received: string | null;
  expires_at: string;
  created_at: string;
  confirmed_manually: boolean;
  confirmed_by_name: string | null;
}

export interface CryptoCurrency {
  symbol: string;
  name: string;
  network: string | null;
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

export interface YieldLogEntry {
  id: string;
  yield_log_id: string;
  user_id: string;
  balance_before: string;
  balance_after: string;
  amount_applied: string;
  status: 'applied' | 'failed' | 'skipped';
  created_at: string;
  yield_log?: YieldLog;
}

// ── Referrals ────────────────────────────────────────────────────────────────

export interface EliteTierData {
  name: string;
  slug: string;
  multiplier: string;
  first_deposit_commission_rate: string;
  recurring_commission_rate: string;
}

export interface NextTierData {
  name: string;
  slug: string;
  min_points: string;
}

export interface EliteTierSummary {
  name: string;
  slug: string;
  min_points: number;
}

export interface ReferralElite {
  points_total: string;
  tier: EliteTierData | null;
  next_tier: NextTierData | null;
  points_to_next: string | null;
  progress_pct: number;
  tiers: EliteTierSummary[];
}

export interface ElitePointEntry {
  id: string;
  points: string;
  source: string;
  amount_usd: string;
  created_at: string;
}

export interface ReferralStats {
  active_count: number;
  inactive_count: number;
  total_earned: string;
  total_personal_deposit: string;
}

export interface ReferralSummary {
  code: string;
  share_url: string;
  stats: ReferralStats;
  elite: ReferralElite;
}

export interface ReferralNode {
  id: string;
  masked_email: string;
  joined_at: string;
  status: 'active' | 'inactive';
  total_generated: string;
}

export interface ReferralEarning {
  id: string;
  amount: string;
  source_user_masked: string;
  created_at: string;
}

export interface ReferralCodeValidation {
  valid: boolean;
  referrer_name: string | null;
}

// ── Withdrawals ───────────────────────────────────────────────────────────────

export interface WithdrawalRequest {
  id: string;
  user_id: string;
  amount: string;
  fee_amount: string | null;
  net_amount: string | null;
  commission_rate: string | null;
  currency: string;
  destination_address: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'cancelled';
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  tx_hash: string | null;
  created_at: string;
  updated_at: string;
}
