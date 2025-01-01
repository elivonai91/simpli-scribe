import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Tag } from 'lucide-react';
import { PartnerService } from '@/types/subscription';

interface SubscriptionCardProps {
  subscription: PartnerService;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <Card className="h-full bg-charcoal-800/50 border-white/5 hover:border-white/10 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">{subscription.service_name}</h3>
            <div className="flex items-center gap-2 mt-4">
              <Tag className="w-4 h-4 text-ruby-500" />
              <span className="text-sm text-white/60">{subscription.category}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              ${subscription.base_price}
              <span className="text-sm text-white/60">/mo</span>
            </div>
            {subscription.premium_discount > 0 && (
              <div className="text-sm text-emerald-500">
                {subscription.premium_discount}% Premium discount
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);