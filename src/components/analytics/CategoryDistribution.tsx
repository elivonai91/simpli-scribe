import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

const COLORS = ['#9b87f5', '#7E69AB', '#D946EF', '#FF69B4', '#BA55D3'];
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
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        filter="url(#shadow)"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ 
          fontSize: '12px',
          fontWeight: '500',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}
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
              <PieChart style={{ 
                transform: 'perspective(1000px) rotateX(30deg) scale(0.85)',
                transformOrigin: 'center center'
              }}>
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                    <feOffset in="blur" dx="2" dy="4" result="offsetBlur"/>
                    <feMerge>
                      <feMergeNode in="offsetBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                  {COLORS.map((color, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity={1}/>
                      <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={6}
                  innerRadius={60}
                  style={{ filter: 'url(#shadow)' }}
                >
                  {categoryData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#gradient-${index % COLORS.length})`}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth={2}
                      style={{
                        filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.2))'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`$${value}`, 'Monthly Spending']}
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
                <Legend 
                  formatter={(value) => (
                    <span style={{ 
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {value}
                    </span>
                  )}
                  wrapperStyle={{
                    paddingTop: '20px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </>
  );
};