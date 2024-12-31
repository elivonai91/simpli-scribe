import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

interface UserMetrics {
  dau: number;
  mau: number;
  avgSessionLength: number;
  featureAdoptionRate: number;
  retentionRate: number;
}

export const UserEngagementMetrics = () => {
  const session = useSession();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['user-engagement-metrics'],
    queryFn: async () => {
      // Get DAU - users who had a session today
      const today = new Date();
      const todayStart = format(today, 'yyyy-MM-dd');
      const { data: dauData } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('session_start', todayStart)
        .lt('session_start', format(subDays(today, -1), 'yyyy-MM-dd'));

      // Get MAU - users who had a session this month
      const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd');
      const { data: mauData } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('session_start', monthStart)
        .lt('session_start', monthEnd);

      // Get average session length
      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('session_start, session_end')
        .not('session_end', 'is', null);

      const avgSessionLength = sessionData?.reduce((acc, session) => {
        const start = new Date(session.session_start);
        const end = new Date(session.session_end!);
        return acc + (end.getTime() - start.getTime()) / (1000 * 60); // Convert to minutes
      }, 0) / (sessionData?.length || 1);

      // Get feature adoption rate
      const { data: featureData } = await supabase
        .from('feature_usage')
        .select('feature_name, user_id')
        .gte('used_at', monthStart);

      const uniqueUsersWithFeatures = new Set(featureData?.map(f => f.user_id));
      const featureAdoptionRate = (uniqueUsersWithFeatures.size / (mauData?.length || 1)) * 100;

      // Calculate retention rate (users who returned within 7 days)
      const lastWeek = format(subDays(today, 7), 'yyyy-MM-dd');
      const { data: returningUsers } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('session_start', lastWeek)
        .lt('session_start', todayStart);

      const retentionRate = ((returningUsers?.length || 0) / (mauData?.length || 1)) * 100;

      return {
        dau: new Set(dauData?.map(d => d.user_id)).size,
        mau: new Set(mauData?.map(d => d.user_id)).size,
        avgSessionLength: Math.round(avgSessionLength),
        featureAdoptionRate: Math.round(featureAdoptionRate),
        retentionRate: Math.round(retentionRate)
      };
    },
    enabled: !!session?.user
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-5">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.dau}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Active Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.mau}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Session Length</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.avgSessionLength} min</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feature Adoption</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.featureAdoptionRate}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.retentionRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
};