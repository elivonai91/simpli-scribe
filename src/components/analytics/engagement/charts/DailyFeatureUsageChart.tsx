import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DailyUsageData {
  date: string;
  features: number;
}

interface DailyFeatureUsageChartProps {
  dailyMetrics: DailyUsageData[];
}

export const DailyFeatureUsageChart = ({ dailyMetrics }: DailyFeatureUsageChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Feature Usage</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailyMetrics}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip 
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Bar dataKey="features" fill="#D946EF" name="Features Used" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};