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
                style={{ 
                  transform: 'perspective(1000px) rotateX(25deg) rotateY(5deg) scale(0.9)',
                  transformOrigin: 'center center'
                }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.9}/>
                    <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2}/>
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                  </filter>
                  <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.2)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0.05)"/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="url(#gridGradient)"
                  vertical={true}
                  className="filter drop-shadow-lg"
                />
                <XAxis 
                  dataKey="month"
                  tick={{ fill: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500 }}
                  stroke="rgba(255,255,255,0.3)"
                  axisLine={{ strokeWidth: 2, stroke: 'rgba(255,255,255,0.3)' }}
                  style={{ filter: 'url(#shadow)' }}
                />
                <YAxis 
                  tick={{ fill: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: 500 }}
                  stroke="rgba(255,255,255,0.3)"
                  tickFormatter={(value) => `$${value}`}
                  axisLine={{ strokeWidth: 2, stroke: 'rgba(255,255,255,0.3)' }}
                  style={{ filter: 'url(#shadow)' }}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Spending']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: 'white',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    padding: '12px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="url(#colorAmount)"
                  strokeWidth={4}
                  dot={{ 
                    fill: '#9b87f5',
                    strokeWidth: 2,
                    r: 6,
                    stroke: 'rgba(255,255,255,0.5)'
                  }}
                  activeDot={{
                    r: 8,
                    stroke: 'rgba(255,255,255,0.8)',
                    strokeWidth: 2,
                    fill: '#9b87f5'
                  }}
                  style={{ filter: 'url(#shadow)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </>
  );
};