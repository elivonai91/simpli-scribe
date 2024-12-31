import React from 'react';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/subscription';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscriptions } from '@/context/SubscriptionContext';

interface CancelSubscriptionButtonProps {
  subscription: Subscription;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const CancelSubscriptionButton = ({ 
  subscription, 
  isLoading, 
  setIsLoading 
}: CancelSubscriptionButtonProps) => {
  const { removeSubscription } = useSubscriptions();

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await supabase
        .from('user_subscriptions')
        .delete()
        .eq('id', subscription.id);

      removeSubscription(subscription.id);
      toast({
        title: "Subscription Cancelled",
        description: `Your ${subscription.name} subscription has been cancelled.`
      });
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCancel} 
      variant="destructive" 
      className="w-full"
      disabled={isLoading}
    >
      Cancel Subscription
    </Button>
  );
};