import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, startOfMonth } from 'date-fns';
import { Loader2 } from 'lucide-react';

export const ChurnAnalysis = () => {
  const { data: churnData, isLoading } = useQuery({
    queryKey: ['churn-analysis'],
    queryFn: async () => {
      const startDate = format(subMonths(startOfMonth(new Date()), 6), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('status', 'cancelled')
        .gte('created_at', startDate)
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

  const monthlyChurn = churnData?.reduce((acc: any[], sub) => {
    const month = format(new Date(sub.created_at), 'MMM yyyy');
    const existingMonth = acc.find(item => item.month === month);
    
    if (existingMonth) {
      existingMonth.churned += 1;
    } else {
      acc.push({
        month,
        churned: 1
      });
    }
    
    return acc;
  }, []) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Analysis</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyChurn}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Bar 
              dataKey="churned" 
              fill="#FF6B6B" 
              name="Churned Subscriptions"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};