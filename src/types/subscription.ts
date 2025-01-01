export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate: Date;
  category: string;
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
  created_at?: string;
}