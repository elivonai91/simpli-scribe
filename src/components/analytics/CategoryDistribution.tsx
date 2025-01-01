import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const RADIAN = Math.PI / 180;

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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="text-white">Category Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {!isLoading && categoryData && categoryData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ transform: 'perspective(1000px) rotateX(20deg)' }}>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={5}
                  innerRadius={40}
                >
                  {categoryData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Monthly Spending']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    color: 'white'
                  }}
                />
                <Legend 
                  formatter={(value) => <span style={{ color: 'white' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </>
  );
};