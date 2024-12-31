import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { SessionDurationChart } from './charts/SessionDurationChart';
import { FeatureUsageChart } from './charts/FeatureUsageChart';
import { DailyFeatureUsageChart } from './charts/DailyFeatureUsageChart';

export const UserEngagementDetails = () => {
  // Fetch session data for the last 30 days
  const { data: sessionData, isLoading: isLoadingSession } = useQuery({
    queryKey: ['user-session-details'],
    queryFn: async () => {
      const thirtyDaysAgo = format(subDays(new Date(), 30), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .gte('session_start', thirtyDaysAgo)
        .order('session_start', { ascending: true });

      if (error) throw error;
      return data;
    }
  });

  // Fetch feature usage data
  const { data: featureData, isLoading: isLoadingFeatures } = useQuery({
    queryKey: ['feature-usage-details'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feature_usage')
        .select('*')
        .order('used_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  // Process session data for visualization
  const sessionMetrics = React.useMemo(() => {
    if (!sessionData) return [];
    
    return sessionData.map(session => {
      const start = new Date(session.session_start);
      const end = session.session_end ? new Date(session.session_end) : new Date();
      const duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // in minutes
      
      // Safely handle features_used array
      const featuresUsed = Array.isArray(session.features_used) ? session.features_used.length : 0;
      
      return {
        date: format(start, 'MMM dd'),
        duration,
        features: featuresUsed
      };
    });
  }, [sessionData]);

  // Process feature usage data
  const featureMetrics = React.useMemo(() => {
    if (!featureData) return [];
    
    const featureCounts: Record<string, number> = {};
    featureData.forEach(usage => {
      featureCounts[usage.feature_name] = (featureCounts[usage.feature_name] || 0) + 1;
    });

    return Object.entries(featureCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 features
  }, [featureData]);

  if (isLoadingSession || isLoadingFeatures) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SessionDurationChart sessionMetrics={sessionMetrics} />
      <div className="grid gap-6 md:grid-cols-2">
        <FeatureUsageChart featureMetrics={featureMetrics} />
        <DailyFeatureUsageChart dailyMetrics={sessionMetrics} />
      </div>
    </div>
  );
};