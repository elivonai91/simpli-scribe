import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Rocket, TrendingUp, Trophy } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCarousel } from '@/components/discovery/CategoryCarousel';

const Discovery = () => {
  const [activeTab, setActiveTab] = React.useState('overview');

  const { data: allSubscriptions, isLoading } = useQuery({
    queryKey: ['all-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*');

      if (error) throw error;
      return data;
    }
  });

  const categories = [
    'Productivity',
    'Entertainment',
    'Games',
    'Creativity',
    'Development',
    'Professional'
  ];

  const getSubscriptionsByCategory = (category: string) => {
    return allSubscriptions?.filter(sub => 
      sub.genre?.includes(category)
    ) || [];
  };

  const getNewReleases = () => {
    return allSubscriptions?.sort((a, b) => 
      new Date(b.release_date || '').getTime() - new Date(a.release_date || '').getTime()
    ) || [];
  };

  const getTrendingSubscriptions = () => {
    return allSubscriptions?.sort((a, b) => 
      (b.affiliate_rate || 0) - (a.affiliate_rate || 0)
    ) || [];
  };

  const getPopularSubscriptions = () => {
    return allSubscriptions?.sort((a, b) => 
      (b.popularity_score || 0) - (a.popularity_score || 0)
    ) || [];
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-charcoal-900 to-charcoal-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Discover Subscriptions</h1>
                <p className="text-white/70">Find your next perfect subscription match</p>
              </div>
              <SearchBar />
            </div>
          </motion.div>

          <section className="space-y-8">
            <CategoryCarousel
              title={
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-ruby-500" />
                  <span>New Releases</span>
                </div>
              }
              subscriptions={getNewReleases()}
              onSeeAll={() => console.log('See all new releases')}
            />

            <CategoryCarousel
              title={
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <span>Trending Now</span>
                </div>
              }
              subscriptions={getTrendingSubscriptions()}
              onSeeAll={() => console.log('See all trending')}
            />

            <CategoryCarousel
              title={
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Most Popular</span>
                </div>
              }
              subscriptions={getPopularSubscriptions()}
              onSeeAll={() => console.log('See all popular')}
            />

            {categories.map((category) => (
              <CategoryCarousel
                key={category}
                title={category}
                subscriptions={getSubscriptionsByCategory(category)}
                onSeeAll={() => console.log(`See all ${category}`)}
              />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Discovery;