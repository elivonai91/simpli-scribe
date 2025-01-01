import React from 'react';

interface SubscriptionLogoProps {
  serviceName: string;
  onError: () => void;
  hasError: boolean;
}

export const SubscriptionLogo = ({ serviceName, onError, hasError }: SubscriptionLogoProps) => {
  if (hasError) {
    return (
      <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-white text-4xl font-bold mb-4">
        {serviceName[0]}
      </div>
    );
  }

  return (
    <img
      src={`/api/subscription-logos/${serviceName}`}
      alt={`${serviceName} logo`}
      className="w-32 h-32 object-contain mb-4"
      onError={onError}
    />
  );
};