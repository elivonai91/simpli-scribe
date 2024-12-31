import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';

interface SubscriptionData {
  billing_amount: number;
  billing_cycle: 'monthly' | 'yearly';
  created_at: string;
}

interface TrendData {
  date: string;
  amount: number;
}

export const SpendingTrends = () => {
  const session = useSession();

  const { data: trendData, isLoading } = useQuery({
    queryKey: ['spending-trends'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('billing_amount, billing_cycle, created_at')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Group subscriptions by month
      const monthlyData = (subscriptions as SubscriptionData[])?.reduce((acc: Record<string, number>, sub) => {
        const date = new Date(sub.created_at);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        
        if (!acc[monthYear]) {
          acc[monthYear] = 0;
        }
        
        acc[monthYear] += sub.billing_cycle === 'yearly' 
          ? sub.billing_amount / 12 
          : sub.billing_amount;
        
        return acc;
      }, {});

      return Object.entries(monthlyData || {}).map(([date, amount]) => ({
        date,
        amount: Number(amount.toFixed(2))
      })) as TrendData[];
    },
    enabled: !!session?.user
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};