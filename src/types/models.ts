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
  type: 'deposit' | 'withdrawal' | 'commission' | 'yield' | 'referral_commission' | 'admin_adjustment';
  amount: string;
  fee_amount: string;
  net_amount: string;
  status: 'pending' | 'confirmed' | 'rejected' | 'processing';
  currency: string;
  external_tx_id: string | null;
  metadata: Record<string, unknown> | null;
  notes: string | null;
  admin_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BalanceData {
  balance_in_operation: string;
  balance_total: string;
  currency: string;
  member_since: string;
  first_deposit_amount: string | null;
}

export interface BalanceHistoryEntry {
  date: string;
  balance_total: string;
  balance_in_operation: string;
}

export interface DepositCurrency {
  symbol: string;
  name: string;
  network: string | null;
}

export interface DepositRequest {
  id: string;
  currency: string;
  network: string | null;
  address: string;
  qr_image_url: string | null;
  amount_expected: string;
  fee_amount: string | null;
  net_amount: string | null;
  commission_rate: string | null;
  tx_hash: string | null;
  status: 'pending' | 'client_confirmed' | 'completed' | 'cancelled';
  client_confirmed_at: string | null;
  reviewed_by_name: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface CryptoCurrency {
  symbol: string;
  name: string;
  network: string | null;
}

export interface YieldLog {
  id: string;
  applied_by: string | { id: string; name: string } | null;
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

// ── Support Tickets ───────────────────────────────────────────────────────────

export interface SupportTicketMessage {
  id: string;
  ticket_id: string;
  sender_type: 'user' | 'admin';
  sender_id: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'closed';
  closed_by: number | null;
  closed_at: string | null;
  messages?: SupportTicketMessage[];
  messages_count?: number;
  created_at: string;
  updated_at: string;
}

// ── Withdrawals ───────────────────────────────────────────────────────────────

export interface WithdrawalCurrency {
  symbol: string;
  name: string;
  network: string | null;
}

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
  reviewed_by_name: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  tx_hash: string | null;
  qr_image_url: string | null;
  created_at: string;
  updated_at: string;
}
