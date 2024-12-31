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
      if (!session?.user?.id) return null;
      
      const { data: subscriptions, error } = await supabase
        .from('user_subscriptions')
        .select('billing_amount, billing_cycle, service_category')
        .eq('user_id', session.user.id);

      if (error) throw error;

      // If no subscriptions, return default values to prevent undefined
      if (!subscriptions || subscriptions.length === 0) {
        return {
          totalSubscriptions: 0,
          totalMonthlySpend: 0,
          categoryCount: 0,
          averageCost: 0
        };
      }

      const totalMonthlySpend = subscriptions.reduce((acc, sub) => {
        const amount = sub.billing_cycle === 'yearly' 
          ? sub.billing_amount / 12 
          : sub.billing_amount;
        return acc + amount;
      }, 0);

      const categoryCount = new Set(subscriptions.map(sub => sub.service_category)).size;

      return {
        totalSubscriptions: subscriptions.length,
        totalMonthlySpend,
        categoryCount,
        averageCost: subscriptions.length > 0 ? totalMonthlySpend / subscriptions.length : 0
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

  // If no metrics data, show zeros
  const displayMetrics = metrics || {
    totalSubscriptions: 0,
    totalMonthlySpend: 0,
    categoryCount: 0,
    averageCost: 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayMetrics.totalSubscriptions}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Spend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${displayMetrics.totalMonthlySpend.toFixed(2)}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayMetrics.categoryCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${displayMetrics.averageCost.toFixed(2)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};