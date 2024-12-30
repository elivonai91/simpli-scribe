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
}