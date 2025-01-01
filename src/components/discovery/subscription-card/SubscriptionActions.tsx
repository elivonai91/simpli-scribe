import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Scale, ExternalLink, MessageSquare } from "lucide-react";
import { PartnerService } from '@/types/subscription';
import { FeedbackDialog } from './FeedbackDialog';
import { SocialShare } from './SocialShare';

interface SubscriptionActionsProps {
  subscription: PartnerService;
  onCompare?: (subscription: PartnerService) => void;
  isSelected?: boolean;
}

export const SubscriptionActions = ({ subscription, onCompare, isSelected }: SubscriptionActionsProps) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handleTryNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    const searchQuery = encodeURIComponent(`${subscription.service_name} free trial signup`);
    window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Button
          onClick={handleTryNow}
          className="flex-1 bg-[#ff3da6] hover:bg-[#ff3da6]/90"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Try Now
        </Button>
        <SocialShare subscription={subscription} />
      </div>

      {onCompare && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onCompare(subscription);
          }}
          className={`
            w-full
            ${isSelected 
              ? 'bg-[#ff3da6] hover:bg-[#ff3da6]/90' 
              : 'bg-white/10 hover:bg-white/20'
            }
          `}
        >
          <Scale className="w-4 h-4 mr-2" />
          {isSelected ? 'Remove from Compare' : 'Add to Compare'}
        </Button>
      )}

      <Button
        onClick={(e) => {
          e.stopPropagation();
          setShowFeedback(true);
        }}
        className="w-full bg-white/10 hover:bg-white/20"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Rate Recommendation
      </Button>

      <FeedbackDialog
        subscription={subscription}
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </div>
  );
};