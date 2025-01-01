import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { SubscriptionComparison } from '@/components/discovery/SubscriptionComparison';
import { useRecommendations } from '@/hooks/useRecommendations';
import { PartnerService } from '@/types/subscription';
import { DiscoveryHeader } from '@/components/discovery/DiscoveryHeader';
import { DiscoveryContent } from '@/components/discovery/DiscoveryContent';

const Discovery = () => {
  const [activeTab, setActiveTab] = React.useState('overview');
  const [selectedForComparison, setSelectedForComparison] = useState<PartnerService[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  
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

  const handleCompare = (subscription: PartnerService) => {
    if (selectedForComparison.find(s => s.id === subscription.id)) {
      setSelectedForComparison(current => current.filter(s => s.id !== subscription.id));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(current => [...current, subscription]);
    }
  };

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
          <DiscoveryHeader
            isGenerating={isGenerating}
            generateRecommendations={generateRecommendations}
            selectedForComparison={selectedForComparison}
            setShowComparison={setShowComparison}
          />

          <DiscoveryContent
            recommendedServices={getRecommendedServices()}
            newReleases={getNewReleases()}
            trendingSubscriptions={getTrendingSubscriptions()}
            popularSubscriptions={getPopularSubscriptions()}
            categories={categories}
            getSubscriptionsByCategory={getSubscriptionsByCategory}
            handleCompare={handleCompare}
            selectedForComparison={selectedForComparison}
          />
        </div>
      </div>

      <AnimatePresence>
        {showComparison && (
          <SubscriptionComparison
            subscriptions={selectedForComparison}
            onClose={() => {
              setShowComparison(false);
              setSelectedForComparison([]);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Discovery;