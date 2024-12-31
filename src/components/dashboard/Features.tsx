import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Lock } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { cn } from '@/lib/utils';

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
      isPopular: true,
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
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-white text-center">Feature Progress</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {highlightedFeatures.map((feature) => (
            <Card 
              key={feature.title}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                userTier === feature.tier ? "bg-white/10" : "bg-white/5"
              )}
            >
              <div className={cn(
                "absolute inset-0 backdrop-blur-sm transition-opacity",
                userTier === feature.tier ? "opacity-0" : "opacity-100 bg-black/40"
              )}>
                <div className="flex items-center justify-center h-full">
                  <Lock className="w-8 h-8 text-white/50" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70">{feature.description}</p>
                <div className="mt-2 text-sm text-white/50">
                  Available in: {feature.tier}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-white text-center mb-12">Subscription Plans</h2>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {tiers.slice(0, 2).map((tier) => (
              <Card 
                key={tier.name} 
                className="backdrop-blur-xl border-white/10 bg-white/10"
              >
                <CardHeader>
                  <CardTitle className="text-xl text-white">
                    {tier.name}
                    <div className="flex flex-col space-y-1 mt-2">
                      <span className="text-lg font-normal text-white/80">
                        {tier.price.monthly}
                      </span>
                      <span className="text-sm font-normal text-white/60">
                        or {tier.price.yearly} {tier.price.yearlyNote}
                      </span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {tier.features.map((feature) => (
                      <li key={feature.name} className="flex items-center gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500" />
                        ) : (
                          <X className="w-5 h-5 text-red-500" />
                        )}
                        <span className="text-white/90">{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <Card 
              className="backdrop-blur-xl border-white/10 bg-white/20 transform scale-105 shadow-xl"
            >
              <CardHeader>
                <CardTitle className="text-2xl text-white text-center">
                  {tiers[2].name}
                  <div className="flex flex-col space-y-1 mt-2">
                    <span className="text-xl font-normal text-white/80">
                      {tiers[2].price.monthly}
                    </span>
                    <span className="text-sm font-normal text-white/60">
                      or {tiers[2].price.yearly} {tiers[2].price.yearlyNote}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tiers[2].features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-white/90">{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;