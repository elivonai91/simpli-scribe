import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { PartnerService } from '@/types/subscription';
import { SubscriptionLogo } from './subscription-card/SubscriptionLogo';
import { SubscriptionDetails } from './subscription-card/SubscriptionDetails';
import { SubscriptionActions } from './subscription-card/SubscriptionActions';

interface SubscriptionCardProps {
  subscription: PartnerService;
  onCompare?: (subscription: PartnerService) => void;
  isSelected?: boolean;
}

export const SubscriptionCard = ({ 
  subscription, 
  onCompare,
  isSelected = false
}: SubscriptionCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.error(`Failed to load image for ${subscription.service_name}`);
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.15,
        zIndex: 50,
        transition: { 
          type: "spring",
          stiffness: 300,
          damping: 20
        }
      }}
      className="relative min-h-[280px] perspective-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`
        group h-full relative overflow-hidden transform-style-3d
        bg-gradient-to-br from-[#662d91]/75 via-[#bf0bad]/75 to-[#ff3da6]/75 
        border-white/10 hover:border-white/20 transition-all duration-300
        ${isSelected ? 'ring-2 ring-[#ff3da6]' : ''}
        ${isHovered ? 'shadow-2xl shadow-purple-500/30' : ''}
      `}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <CardContent className="relative p-6 h-full flex flex-col items-center">
          <motion.div
            animate={{
              scale: isHovered ? 0.9 : 1,
              opacity: isHovered ? 0.7 : 1,
              y: isHovered ? -15 : 0
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <SubscriptionLogo
              serviceName={subscription.service_name}
              onError={handleImageError}
              hasError={imageError}
            />

            <h3 className="text-xl font-bold text-white mb-2 text-center">{subscription.service_name}</h3>
            <div className="text-lg font-bold text-white">
              ${subscription.base_price}
              <span className="text-sm text-white/70">/mo</span>
            </div>
            {subscription.premium_discount > 0 && (
              <div className="text-sm text-ruby-500 mt-1">
                {subscription.premium_discount}% Premium discount
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute inset-0 p-6 bg-gradient-to-b from-black/98 to-black/99 flex flex-col justify-between"
                style={{
                  minHeight: '100%',
                  height: 'auto'
                }}
              >
                <div className="space-y-4 overflow-y-auto max-h-[calc(100%-60px)]">
                  <h3 className="text-xl font-bold text-white mb-2">{subscription.service_name}</h3>
                  {subscription.genre && subscription.genre.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {subscription.genre.map((g) => (
                        <span
                          key={g}
                          className="px-2 py-1 text-xs rounded-full bg-black/20 text-white border border-white/20"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <SubscriptionDetails subscription={subscription} />
                </div>

                <SubscriptionActions
                  subscription={subscription}
                  onCompare={onCompare}
                  isSelected={isSelected}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};