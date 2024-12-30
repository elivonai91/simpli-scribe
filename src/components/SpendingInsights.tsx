import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

export const SpendingInsights = () => {
  const { subscriptions } = useSubscriptions();
  const session = useSession();

  const { data: budgetData } = useQuery({
    queryKey: ['budget'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user
  });

  // Group subscriptions by category
  const categorySpending = subscriptions.reduce((acc: { [key: string]: number }, sub) => {
    const monthlyCost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    acc[sub.category] = (acc[sub.category] || 0) + monthlyCost;
    return acc;
  }, {});

  const chartData = Object.entries(categorySpending).map(([category, amount]) => ({
    category,
    spending: Number(amount.toFixed(2)),
    limit: budgetData?.category_limits?.[category] || 0
  }));

  const totalMonthlySpending = Object.values(categorySpending).reduce((a, b) => a + b, 0);
  const monthlyLimit = budgetData?.monthly_limit || 0;
  const spendingPercentage = monthlyLimit ? (totalMonthlySpending / monthlyLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Monthly Spending</span>
              <span className="font-bold">${totalMonthlySpending.toFixed(2)}</span>
            </div>
            {monthlyLimit > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Budget Limit: ${monthlyLimit}</span>
                  <span className={spendingPercentage > 100 ? 'text-red-500' : 'text-green-500'}>
                    {spendingPercentage.toFixed(1)}% Used
                  </span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div
                    className={`h-full rounded-full ${
                      spendingPercentage > 100 ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="spending" fill="#22c55e" name="Current Spending" />
                <Bar dataKey="limit" fill="#3b82f6" name="Category Limit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};