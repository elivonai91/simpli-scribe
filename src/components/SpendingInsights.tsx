import React from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { MonthlyOverview } from './insights/MonthlyOverview';
import { CategoryChart } from './insights/CategoryChart';
import { CategorySpending } from '@/types/subscription';
import { Json } from '@/integrations/supabase/types';

interface BudgetResponse {
  id: string;
  user_id: string;
  monthly_limit: number;
  created_at: string;
  category_limits: Json;
}

interface Budget {
  monthly_limit: number;
  category_limits: Record<string, number>;
}

export const SpendingInsights = () => {
  const { subscriptions } = useSubscriptions();
  const session = useSession();

  const { data: budgetData } = useQuery<Budget>({
    queryKey: ['budget'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', session?.user?.id)
        .maybeSingle();

      if (error) throw error;
      
      // Transform the response data to match our Budget interface
      const budgetResponse = data as BudgetResponse | null;
      if (!budgetResponse) return { monthly_limit: 0, category_limits: {} };
      
      return {
        monthly_limit: budgetResponse.monthly_limit,
        category_limits: budgetResponse.category_limits as Record<string, number> || {}
      };
    },
    enabled: !!session?.user
  });

  // Group subscriptions by category
  const categorySpending = subscriptions.reduce((acc: { [key: string]: number }, sub) => {
    const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    acc[sub.category] = (acc[sub.category] || 0) + monthlyCost;
    return acc;
  }, {});

  const chartData: CategorySpending[] = Object.entries(categorySpending).map(([category, amount]) => ({
    category,
    spending: Number(amount.toFixed(2)),
    limit: budgetData?.category_limits?.[category] || 0
  }));

  const totalMonthlySpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const monthlyLimit = budgetData?.monthly_limit || 0;
  const spendingPercentage = monthlyLimit ? (totalMonthlySpending / monthlyLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      <MonthlyOverview 
        totalMonthlySpending={totalMonthlySpending}
        monthlyLimit={monthlyLimit}
        spendingPercentage={spendingPercentage}
      />
      <CategoryChart chartData={chartData} />
    </div>
  );
};