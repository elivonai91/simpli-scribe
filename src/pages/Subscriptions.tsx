import React from 'react';
import { SubscriptionsTab } from '@/components/dashboard/SubscriptionsTab';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

const Subscriptions = () => {
  return (
    <SubscriptionProvider>
      <div className="container mx-auto px-4 py-8">
        <SubscriptionsTab />
      </div>
    </SubscriptionProvider>
  );
};

export default Subscriptions;