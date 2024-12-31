import React from 'react';
import { Loader2 } from 'lucide-react';
import { MetricCard } from './metrics/MetricCard';
import { useSubscriptionMetrics } from './hooks/useSubscriptionMetrics';

export const SubscriptionMetrics = () => {
  const { data: metrics, isLoading } = useSubscriptionMetrics();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayMetrics = metrics || {
    totalSubscriptions: 0,
    totalMonthlySpend: 0,
    categoryCount: 0,
    averageCost: 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <MetricCard 
        title="Total Subscriptions"
        value={displayMetrics.totalSubscriptions}
      />
      <MetricCard 
        title="Monthly Spend"
        value={`$${displayMetrics.totalMonthlySpend.toFixed(2)}`}
      />
      <MetricCard 
        title="Categories"
        value={displayMetrics.categoryCount}
      />
      <MetricCard 
        title="Average Cost"
        value={`$${displayMetrics.averageCost.toFixed(2)}`}
      />
    </div>
  );
};