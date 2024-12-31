import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, subMonths, format } from 'date-fns';
import { Loader2 } from 'lucide-react';

export const SubscriptionTrends = () => {
  const { data: trendData, isLoading } = useQuery({
    queryKey: ['subscription-trends'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(startOfMonth(new Date()), i);
        return format(date, 'yyyy-MM-dd');
      }).reverse();

      const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('created_at, billing_amount, billing_cycle')
        .eq('user_id', user.id)
        .gte('created_at', last12Months[0]);

      if (!subscriptions) return [];

      return last12Months.map(monthStart => {
        const monthSubscriptions = subscriptions.filter(sub => 
          format(new Date(sub.created_at), 'yyyy-MM') === format(new Date(monthStart), 'yyyy-MM')
        );

        const totalAmount = monthSubscriptions.reduce((sum, sub) => {
          const monthlyAmount = sub.billing_cycle === 'yearly' ? sub.billing_amount / 12 : sub.billing_amount;
          return sum + monthlyAmount;
        }, 0);

        return {
          month: format(new Date(monthStart), 'MMM yyyy'),
          subscriptions: monthSubscriptions.length,
          spending: Number(totalAmount.toFixed(2))
        };
      });
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Trends (12 Months)</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Trends (12 Months)</CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month"
              tick={{ fill: '#888888' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fill: '#888888' }}
              label={{ value: 'Subscriptions', angle: -90, position: 'insideLeft' }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: '#888888' }}
              label={{ value: 'Monthly Spending ($)', angle: 90, position: 'insideRight' }}
            />
            <Tooltip 
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="subscriptions" 
              stroke="#8884d8" 
              name="Total Subscriptions"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="spending" 
              stroke="#82ca9d" 
              name="Monthly Spending"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};