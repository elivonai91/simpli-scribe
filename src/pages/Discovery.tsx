import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Sparkles, Tag } from 'lucide-react';

interface PartnerService {
  id: string;
  service_name: string;
  category: string;
  base_price: number;
  premium_discount: number;
  affiliate_rate: number;
  api_integration: boolean;
  created_at: string;
}

const Discovery = () => {
  const { data: trendingSubscriptions, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .order('affiliate_rate', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  const { data: personalizedRecommendations, isLoading: personalizedLoading } = useQuery({
    queryKey: ['personalized-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  const SubscriptionCard = ({ subscription }: { subscription: PartnerService }) => (
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

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="h-[200px] bg-charcoal-800/50 border-white/5">
          <CardContent className="p-6">
            <Skeleton className="h-6 w-3/4 bg-white/5 mb-4" />
            <Skeleton className="h-4 w-full bg-white/5 mb-2" />
            <Skeleton className="h-4 w-2/3 bg-white/5" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Discover Subscriptions</h1>
          <p className="text-white/70">Find your next perfect subscription match</p>
        </motion.div>

        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="mb-8 bg-charcoal-800/50 border-white/5">
            <TabsTrigger value="trending" className="data-[state=active]:bg-white/10">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending Now
            </TabsTrigger>
            <TabsTrigger value="personalized" className="data-[state=active]:bg-white/10">
              <Sparkles className="w-4 h-4 mr-2" />
              Recommended for You
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending">
            {trendingLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingSubscriptions?.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="personalized">
            {personalizedLoading ? (
              <LoadingSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {personalizedRecommendations?.map((subscription) => (
                  <SubscriptionCard key={subscription.id} subscription={subscription} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Discovery;