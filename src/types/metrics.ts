export interface GlobalInvestmentResponse {
  total_investment: number;
  currency: string;
  updated_at: string;
}

export interface UserRankingItem {
  user_name: string;
  amount: number;
  category: string;
  level_pts: number;
}

export interface UserRankingResponse {
  data: UserRankingItem[];
  updated_at: string;
}

export interface GoldPriceItem {
  date: string;
  price: number;
}

export interface GoldPriceResponse {
  data: GoldPriceItem[];
  current: number;
  change_24h: number;
  updated_at: string;
}

export interface GoldNewsItem {
  title: string;
  excerpt: string;
  date: string;
  source: string;
  url: string;
  category: string;
}
