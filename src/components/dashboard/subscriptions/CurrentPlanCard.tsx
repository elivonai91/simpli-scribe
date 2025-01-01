import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { SubscriptionPlan } from '@/types/subscription';

interface CurrentPlanCardProps {
  currentPlan: SubscriptionPlan;
}

export const CurrentPlanCard = ({ currentPlan }: CurrentPlanCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Package className="h-6 w-6 text-purple-400" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">{currentPlan?.name}</h3>
              <p className="text-white/70">{currentPlan?.description}</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};