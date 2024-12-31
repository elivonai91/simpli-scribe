import React from 'react';
import { SubscriptionMetrics } from './SubscriptionMetrics';
import { SpendingTrends } from './SpendingTrends';
import { CategoryDistribution } from './CategoryDistribution';

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      <div className="space-y-6">
        <SubscriptionMetrics />
        <div className="grid gap-4 md:grid-cols-3">
          <SpendingTrends />
          <CategoryDistribution />
        </div>
      </div>
    </div>
  );
};