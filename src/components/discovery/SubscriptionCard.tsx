import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { Tag, Star, Clock, TrendingUp } from 'lucide-react';
import { PartnerService } from '@/types/subscription';
import { formatDistanceToNow } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionCardProps {
  subscription: PartnerService;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const [accentColor, setAccentColor] = useState<string>('#ffffff');
  const isNewRelease = new Date(subscription.release_date).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000;
  const isPopular = subscription.popularity_score >= 90;

  useEffect(() => {
    const fetchLogoAndExtractColor = async () => {
      try {
        const { data, error } = await supabase
          .from('subscription_logos')
          .select('logo_path')
          .eq('service_name', subscription.service_name)
          .single();

        if (error) throw error;

        if (data?.logo_path) {
          // For now, we'll use predefined colors based on service name
          // In a real implementation, you might want to use a color extraction library
          const colors = {
            'Netflix': '#E50914',
            'Spotify': '#1DB954',
            'Disney+': '#0063E5',
            'Amazon Prime': '#00A8E1',
            'HBO Max': '#B535F6',
            'Apple TV+': '#000000',
            // Add more services as needed
          };

          setAccentColor(colors[subscription.service_name] || '#9b87f5'); // Default to primary purple
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
        setAccentColor('#9b87f5'); // Default to primary purple on error
      }
    };

    fetchLogoAndExtractColor();
  }, [subscription.service_name]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="h-full bg-charcoal-800/50 border-white/5 hover:border-white/10 transition-all">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: accentColor }}
                >
                  {subscription.service_name}
                </h3>
                {isNewRelease && (
                  <span className="px-2 py-1 text-xs font-medium bg-ruby-500/20 text-ruby-500 rounded-full">
                    New
                  </span>
                )}
                {isPopular && (
                  <span className="px-2 py-1 text-xs font-medium bg-amber-500/20 text-amber-500 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {subscription.genre?.map((g) => (
                  <span
                    key={g}
                    className="px-2 py-1 text-xs rounded-full"
                    style={{ 
                      backgroundColor: `${accentColor}20`,
                      color: accentColor 
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>

              {subscription.api_integration && (
                <div className="flex items-center gap-2 mt-3">
                  <Star className="w-4 h-4" style={{ color: accentColor }} />
                  <span className="text-sm text-white/60">API Integration Available</span>
                </div>
              )}

              <div className="mt-3 text-sm text-white/60">
                Released {formatDistanceToNow(new Date(subscription.release_date))} ago
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: accentColor }}>
                ${subscription.base_price}
                <span className="text-sm text-white/60">/mo</span>
              </div>
              {subscription.premium_discount > 0 && (
                <div className="text-sm text-emerald-500 mt-1">
                  {subscription.premium_discount}% Premium discount
                </div>
              )}
              {subscription.affiliate_rate > 0 && (
                <div 
                  className="flex items-center gap-1 mt-2 text-sm"
                  style={{ color: `${accentColor}B3` }}
                >
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