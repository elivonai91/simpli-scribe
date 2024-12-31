import React from 'react';
import { SubscriptionMetrics } from './SubscriptionMetrics';
import { SpendingTrends } from './SpendingTrends';
import { CategoryDistribution } from './CategoryDistribution';
import { UserEngagementMetrics } from './UserEngagementMetrics';

export const AnalyticsDashboard = () => {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">User Engagement</h3>
          <UserEngagementMetrics />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-4">Subscription Overview</h3>
          <SubscriptionMetrics />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SpendingTrends />
          <CategoryDistribution />
        </div>
      </div>
    </div>
  );
};