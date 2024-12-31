import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { Loader2 } from 'lucide-react';

export const SubscriptionMetrics = () => {
  const session = useSession();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['subscription-metrics'],
    queryFn: async () => {
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('billing_amount, billing_cycle, service_category')
        .eq('user_id', session?.user?.id);

      if (error) throw error;

      const totalMonthlySpend = subscriptions?.reduce((acc, sub) => {
        const amount = sub.billing_cycle === 'yearly' 
          ? sub.billing_amount / 12 
          : sub.billing_amount;
        return acc + amount;
      }, 0) || 0;

      const categoryCount = new Set(subscriptions?.map(sub => sub.service_category)).size;

      return {
        totalSubscriptions: subscriptions?.length || 0,
        totalMonthlySpend,
        categoryCount,
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
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalSubscriptions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${metrics?.totalMonthlySpend.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.categoryCount}</div>
        </CardContent>
      </Card>
    </div>
  );
};