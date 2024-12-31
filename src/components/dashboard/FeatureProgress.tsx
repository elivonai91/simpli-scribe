import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureProgressProps {
  userTier: string;
  highlightedFeatures: {
    title: string;
    description: string;
    tier: string;
  }[];
}

const FeatureProgress = ({ userTier, highlightedFeatures }: FeatureProgressProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white text-center">Feature Progress</h2>
      <div className="max-w-3xl mx-auto space-y-4">
        {highlightedFeatures.map((feature) => (
          <Card 
            key={feature.title}
            className={cn(
              "relative overflow-hidden transition-all duration-300",
              userTier === feature.tier ? "bg-white/10" : "bg-white/5"
            )}
          >
            <div className={cn(
              "absolute inset-0 backdrop-blur-sm transition-opacity",
              userTier === feature.tier ? "opacity-0" : "opacity-100 bg-black/40"
            )}>
              <div className="flex items-center justify-center h-full">
                <Lock className="w-8 h-8 text-white/50" />
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-white/70">{feature.description}</p>
              <div className="mt-2 text-sm text-white/50">
                Available in: {feature.tier}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FeatureProgress;