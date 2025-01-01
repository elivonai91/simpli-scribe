import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const EmptySubscriptions = () => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-white mb-2">
        No active subscriptions
      </h3>
      <p className="text-white/70 mb-6">
        Start tracking your subscriptions by adding your first one
      </p>
      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <Plus className="w-4 h-4 mr-2" />
        Add Your First Subscription
      </Button>
    </div>
  );
};