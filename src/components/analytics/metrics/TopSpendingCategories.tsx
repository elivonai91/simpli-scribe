import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export const TopSpendingCategories = () => {
  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['top-spending-categories'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('service_category, billing_amount, billing_cycle')
        .eq('user_id', user.id);

      if (!subscriptions) return [];

      const categoryTotals = subscriptions.reduce((acc: { [key: string]: number }, sub) => {
        const category = sub.service_category || 'Other';
        const monthlyAmount = sub.billing_cycle === 'yearly' ? sub.billing_amount / 12 : sub.billing_amount;
        acc[category] = (acc[category] || 0) + monthlyAmount;
        return acc;
      }, {});

      return Object.entries(categoryTotals)
        .map(([category, amount]) => ({
          category,
          amount: Number(amount.toFixed(2))
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Spending Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Spending Categories</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={categoryData} layout="vertical">
            <XAxis type="number" />
            <YAxis dataKey="category" type="category" />
            <Tooltip
              formatter={(value: number) => [`$${value}`, 'Monthly Spend']}
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};