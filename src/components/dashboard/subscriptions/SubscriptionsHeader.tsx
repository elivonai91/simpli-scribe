import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DetectSubscriptionsButton } from './DetectSubscriptionsButton';

interface SubscriptionsHeaderProps {
  subscriptionCount: number;
}

export const SubscriptionsHeader = ({ subscriptionCount }: SubscriptionsHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Active Subscriptions ({subscriptionCount})
        </h2>
        <p className="text-white/70">
          Manage and track all your subscriptions in one place
        </p>
      </div>
      <div className="flex gap-2">
        <DetectSubscriptionsButton />
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>
    </div>
  );
};