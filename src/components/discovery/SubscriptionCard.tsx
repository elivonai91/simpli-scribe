import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Tag, Star, Clock, TrendingUp } from 'lucide-react';
import { PartnerService } from '@/types/subscription';
import { formatDistanceToNow } from 'date-fns';

interface SubscriptionCardProps {
  subscription: PartnerService;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const isNewRelease = new Date(subscription.release_date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
  const isPopular = subscription.popularity_score >= 90;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="group h-[280px] relative overflow-hidden bg-gradient-to-br from-[#662d91]/20 to-transparent backdrop-blur-sm border-white/5 hover:border-white/10 transition-all">
        <div className="absolute inset-0 bg-gradient-to-br from-[#662d91]/10 via-[#bf0bad]/5 to-[#ff3da6]/10 opacity-50" />
        <div className="absolute inset-0 bg-white/5 backdrop-blur-[2px]" />
        <CardContent className="relative p-6 h-full overflow-hidden group-hover:overflow-auto transition-all">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-[#ff3da6]">
                  {subscription.service_name}
                </h3>
                {isNewRelease && (
                  <span className="px-2 py-1 text-xs font-medium bg-[#bf0bad]/20 text-[#ff3da6] rounded-full">
                    New
                  </span>
                )}
                {isPopular && (
                  <span className="px-2 py-1 text-xs font-medium bg-[#662d91]/20 text-[#bf0bad] rounded-full">
                    Popular
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {subscription.genre?.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 text-xs rounded-full bg-[#662d91]/10 text-[#ff3da6]"
                  >
                    {g}
                  </span>
                ))}
              </div>

              {subscription.api_integration && (
                <div className="flex items-center gap-2 mt-3">
                  <Star className="w-4 h-4 text-[#bf0bad]" />
                  <span className="text-sm text-[#ff3da6]/90">API Integration Available</span>
                </div>
              )}

              <div className="mt-3 text-sm text-[#662d91]">
                Released {formatDistanceToNow(new Date(subscription.release_date))} ago
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-[#ff3da6]">
                ${subscription.base_price}
                <span className="text-sm text-[#662d91]">/mo</span>
              </div>
              {subscription.premium_discount > 0 && (
                <div className="text-sm text-[#bf0bad] mt-1">
                  {subscription.premium_discount}% Premium discount
                </div>
              )}
              {subscription.affiliate_rate > 0 && (
                <div className="flex items-center gap-1 mt-2 text-sm text-[#662d91]">
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
};