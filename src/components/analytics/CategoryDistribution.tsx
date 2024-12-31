import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const CategoryDistribution = () => {
  const session = useSession();

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['category-distribution'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('billing_amount, billing_cycle, service_category')
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      const categoryTotals = subscriptions?.reduce((acc: any, sub) => {
        const category = sub.service_category || 'Uncategorized';
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += sub.billing_cycle === 'yearly' 
          ? sub.billing_amount / 12 
          : sub.billing_amount;
        return acc;
      }, {});

      return Object.entries(categoryTotals || {}).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }));
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
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};