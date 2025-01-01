import React from 'react';
import { SubscriptionCard } from './SubscriptionCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import { PartnerService } from '@/types/subscription';

interface SubscriptionGridProps {
  subscriptions?: PartnerService[];
  isLoading: boolean;
}

export const SubscriptionGrid = ({ subscriptions, isLoading }: SubscriptionGridProps) => {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No subscriptions found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((subscription) => (
        <SubscriptionCard key={subscription.id} subscription={subscription} />
      ))}
    </div>
  );
};