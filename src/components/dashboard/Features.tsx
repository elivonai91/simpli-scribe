import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import FeatureProgress from './FeatureProgress';
import PlanCard from './PlanCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const Features = () => {
  const session = useSession();
  const { subscriptions } = useSubscriptions();

  const { data: subscriptionPlans = [] } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('monthly_price', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription plans:', error);
        throw error;
      }
      
      return data.map(plan => ({
        name: plan.name,
        price: {
          monthly: `$${plan.monthly_price}/mo`,
          yearly: `$${plan.yearly_price}/yr`,
          yearlyNote: '(2 months free!)'
        },
        features: plan.features.map((feature: string) => ({
          name: feature,
          included: true
        }))
      }));
    }
  });

  // Map subscription plans to highlighted features
  const highlightedFeatures = [
    {
      title: 'Subscription Tracking',
      description: 'Track and manage all your subscriptions in one place',
      tier: 'Basic',
    },
    {
      title: 'Automated Detection',
      description: 'Automatically detect and add new subscriptions',
      tier: 'Basic',
    },
    {
      title: 'Custom Notifications',
      description: 'Set up custom notification schedules',
      tier: 'Basic',
    },
    {
      title: 'Advanced Analytics',
      description: 'Get detailed insights and AI-powered recommendations',
      tier: 'Business',
    },
    {
      title: 'Multi-Account Support',
      description: 'Manage family or business subscriptions',
      tier: 'Business',
    },
    {
      title: 'Premium Perks',
      description: 'Exclusive discounts and early access to features',
      tier: 'Business',
    },
  ];

  const userTier = 'Basic'; // This should be fetched from user's actual subscription

  return (
    <div className="space-y-16">
      <FeatureProgress 
        userTier={userTier}
        highlightedFeatures={highlightedFeatures}
      />

      <div>
        <h2 className="text-3xl font-bold text-white text-center mb-12">Subscription Plans</h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {subscriptionPlans.slice(0, 2).map((plan) => (
              <PlanCard 
                key={plan.name}
                name={plan.name}
                price={plan.price}
                features={plan.features}
              />
            ))}
          </div>
          
          {subscriptionPlans.length > 2 && (
            <div className="mt-8">
              <PlanCard 
                name={subscriptionPlans[2].name}
                price={subscriptionPlans[2].price}
                features={subscriptionPlans[2].features}
                className="transform scale-105 shadow-xl bg-white/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Features;