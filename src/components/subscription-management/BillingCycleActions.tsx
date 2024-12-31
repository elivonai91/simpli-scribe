import React from 'react';
import { Button } from '@/components/ui/button';
import { Subscription } from '@/types/subscription';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSubscriptions } from '@/context/SubscriptionContext';

interface BillingCycleActionsProps {
  subscription: Subscription;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const BillingCycleActions = ({ 
  subscription, 
  isLoading, 
  setIsLoading 
}: BillingCycleActionsProps) => {
  const { updateSubscription } = useSubscriptions();

  const handleUpgrade = async () => {
    if (subscription.billingCycle === 'monthly') {
      setIsLoading(true);
      const yearlyPrice = subscription.cost * 10; // 2 months free
      
      try {
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            billing_amount: yearlyPrice,
            billing_cycle: 'yearly'
          })
          .eq('id', subscription.id);

        if (error) throw error;

        updateSubscription({
          ...subscription,
          billingCycle: 'yearly',
          cost: yearlyPrice
        });

        toast({
          title: "Subscription Upgraded",
          description: `Your ${subscription.name} subscription has been upgraded to yearly billing with 2 months free!`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to upgrade subscription. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDowngrade = async () => {
    if (subscription.billingCycle === 'yearly') {
      setIsLoading(true);
      const monthlyPrice = subscription.cost / 12;
      
      try {
        const { error } = await supabase
          .from('user_subscriptions')
          .update({
            billing_amount: monthlyPrice,
            billing_cycle: 'monthly'
          })
          .eq('id', subscription.id);

        if (error) throw error;

        updateSubscription({
          ...subscription,
          billingCycle: 'monthly',
          cost: monthlyPrice
        });

        toast({
          title: "Subscription Downgraded",
          description: `Your ${subscription.name} subscription has been changed to monthly billing.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to downgrade subscription. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {subscription.billingCycle === 'monthly' && (
        <Button 
          onClick={handleUpgrade} 
          className="w-full"
          disabled={isLoading}
        >
          Upgrade to Yearly (Save 2 Months)
        </Button>
      )}
      {subscription.billingCycle === 'yearly' && (
        <Button 
          onClick={handleDowngrade} 
          variant="outline" 
          className="w-full"
          disabled={isLoading}
        >
          Switch to Monthly Billing
        </Button>
      )}
    </>
  );
};