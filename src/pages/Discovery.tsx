import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Rocket, TrendingUp, Trophy, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SearchBar } from '@/components/SearchBar';
import { CategoryCarousel } from '@/components/discovery/CategoryCarousel';
import { useRecommendations } from '@/hooks/useRecommendations';
import { Button } from '@/components/ui/button';

const Discovery = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const { recommendations, isLoading: isLoadingRecommendations, generateRecommendations, isGenerating } = useRecommendations();

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

  const getRecommendedServices = () => {
    if (!recommendations) return [];
    return recommendations.map(rec => ({
      ...rec.partner_services,
      score: rec.score,
      reason: rec.reason
    }));
  };

  if (isLoading || isLoadingRecommendations) {
    return <div className="flex items-center justify-center h-screen bg-charcoal-900">
      <div className="text-[#ff3da6]">Loading...</div>
    </div>;
  }

  return (
    <div className="flex h-screen w-full bg-charcoal-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 text-center"
          >
            <div className="flex flex-col items-center justify-center gap-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#662d91] via-[#bf0bad] to-[#ff3da6] text-transparent bg-clip-text mb-4">
                Discovery
              </h1>
              <p className="text-[#662d91]/70">Find your next perfect subscription match</p>
              <div className="flex items-center gap-4">
                <SearchBar />
                <Button
                  onClick={() => generateRecommendations()}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#662d91] to-[#bf0bad] hover:from-[#662d91]/90 hover:to-[#bf0bad]/90"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Refresh Recommendations
                </Button>
              </div>
            </div>
          </motion.div>

          <section className="space-y-8">
            <CategoryCarousel
              title={
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#ff3da6]" />
                  <span className="text-[#ff3da6]">Recommended for You</span>
                </div>
              }
              subscriptions={getRecommendedServices()}
              onSeeAll={() => console.log('See all recommendations')}
            />

            <CategoryCarousel
              title={
                <div className="flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-[#ff3da6]" />
                  <span className="text-[#ff3da6]">New Releases</span>
                </div>
              }
              subscriptions={getNewReleases()}
              onSeeAll={() => console.log('See all new releases')}
            />

            <CategoryCarousel
              title={
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#bf0bad]" />
                  <span className="text-[#bf0bad]">Trending Now</span>
                </div>
              }
              subscriptions={getTrendingSubscriptions()}
              onSeeAll={() => console.log('See all trending')}
            />

            <CategoryCarousel
              title={
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#662d91]" />
                  <span className="text-[#662d91]">Most Popular</span>
                </div>
              }
              subscriptions={getPopularSubscriptions()}
              onSeeAll={() => console.log('See all popular')}
            />

            {categories.map((category) => (
              <CategoryCarousel
                key={category}
                title={<span className="text-[#bf0bad]">{category}</span>}
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