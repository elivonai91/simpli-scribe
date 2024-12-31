import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface FeatureData {
  name: string;
  value: number;
}

interface FeatureUsageChartProps {
  featureMetrics: FeatureData[];
}

const COLORS = ['#9b87f5', '#7E69AB', '#D946EF', '#FFDEE2', '#FF69B4'];

export const FeatureUsageChart = ({ featureMetrics }: FeatureUsageChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Usage Distribution</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={featureMetrics}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {featureMetrics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};