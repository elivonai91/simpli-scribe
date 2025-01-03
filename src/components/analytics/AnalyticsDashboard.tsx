import React from 'react';
import { SubscriptionMetrics } from './SubscriptionMetrics';
import { SpendingTrends } from './SpendingTrends';
import { CategoryDistribution } from './CategoryDistribution';
import { UserEngagementMetrics } from './UserEngagementMetrics';
import { UserEngagementDetails } from './engagement/UserEngagementDetails';
import { SubscriptionGrowth } from './subscription/SubscriptionGrowth';
import { ChurnAnalysis } from './subscription/ChurnAnalysis';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BillingCycleDistribution } from './metrics/BillingCycleDistribution';
import { TopSpendingCategories } from './metrics/TopSpendingCategories';
import { SubscriptionTrends } from './metrics/SubscriptionTrends';

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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight text-white">Analytics Dashboard</h2>
      <div className="space-y-6">
        {isAdmin && (
          <>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white/90">User Engagement Overview</h3>
              <UserEngagementMetrics />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white/90">Detailed Engagement Analytics</h3>
              <UserEngagementDetails />
            </div>
          </>
        )}
        
        <div>
          <h3 className="text-xl font-semibold mb-4 text-white/90">Subscription Overview</h3>
          <SubscriptionMetrics />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
            <TopSpendingCategories />
          </div>
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
            <BillingCycleDistribution />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-white/90">Subscription Growth & Churn</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
              <SubscriptionGrowth />
            </div>
            <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
              <ChurnAnalysis />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 text-white/90">Subscription Trends</h3>
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
            <SubscriptionTrends />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
            <SpendingTrends />
          </div>
          <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 border border-white/10">
            <CategoryDistribution />
          </div>
        </div>
      </div>
    </div>
  );
};