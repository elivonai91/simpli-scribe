import React from 'react';
import { Loader2 } from 'lucide-react';
import { MetricCard } from './metrics/MetricCard';
import { useEngagementMetrics } from './metrics/useEngagementMetrics';

export const UserEngagementMetrics = () => {
  const { data: metrics, isLoading } = useEngagementMetrics();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const displayMetrics = metrics || {
    dau: 0,
    mau: 0,
    avgSessionLength: 0,
    featureAdoptionRate: 0,
    retentionRate: 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <MetricCard 
        title="Daily Active Users" 
        value={displayMetrics.dau} 
      />
      <MetricCard 
        title="Monthly Active Users" 
        value={displayMetrics.mau} 
      />
      <MetricCard 
        title="Avg. Session Length" 
        value={displayMetrics.avgSessionLength}
        suffix=" min" 
      />
      <MetricCard 
        title="Feature Adoption" 
        value={displayMetrics.featureAdoptionRate}
        suffix="%" 
      />
      <MetricCard 
        title="Retention Rate" 
        value={displayMetrics.retentionRate}
        suffix="%" 
      />
    </div>
  );
};