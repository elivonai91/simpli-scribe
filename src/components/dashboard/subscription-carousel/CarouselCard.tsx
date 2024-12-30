import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface Subscription {
  name: string;
  description: string;
  features?: string[]; // Make features optional
  logoPath: string | null;
}

interface CarouselCardProps {
  subscription: Subscription;
  style: React.CSSProperties;
  isActive: boolean;
}

export const CarouselCard = ({ subscription, style, isActive }: CarouselCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="absolute w-64 h-64 cursor-pointer"
      style={{
        ...style,
        transition: 'transform 0.5s ease-out',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`w-full h-full relative overflow-hidden backdrop-blur-xl bg-white/10 border-white/10 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}>
        <CardContent className="p-6 h-full flex flex-col items-center justify-center">
          {subscription.logoPath ? (
            <img
              src={subscription.logoPath}
              alt={`${subscription.name} logo`}
              className="w-32 h-32 object-contain mb-4"
            />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
              {subscription.name[0]}
            </div>
          )}

          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-0 p-6 bg-gradient-to-b from-black/80 to-black/95 flex flex-col justify-center"
              >
                <h3 className="text-xl font-bold text-white mb-2">{subscription.name}</h3>
                <p className="text-sm text-white/80 mb-4">{subscription.description}</p>
                {subscription.features && subscription.features.length > 0 && (
                  <ul className="text-sm text-white/70 space-y-1">
                    {subscription.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};