import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { startOfMonth, subMonths, format } from 'date-fns';

export const SpendingTrends = () => {
  const session = useSession();

  const { data: trendData, isLoading } = useQuery({
    queryKey: ['spending-trends', session?.user?.id],
    queryFn: async () => {
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const date = subMonths(startOfMonth(new Date()), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();

      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('billing_amount, billing_cycle, created_at')
        .eq('user_id', session?.user?.id)
        .gte('created_at', last6Months[0]);

      if (error) throw error;

      const monthlyTotals = last6Months.map(monthStart => {
        const monthlyTotal = subscriptions?.reduce((acc, sub) => {
          const subDate = new Date(sub.created_at);
          if (format(subDate, 'yyyy-MM') === format(new Date(monthStart), 'yyyy-MM')) {
            return acc + (sub.billing_cycle === 'yearly' ? sub.billing_amount / 12 : sub.billing_amount);
          }
          return acc;
        }, 0) || 0;

        return {
          month: format(new Date(monthStart), 'MMM yyyy'),
          amount: Number(monthlyTotal.toFixed(2))
        };
      });

      return monthlyTotals;
    },
    enabled: !!session?.user
  });

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Monthly Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {!isLoading && trendData && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tick={{ fill: '#888888' }}
                />
                <YAxis 
                  tick={{ fill: '#888888' }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Spending']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};