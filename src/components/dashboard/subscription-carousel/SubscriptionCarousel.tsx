import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CarouselCard } from './CarouselCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Subscription {
  name: string;
  description: string;
  features: string[];
  logoPath: string | null;
}

interface SubscriptionCarouselProps {
  subscriptions: Subscription[];
}

export const SubscriptionCarousel = ({ subscriptions }: SubscriptionCarouselProps) => {
  const [rotation, setRotation] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);

  React.useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      // Continuously increment rotation
      setRotation(current => current + (360 / subscriptions.length));
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoRotating, subscriptions.length]);

  const handleNext = () => {
    setIsAutoRotating(false);
    setRotation(current => current + (360 / subscriptions.length));
  };

  const handlePrev = () => {
    setIsAutoRotating(false);
    setRotation(current => current - (360 / subscriptions.length));
  };

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center"
      onMouseEnter={() => setIsAutoRotating(false)}
      onMouseLeave={() => setIsAutoRotating(true)}
    >
      <div className="relative w-full max-w-4xl h-full perspective-1000">
        <div className="absolute inset-0 flex items-center justify-center transform-style-3d">
          {subscriptions.map((subscription, index) => {
            // Calculate each card's rotation based on its index and the current rotation
            const cardRotation = ((index * (360 / subscriptions.length)) - rotation);
            
            // Calculate z-index based on rotation position
            const normalizedRotation = ((cardRotation % 360) + 360) % 360;
            const zIndex = normalizedRotation > 90 && normalizedRotation < 270 ? 0 : 10;

            return (
              <CarouselCard
                key={subscription.name}
                subscription={subscription}
                style={{
                  transform: `rotateY(${cardRotation}deg) translateZ(300px)`,
                  zIndex,
                  transition: 'transform 0.5s ease-out'
                }}
                isActive={normalizedRotation >= 315 || normalizedRotation <= 45}
              />
            );
          })}
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 text-white hover:bg-white/20"
        onClick={handlePrev}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 text-white hover:bg-white/20"
        onClick={handleNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
};