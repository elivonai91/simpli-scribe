import React from 'react';
import PlanCard from '../PlanCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionPlan {
  name: string;
  price: {
    monthly: string;
    yearly: string;
    yearlyNote: string;
  };
  features: {
    name: string;
    included: boolean;
  }[];
}

export const SubscriptionPlansSection = () => {
  const { data: subscriptionPlans = [], isLoading, error } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      console.log('Fetching subscription plans...');
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('monthly_price', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription plans:', error);
        throw error;
      }
      
      console.log('Fetched subscription plans:', data);
      
      return data.map(plan => ({
        name: plan.name,
        price: {
          monthly: `$${plan.monthly_price}/mo`,
          yearly: `$${plan.yearly_price}/yr`,
          yearlyNote: '(2 months free!)'
        },
        features: (plan.features as string[]).map(feature => ({
          name: feature,
          included: true
        }))
      }));
    }
  });

  if (isLoading) {
    return <div className="text-white text-center">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">Error loading subscription plans</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white text-center mb-12">Subscription Plans</h2>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {subscriptionPlans.slice(0, 2).map((plan: SubscriptionPlan) => (
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
  );
};