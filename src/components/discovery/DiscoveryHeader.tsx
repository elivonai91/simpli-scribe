import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Scale } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { PartnerService } from '@/types/subscription';
import { RecommendationAlerts } from './RecommendationAlerts';

interface DiscoveryHeaderProps {
  isGenerating: boolean;
  generateRecommendations: () => void;
  selectedForComparison: PartnerService[];
  setShowComparison: (show: boolean) => void;
}

export const DiscoveryHeader = ({
  isGenerating,
  generateRecommendations,
  selectedForComparison,
  setShowComparison
}: DiscoveryHeaderProps) => {
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      type: 'new_recommendation' as const,
      title: 'New Recommendations Available',
      description: 'We have found new services that match your preferences!',
      timestamp: new Date()
    },
    {
      id: '2',
      type: 'limited_offer' as const,
      title: 'Limited Time Offer',
      description: 'Special discount on Premium subscriptions - 30% off!',
      timestamp: new Date()
    }
  ]);

  const handleDismissAlert = (id: string) => {
    setAlerts(current => current.filter(alert => alert.id !== id));
  };

  return (
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
        
        {alerts.length > 0 && (
          <div className="w-full max-w-2xl">
            <RecommendationAlerts
              alerts={alerts}
              onDismiss={handleDismissAlert}
            />
          </div>
        )}

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
          {selectedForComparison.length > 0 && (
            <Button
              onClick={() => setShowComparison(true)}
              className="bg-gradient-to-r from-[#662d91] to-[#bf0bad] hover:from-[#662d91]/90 hover:to-[#bf0bad]/90"
            >
              <Scale className="w-4 h-4 mr-2" />
              Compare ({selectedForComparison.length})
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};