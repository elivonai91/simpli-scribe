import React from 'react';
import { Sparkles, Rocket, TrendingUp, Trophy } from 'lucide-react';
import { CategoryCarousel } from './CategoryCarousel';
import { PartnerService } from '@/types/subscription';

interface DiscoveryContentProps {
  recommendedServices: PartnerService[];
  newReleases: PartnerService[];
  trendingSubscriptions: PartnerService[];
  popularSubscriptions: PartnerService[];
  categories: string[];
  getSubscriptionsByCategory: (category: string) => PartnerService[];
  handleCompare: (subscription: PartnerService) => void;
  selectedForComparison: PartnerService[];
}

export const DiscoveryContent = ({
  recommendedServices,
  newReleases,
  trendingSubscriptions,
  popularSubscriptions,
  categories,
  getSubscriptionsByCategory,
  handleCompare,
  selectedForComparison
}: DiscoveryContentProps) => {
  return (
    <section className="space-y-8">
      <CategoryCarousel
        title={
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#ff3da6]" />
            <span className="text-[#ff3da6]">Recommended for You</span>
          </div>
        }
        subscriptions={recommendedServices}
        onSeeAll={() => console.log('See all recommendations')}
        onCompare={handleCompare}
        selectedForComparison={selectedForComparison}
      />

      <CategoryCarousel
        title={
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-[#ff3da6]" />
            <span className="text-[#ff3da6]">New Releases</span>
          </div>
        }
        subscriptions={newReleases}
        onSeeAll={() => console.log('See all new releases')}
      />

      <CategoryCarousel
        title={
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#bf0bad]" />
            <span className="text-[#bf0bad]">Trending Now</span>
          </div>
        }
        subscriptions={trendingSubscriptions}
        onSeeAll={() => console.log('See all trending')}
      />

      <CategoryCarousel
        title={
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#662d91]" />
            <span className="text-[#662d91]">Most Popular</span>
          </div>
        }
        subscriptions={popularSubscriptions}
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
  );
};