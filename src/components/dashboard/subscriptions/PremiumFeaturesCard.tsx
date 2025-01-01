import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { SubscriptionPlan } from '@/types/subscription';

interface PremiumFeaturesCardProps {
  currentPlan: SubscriptionPlan;
}

export const PremiumFeaturesCard = ({ currentPlan }: PremiumFeaturesCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Premium Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-white/70">
            {currentPlan?.features?.map((feature: string, index: number) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-purple-400">✓</span> {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
};