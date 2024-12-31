import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

export interface EngagementMetrics {
  dau: number;
  mau: number;
  avgSessionLength: number;
  featureAdoptionRate: number;
  retentionRate: number;
}

export const useEngagementMetrics = () => {
  const session = useSession();

  return useQuery({
    queryKey: ['user-engagement-metrics'],
    queryFn: async () => {
      if (!session?.user) return null;

      const today = new Date();
      const todayStart = format(today, 'yyyy-MM-dd');
      const monthStart = format(startOfMonth(today), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(today), 'yyyy-MM-dd');
      const lastWeek = format(subDays(today, 7), 'yyyy-MM-dd');

      // Get DAU
      const { data: dauData } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('session_start', todayStart)
        .lt('session_start', format(subDays(today, -1), 'yyyy-MM-dd'));

      // Get MAU
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

      // Get feature adoption rate
      const { data: featureData } = await supabase
        .from('feature_usage')
        .select('feature_name, user_id')
        .gte('used_at', monthStart);

      // Get retention data
      const { data: returningUsers } = await supabase
        .from('user_sessions')
        .select('user_id')
        .gte('session_start', lastWeek)
        .lt('session_start', todayStart);

      const avgSessionLength = sessionData?.reduce((acc, session) => {
        const start = new Date(session.session_start);
        const end = new Date(session.session_end!);
        return acc + (end.getTime() - start.getTime()) / (1000 * 60);
      }, 0) / (sessionData?.length || 1);

      const uniqueUsersWithFeatures = new Set(featureData?.map(f => f.user_id));
      const featureAdoptionRate = (uniqueUsersWithFeatures.size / (mauData?.length || 1)) * 100;
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
};