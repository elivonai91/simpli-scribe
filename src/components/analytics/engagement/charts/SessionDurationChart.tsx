import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SessionData {
  date: string;
  duration: number;
}

interface SessionDurationChartProps {
  sessionMetrics: SessionData[];
}

export const SessionDurationChart = ({ sessionMetrics }: SessionDurationChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Duration Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sessionMetrics}>
            <XAxis dataKey="date" />
            <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
            <Bar dataKey="duration" fill="#9b87f5" name="Duration (minutes)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};