import React from 'react';
import { PartnerService } from '@/types/subscription';

interface SubscriptionDetailsProps {
  subscription: PartnerService;
}

export const SubscriptionDetails = ({ subscription }: SubscriptionDetailsProps) => {
  return (
    <div className="space-y-2">
      {subscription.api_integration && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ruby-500" />
          <span className="text-sm text-white/90">API Integration Available</span>
        </div>
      )}
      {subscription.affiliate_rate > 0 && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ruby-500" />
          <span className="text-sm text-white/90">Limited time offer</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-ruby-500" />
        <span className="text-sm text-white/90">
          Base price: ${subscription.base_price}/mo
        </span>
      </div>
      {subscription.premium_discount > 0 && (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-ruby-500" />
          <span className="text-sm text-white/90">
            Premium discount: {subscription.premium_discount}%
          </span>
        </div>
      )}
    </div>
  );
};