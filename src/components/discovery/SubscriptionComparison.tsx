import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Check, AlertCircle } from 'lucide-react';
import { PartnerService } from '@/types/subscription';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionComparisonProps {
  subscriptions: PartnerService[];
  onClose: () => void;
}

export const SubscriptionComparison = ({ subscriptions, onClose }: SubscriptionComparisonProps) => {
  const { toast } = useToast();

  const compareFeatures = (subscription: PartnerService) => {
    const features = [];
    
    // Base price
    features.push({
      name: 'Base Price',
      value: `$${subscription.base_price}/mo`
    });
    
    // Premium discount
    features.push({
      name: 'Premium Discount',
      value: subscription.premium_discount ? `${subscription.premium_discount}%` : 'None'
    });
    
    // API Integration
    features.push({
      name: 'API Integration',
      value: subscription.api_integration
    });
    
    // Genre/Categories
    features.push({
      name: 'Categories',
      value: subscription.genre?.join(', ') || 'None'
    });

    return features;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <Card className="w-full max-w-6xl max-h-[80vh] overflow-auto bg-charcoal-900/95 border-white/10">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Subscription Comparison</h2>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map((subscription) => (
              <motion.div
                key={subscription.id}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative"
              >
                <Card className="bg-gradient-to-br from-[#662d91]/75 via-[#bf0bad]/75 to-[#ff3da6]/75 border-white/10">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{subscription.service_name}</h3>
                    
                    <div className="space-y-4">
                      {compareFeatures(subscription).map((feature, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-white/70">{feature.name}</span>
                          {typeof feature.value === 'boolean' ? (
                            feature.value ? (
                              <Check className="h-5 w-5 text-green-500" />
                            ) : (
                              <X className="h-5 w-5 text-red-500" />
                            )
                          ) : (
                            <span className="text-white">{feature.value}</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full mt-6 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() => {
                        toast({
                          title: "Feature coming soon!",
                          description: "Direct subscription management will be available in a future update.",
                          variant: "default",
                        });
                      }}
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};