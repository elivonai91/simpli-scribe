import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  suffix?: string; // Added suffix as an optional prop
}

export const MetricCard = ({ title, value, suffix }: MetricCardProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">
          {value}{suffix && suffix}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{title}</p>
      </CardContent>
    </Card>
  );
};