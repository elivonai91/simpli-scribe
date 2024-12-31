import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string;
}

export const MetricCard = ({ title, value, suffix }: MetricCardProps) => {
  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10">
      <CardContent className="pt-6">
        <div className="text-2xl font-bold text-white">
          {value}{suffix && suffix}
        </div>
        <p className="text-xs text-white/70 mt-1">{title}</p>
      </CardContent>
    </Card>
  );
};