import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings2 } from 'lucide-react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toast } from '@/hooks/use-toast';
import { Subscription } from '@/types/subscription';
import { supabase } from '@/integrations/supabase/client';

interface ManageSubscriptionDialogProps {
  subscription: Subscription;
}

export const ManageSubscriptionDialog = ({ subscription }: ManageSubscriptionDialogProps) => {
  const { updateSubscription, removeSubscription } = useSubscriptions();
  const [isLoading, setIsLoading] = React.useState(false);

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
        console.error('Error upgrading subscription:', error);
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
        console.error('Error downgrading subscription:', error);
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Subscription</DialogTitle>
          <DialogDescription>
            Manage your {subscription.name} subscription settings and billing cycle.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
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
          <Button 
            onClick={handleCancel} 
            variant="destructive" 
            className="w-full"
            disabled={isLoading}
          >
            Cancel Subscription
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogTrigger asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};