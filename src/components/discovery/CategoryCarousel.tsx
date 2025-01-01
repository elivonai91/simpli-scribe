import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SubscriptionCard } from './SubscriptionCard';
import { PartnerService } from '@/types/subscription';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CategoryCarouselProps {
  title: React.ReactNode;
  subscriptions: PartnerService[];
  onSeeAll: () => void;
  onCompare?: (subscription: PartnerService) => void;
  selectedForComparison?: PartnerService[];
}

export const CategoryCarousel = ({ 
  title, 
  subscriptions, 
  onSeeAll, 
  onCompare,
  selectedForComparison = []
}: CategoryCarouselProps) => {
  const displaySubscriptions = subscriptions.slice(0, 10);

  return (
    <div className="w-full py-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      <div className="relative">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {displaySubscriptions.map((subscription) => (
              <CarouselItem key={subscription.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <SubscriptionCard 
                  subscription={subscription}
                  onCompare={onCompare}
                  isSelected={selectedForComparison?.some(s => s.id === subscription.id)}
                />
              </CarouselItem>
            ))}
            <CarouselItem className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onSeeAll}
                className="h-full cursor-pointer"
              >
                <div className="h-full rounded-lg bg-charcoal-800/50 border border-white/5 hover:border-white/10 transition-all flex flex-col items-center justify-center p-6">
                  <ArrowRight className="w-12 h-12 text-white/40 mb-4" />
                  <span className="text-lg font-medium text-white">See All</span>
                  <span className="text-sm text-white/60">{subscriptions.length} subscriptions</span>
                </div>
              </motion.div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </div>
  );
};