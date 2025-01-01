import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { FeaturesList } from './features/FeaturesList';
import { SubscriptionPlansSection } from './features/SubscriptionPlansSection';

const Features = () => {
  const session = useSession();
  const { subscriptions } = useSubscriptions();

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
      <FeaturesList 
        userTier={userTier}
        highlightedFeatures={highlightedFeatures}
      />
      <SubscriptionPlansSection />
    </div>
  );
};

export default Features;