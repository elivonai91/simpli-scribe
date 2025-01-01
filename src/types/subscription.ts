export interface PartnerService {
  id: string;
  service_name: string;
  category: string;
  base_price: number;
  premium_discount: number;
  affiliate_rate: number;
  api_integration: boolean;
  created_at: string;
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