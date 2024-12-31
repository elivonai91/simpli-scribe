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
    <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Session Duration Trends</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sessionMetrics}>
            <XAxis 
              dataKey="date" 
              tick={{ fill: 'rgba(255,255,255,0.8)' }}
              stroke="rgba(255,255,255,0.2)"
            />
            <YAxis 
              label={{ 
                value: 'Minutes', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'rgba(255,255,255,0.8)' }
              }}
              tick={{ fill: 'rgba(255,255,255,0.8)' }}
              stroke="rgba(255,255,255,0.2)"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '4px',
                color: 'white'
              }}
            />
            <Bar dataKey="duration" fill="#9b87f5" name="Duration (minutes)" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};