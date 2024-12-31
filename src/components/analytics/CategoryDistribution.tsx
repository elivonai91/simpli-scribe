import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const CategoryDistribution = () => {
  const session = useSession();

  const { data: categoryData, isLoading } = useQuery({
    queryKey: ['category-distribution', session?.user?.id],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('service_category, billing_amount, billing_cycle')
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      const categoryTotals = subscriptions?.reduce((acc: { [key: string]: number }, sub) => {
        const category = sub.service_category || 'Other';
        const monthlyAmount = sub.billing_cycle === 'yearly' ? sub.billing_amount / 12 : sub.billing_amount;
        acc[category] = (acc[category] || 0) + monthlyAmount;
        return acc;
      }, {});

      return Object.entries(categoryTotals || {}).map(([name, value]) => ({
        name,
        value: Number(value.toFixed(2))
      }));
    },
    enabled: !!session?.user
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {!isLoading && categoryData && categoryData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Monthly Spending']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};