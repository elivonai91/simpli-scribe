import React from 'react';
import { motion } from 'framer-motion';
import { Subscription } from '@/types/subscription';
import { SubscriptionCard } from '@/components/SubscriptionCard';

interface SubscriptionGridProps {
  subscriptions: Subscription[];
}

export const SubscriptionGrid = ({ subscriptions }: SubscriptionGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((subscription, index) => (
        <motion.div
          key={subscription.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SubscriptionCard subscription={subscription} />
        </motion.div>
      ))}
    </div>
  );
};