import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

export interface SubscriptionMetricsData {
  totalSubscriptions: number;
  totalMonthlySpend: number;
  categoryCount: number;
  averageCost: number;
}

export const useSubscriptionMetrics = () => {
  const session = useSession();

  return useQuery({
    queryKey: ['subscription-metrics', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('billing_amount, billing_cycle, service_category')
        .eq('user_id', session.user.id);

      if (error) throw error;

      if (!subscriptions || subscriptions.length === 0) {
        return {
          totalSubscriptions: 0,
          totalMonthlySpend: 0,
          categoryCount: 0,
          averageCost: 0
        };
      }

      const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
        const amount = sub.billing_cycle === 'yearly' 
          ? sub.billing_amount / 12 
          : sub.billing_amount;
        return acc + amount;
      }, 0);

      const categoryCount = new Set(subscriptions.map(sub => sub.service_category)).size;

      return {
        totalSubscriptions: subscriptions.length,
        totalMonthlySpend,
        categoryCount,
        averageCost: subscriptions.length > 0 ? totalMonthlySpend / subscriptions.length : 0
      };
    },
    enabled: !!session?.user
  });
};