import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Sparkles } from 'lucide-react';
import { SubscriptionGrid } from '@/components/discovery/SubscriptionGrid';

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
            <SubscriptionGrid 
              subscriptions={trendingSubscriptions} 
              isLoading={trendingLoading} 
            />
          </TabsContent>

          <TabsContent value="personalized">
            <SubscriptionGrid 
              subscriptions={personalizedRecommendations} 
              isLoading={personalizedLoading} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Discovery;