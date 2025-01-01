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
    <>
      <CardHeader>
        <CardTitle className="text-white">Monthly Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {!isLoading && trendData && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={trendData}
                style={{ transform: 'rotateX(10deg) rotateY(5deg)' }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(255,255,255,0.1)"
                  vertical={true}
                />
                <XAxis 
                  dataKey="month"
                  tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  stroke="rgba(255,255,255,0.2)"
                  axisLine={{ strokeWidth: 2 }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.8)' }}
                  stroke="rgba(255,255,255,0.2)"
                  tickFormatter={(value) => `$${value}`}
                  axisLine={{ strokeWidth: 2 }}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Spending']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: '#8884d8', strokeWidth: 2 }}
                  fill="url(#colorAmount)"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </>
  );
};