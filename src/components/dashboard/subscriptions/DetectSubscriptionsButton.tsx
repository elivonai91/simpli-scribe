import React from 'react';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useSubscriptionDetection } from '@/hooks/use-subscription-detection';

export const DetectSubscriptionsButton = () => {
  const { isDetecting, detectSubscriptions } = useSubscriptionDetection();

  return (
    <Button 
      onClick={detectSubscriptions}
      disabled={isDetecting}
      className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
    >
      <Search className="w-4 h-4 mr-2" />
      {isDetecting ? 'Detecting...' : 'Detect Subscriptions'}
    </Button>
  );
};