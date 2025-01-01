import React from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Sparkles, Rocket, Trophy, Filter } from 'lucide-react';
import { SubscriptionGrid } from '@/components/discovery/SubscriptionGrid';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SearchBar } from '@/components/SearchBar';

const Discovery = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const { data: newReleases, isLoading: newReleasesLoading } = useQuery({
    queryKey: ['new-releases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .order('release_date', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

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

  const { data: popularSubscriptions, isLoading: popularLoading } = useQuery({
    queryKey: ['popular-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .order('popularity_score', { ascending: false })
        .limit(6);

      if (error) throw error;
      return data;
    }
  });

  const { data: categorySubscriptions, isLoading: categoryLoading } = useQuery({
    queryKey: ['category-subscriptions', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return [];
      
      const { data, error } = await supabase
        .from('partner_services')
        .select('*')
        .contains('genre', [selectedCategory])
        .limit(12);

      if (error) throw error;
      return data;
    },
    enabled: !!selectedCategory
  });

  const categories = [
    'Productivity',
    'Entertainment',
    'Games',
    'Creativity',
    'Development',
    'Professional'
  ];

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

            <div className="flex flex-wrap gap-3 mb-8">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl transition-colors ${
                    selectedCategory === category
                      ? 'bg-white/20 text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>

          {!selectedCategory ? (
            <>
              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Rocket className="w-5 h-5 text-ruby-500" />
                  <h2 className="text-xl font-semibold text-white">New Releases</h2>
                </div>
                <SubscriptionGrid 
                  subscriptions={newReleases} 
                  isLoading={newReleasesLoading} 
                />
              </section>

              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-xl font-semibold text-white">Trending Now</h2>
                </div>
                <SubscriptionGrid 
                  subscriptions={trendingSubscriptions} 
                  isLoading={trendingLoading} 
                />
              </section>

              <section className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h2 className="text-xl font-semibold text-white">Most Popular</h2>
                </div>
                <SubscriptionGrid 
                  subscriptions={popularSubscriptions} 
                  isLoading={popularLoading} 
                />
              </section>
            </>
          ) : (
            <section>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-white/70" />
                  <h2 className="text-xl font-semibold text-white">{selectedCategory}</h2>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-white/70 hover:text-white"
                >
                  Clear Filter
                </button>
              </div>
              <SubscriptionGrid 
                subscriptions={categorySubscriptions} 
                isLoading={categoryLoading} 
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discovery;