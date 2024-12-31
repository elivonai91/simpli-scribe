import React from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import FeatureProgress from './FeatureProgress';
import PlanCard from './PlanCard';

const Features = () => {
  const session = useSession();
  const { subscriptions } = useSubscriptions();

  const tiers = [
    {
      name: 'Simplittle Plan',
      price: {
        monthly: '$5.99/mo',
        yearly: '$59.99/yr',
        yearlyNote: '(2 months free!)'
      },
      features: [
        { name: 'Up to 20 subscriptions', included: true },
        { name: 'Customizable notifications scheduling', included: true },
        { name: 'Automated subscription detection', included: true },
        { name: 'Basic analytics and insights', included: true },
        { name: 'Self-service support', included: true },
        { name: 'All Simpli Plan features', included: true },
      ],
    },
    {
      name: 'Simplimediate Plan',
      price: {
        monthly: '$8.99/mo',
        yearly: '$89.99/yr',
        yearlyNote: '(2 months free!)'
      },
      features: [
        { name: 'Up to 50 subscriptions', included: true },
        { name: 'Advanced notification features', included: true },
        { name: 'Enhanced analytics dashboard', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Collaboration tools', included: true },
        { name: 'All Simplittle Plan features', included: true },
      ],
    },
    {
      name: 'Simplifessional Plan',
      price: {
        monthly: '$11.99/mo',
        yearly: '$119.99/yr',
        yearlyNote: '(2 months free!)'
      },
      features: [
        { name: 'All Simplimediate Plan features', included: true },
        { name: 'Advanced analytics & AI recommendations', included: true },
        { name: 'Multi-account family/business support', included: true },
        { name: 'Priority customer support', included: true },
        { name: 'One-click subscription management', included: true },
        { name: 'Secure cloud backup', included: true },
        { name: 'Early access to new features', included: true },
        { name: 'Exclusive partner discounts', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Higher collaboration limits', included: true },
        { name: 'Personalized financial planning', included: true },
      ],
    },
  ];

  const highlightedFeatures = [
    {
      title: 'Subscription Tracking',
      description: 'Track and manage all your subscriptions in one place',
      tier: 'Simplittle Plan',
    },
    {
      title: 'Automated Detection',
      description: 'Automatically detect and add new subscriptions',
      tier: 'Simplittle Plan',
    },
    {
      title: 'Custom Notifications',
      description: 'Set up custom notification schedules',
      tier: 'Simplittle Plan',
    },
    {
      title: 'Advanced Analytics',
      description: 'Get detailed insights and AI-powered recommendations',
      tier: 'Simplifessional Plan',
    },
    {
      title: 'Multi-Account Support',
      description: 'Manage family or business subscriptions',
      tier: 'Simplifessional Plan',
    },
    {
      title: 'Premium Perks',
      description: 'Exclusive discounts and early access to features',
      tier: 'Simplifessional Plan',
    },
  ];

  const userTier = 'Simplittle Plan'; // This should be fetched from user's actual subscription

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
            {tiers.slice(0, 2).map((tier) => (
              <PlanCard 
                key={tier.name}
                name={tier.name}
                price={tier.price}
                features={tier.features}
              />
            ))}
          </div>
          
          <div className="mt-8">
            <PlanCard 
              name={tiers[2].name}
              price={tiers[2].price}
              features={tiers[2].features}
              className="transform scale-105 shadow-xl bg-white/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;