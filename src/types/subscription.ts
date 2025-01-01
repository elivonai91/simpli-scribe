export interface PartnerService {
  id: string;
  service_name: string;
  category: string | null;
  base_price: number;
  premium_discount: number | null;
  affiliate_rate: number | null;
  api_integration: boolean | null;
  created_at: string;
  release_date: string | null;
  popularity_score: number | null;
  genre: string[] | null;
}

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  category: string;
  nextBillingDate: Date;
  notes?: string;
  reminders: {
    fortyEightHour: boolean;
    twentyFourHour: boolean;
  };
  plans?: SubscriptionPlan[];
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  features: string[];
  monthly_price: number;
  yearly_price: number;
  created_at: string;
}

export interface SubscriptionMetrics {
  totalSubscriptions: number;
  totalMonthlySpend: number;
  categoryCount: number;
  averageCost: number;
}

export interface CategorySpending {
  category: string;
  spending: number;
  limit: number;
}