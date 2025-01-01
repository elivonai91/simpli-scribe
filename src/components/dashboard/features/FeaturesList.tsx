import React from 'react';
import FeatureProgress from '../FeatureProgress';

interface Feature {
  title: string;
  description: string;
  tier: string;
}

interface FeaturesListProps {
  userTier: string;
  highlightedFeatures: Feature[];
}

export const FeaturesList = ({ userTier, highlightedFeatures }: FeaturesListProps) => {
  return (
    <FeatureProgress 
      userTier={userTier}
      highlightedFeatures={highlightedFeatures}
    />
  );
};