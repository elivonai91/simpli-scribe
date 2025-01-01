import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scale } from "lucide-react";
import { PartnerService } from '@/types/subscription';

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="h-[280px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`
        group h-full relative overflow-hidden 
        bg-gradient-to-br from-[#662d91]/75 via-[#bf0bad]/75 to-[#ff3da6]/75 
        border-white/10 hover:border-white/20 transition-all
        ${isSelected ? 'ring-2 ring-[#ff3da6]' : ''}
      `}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 backdrop-blur-[1px]" />
        <CardContent className="relative p-6 h-full flex flex-col items-center">
          <motion.div
            animate={{
              scale: isHovered ? 0.8 : 1,
              opacity: isHovered ? 0.7 : 1
            }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {!imageError ? (
              <img
                src={`/api/subscription-logos/${subscription.service_name}`}
                alt={`${subscription.service_name} logo`}
                className="w-32 h-32 object-contain mb-4"
                onError={handleImageError}
              />
            ) : (
              <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-white text-4xl font-bold mb-4">
                {subscription.service_name[0]}
              </div>
            )}

            <h3 className="text-xl font-bold text-white mb-2">{subscription.service_name}</h3>
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 p-6 bg-gradient-to-b from-black/98 to-black/99 flex flex-col justify-between"
              >
                <div>
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
                </div>

                {onCompare && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompare(subscription);
                    }}
                    className={`
                      w-full mt-4
                      ${isSelected 
                        ? 'bg-[#ff3da6] hover:bg-[#ff3da6]/90' 
                        : 'bg-white/10 hover:bg-white/20'
                      }
                    `}
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    {isSelected ? 'Remove from Compare' : 'Add to Compare'}
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};