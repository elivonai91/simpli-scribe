import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Loader2 } from 'lucide-react';

export const SubscriptionGrowth = () => {
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['subscription-growth'],
    queryFn: async () => {
      const startDate = format(subMonths(startOfMonth(new Date()), 6), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(new Date()), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('created_at, billing_amount')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const monthlyData = subscriptionData?.reduce((acc: any[], sub) => {
    const month = format(new Date(sub.created_at), 'MMM yyyy');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.total += 1;
      existingMonth.revenue += Number(sub.billing_amount);
    } else {
      acc.push({
        month,
        total: 1,
        revenue: Number(sub.billing_amount)
      });
    }
    
    return acc;
  }, []) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Growth</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
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
              dataKey="total" 
              stroke="#9b87f5" 
              name="Total Subscriptions"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="revenue" 
              stroke="#D946EF" 
              name="Monthly Revenue"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};