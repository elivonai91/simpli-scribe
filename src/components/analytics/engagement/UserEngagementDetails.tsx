import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';

const COLORS = ['#9b87f5', '#7E69AB', '#D946EF', '#FFDEE2', '#FF69B4'];

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
      
      return {
        date: format(start, 'MMM dd'),
        duration,
        features: session.features_used?.length || 0
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
      <Card>
        <CardHeader>
          <CardTitle>Session Duration Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sessionMetrics}>
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #ccc',
                  borderRadius: '4px'
                }}
              />
              <Bar dataKey="duration" fill="#9b87f5" name="Duration (minutes)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={featureMetrics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {featureMetrics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Feature Usage</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionMetrics}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                />
                <Bar dataKey="features" fill="#D946EF" name="Features Used" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};