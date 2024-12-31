import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

const Features = () => {
  const tiers = [
    {
      name: 'Free',
      features: [
        { name: 'Basic subscription tracking', included: true },
        { name: 'Manual subscription management', included: true },
        { name: 'Basic notifications', included: true },
        { name: 'Up to 5 subscriptions', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Unlimited subscriptions', included: false },
        { name: 'Category budgeting', included: false },
        { name: 'Custom notification schedules', included: false },
        { name: 'Priority support', included: false },
        { name: 'Subscription usage insights', included: false },
      ],
    },
    {
      name: 'Premium',
      features: [
        { name: 'Basic subscription tracking', included: true },
        { name: 'Manual subscription management', included: true },
        { name: 'Basic notifications', included: true },
        { name: 'Unlimited subscriptions', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Category budgeting', included: true },
        { name: 'Custom notification schedules', included: true },
        { name: 'Priority support', included: true },
        { name: 'Subscription usage insights', included: true },
      ],
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white mb-6">Feature Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tiers.map((tier) => (
          <Card key={tier.name} className="backdrop-blur-xl bg-white/10 border-white/10">
            <CardHeader>
              <CardTitle className="text-xl text-white">{tier.name} Plan</CardTitle>
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
    </div>
  );
};

export default Features;