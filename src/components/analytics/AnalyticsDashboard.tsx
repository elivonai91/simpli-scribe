import React from 'react';
import { SubscriptionMetrics } from './SubscriptionMetrics';
import { SpendingTrends } from './SpendingTrends';
import { CategoryDistribution } from './CategoryDistribution';
import { UserEngagementMetrics } from './UserEngagementMetrics';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const AnalyticsDashboard = () => {
  // Check if user is admin
  const { data: userProfile } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return profile;
    }
  });

  const isAdmin = userProfile?.plan_type === 'admin';

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
      <div className="space-y-6">
        {isAdmin && (
          <div>
            <h3 className="text-xl font-semibold mb-4">User Engagement</h3>
            <UserEngagementMetrics />
          </div>
        )}
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