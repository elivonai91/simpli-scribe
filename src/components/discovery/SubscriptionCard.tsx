import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Tag, Star, Clock } from 'lucide-react';
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
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{subscription.service_name}</h3>
            <div className="flex items-center gap-2 mt-2">
              <Tag className="w-4 h-4 text-ruby-500" />
              <span className="text-sm text-white/60">{subscription.category || 'Uncategorized'}</span>
            </div>
            {subscription.api_integration && (
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-white/60">API Integration Available</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-white">
              ${subscription.base_price}
              <span className="text-sm text-white/60">/mo</span>
            </div>
            {subscription.premium_discount > 0 && (
              <div className="text-sm text-emerald-500 mt-1">
                {subscription.premium_discount}% Premium discount
              </div>
            )}
            {subscription.affiliate_rate > 0 && (
              <div className="flex items-center gap-1 mt-2 text-amber-500/70 text-sm">
                <Clock className="w-3 h-3" />
                <span>Limited time offer</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);