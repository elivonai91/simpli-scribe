import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActiveSubscriptionsCardProps {
  subscriptionsCount: number;
}

export const ActiveSubscriptionsCard = ({ subscriptionsCount }: ActiveSubscriptionsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <CreditCard className="h-6 w-6 text-purple-400" />
            Active Subscriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscriptionsCount === 0 ? (
            <div className="text-center py-4">
              <p className="text-white/70 mb-4">No active subscriptions yet</p>
              <Button className="bg-purple-500 hover:bg-purple-600">
                <Plus className="w-4 h-4 mr-2" /> Add Subscription
              </Button>
            </div>
          ) : (
            <>
              <div className="text-3xl font-bold text-white">
                {subscriptionsCount}
              </div>
              <p className="text-white/70">Total active subscriptions</p>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};