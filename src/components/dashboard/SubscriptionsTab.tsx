import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from '@/hooks/use-toast';
import { CurrentPlanCard } from './subscriptions/CurrentPlanCard';
import { ActiveSubscriptionsCard } from './subscriptions/ActiveSubscriptionsCard';
import { PremiumFeaturesCard } from './subscriptions/PremiumFeaturesCard';

export const SubscriptionsTab = () => {
  const session = useSession();

  const { data: userSubscriptions, isLoading: userSubsLoading } = useQuery({
    queryKey: ['userSubscriptions', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', session?.user?.id);
      
      if (error) {
        console.error('Error fetching user subscriptions:', error);
        toast({
          title: "Error",
          description: "Failed to load your subscriptions",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log('User subscriptions:', data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      console.log('Fetching subscription plans...');
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('monthly_price', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription plans:', error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log('Fetched subscription plans:', data);
      return data;
    }
  });

  if (plansLoading || userSubsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Use the first plan as current plan or fallback to a default
  const currentPlan = subscriptionPlans?.[0] || {
    name: 'Basic',
    description: 'Free tier',
    features: []
  };

  return (
    <div className="space-y-6">
      <CurrentPlanCard currentPlan={currentPlan} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActiveSubscriptionsCard 
          subscriptionsCount={userSubscriptions?.length || 0} 
        />
        <PremiumFeaturesCard currentPlan={currentPlan} />
      </div>
    </div>
  );
};