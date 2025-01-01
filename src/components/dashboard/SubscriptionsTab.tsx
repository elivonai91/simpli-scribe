import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { SubscriptionPlan } from '@/types/subscription';
import { SubscriptionsHeader } from './subscriptions/SubscriptionsHeader';
import { EmptySubscriptions } from './subscriptions/EmptySubscriptions';
import { SubscriptionGrid } from './subscriptions/SubscriptionGrid';

export const SubscriptionsTab = () => {
  const session = useSession();

  const { data: userSubscriptions, isLoading } = useQuery({
    queryKey: ['userSubscriptions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          subscription_plans (
            id,
            name,
            description,
            features,
            monthly_price,
            yearly_price,
            created_at
          )
        `)
        .eq('user_id', session.user.id)
        .eq('status', 'active');
      
      if (error) {
        console.error('Error fetching user subscriptions:', error);
        toast({
          title: "Error",
          description: "Failed to load your subscriptions",
          variant: "destructive"
        });
        throw error;
      }
      
      return data?.map(sub => {
        let validBillingCycle: 'monthly' | 'yearly' = 'monthly';
        if (sub.billing_cycle === 'monthly' || sub.billing_cycle === 'yearly') {
          validBillingCycle = sub.billing_cycle as 'monthly' | 'yearly';
        }

        const plan = sub.subscription_plans as any;
        const subscriptionPlan: SubscriptionPlan | null = plan ? {
          id: plan.id,
          name: plan.name,
          description: plan.description || '',
          features: Array.isArray(plan.features) ? plan.features : [],
          monthly_price: plan.monthly_price,
          yearly_price: plan.yearly_price,
          created_at: plan.created_at
        } : null;

        return {
          id: sub.id,
          name: sub.service_name,
          cost: sub.billing_amount,
          billingCycle: validBillingCycle,
          category: sub.service_category || 'Other',
          nextBillingDate: new Date(sub.next_billing_date),
          notes: sub.notes || '',
          reminders: { fortyEightHour: false, twentyFourHour: false },
          plans: subscriptionPlan ? [subscriptionPlan] : []
        };
      }) || [];
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading your subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubscriptionsHeader subscriptionCount={userSubscriptions?.length || 0} />
      {userSubscriptions?.length === 0 ? (
        <EmptySubscriptions />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <SubscriptionGrid subscriptions={userSubscriptions} />
        </motion.div>
      )}
    </div>
  );
};