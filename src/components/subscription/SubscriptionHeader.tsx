import { Subscription } from '@/types/subscription';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, RefreshCw, Trash2 } from 'lucide-react';
import { ManageSubscriptionDialog } from '../ManageSubscriptionDialog';
import { useState } from 'react';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { toast } from '@/hooks/use-toast';

interface SubscriptionHeaderProps {
  subscription: Subscription;
}

export const SubscriptionHeader = ({ subscription }: SubscriptionHeaderProps) => {
  const { removeSubscription, updateSubscription } = useSubscriptions();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      setIsLoading(true);
      try {
        await removeSubscription(subscription.id);
        toast({
          title: "Subscription Cancelled",
          description: `Your ${subscription.name} subscription has been cancelled.`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to cancel subscription. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleQuickUpgrade = async () => {
    if (subscription.billingCycle === 'monthly') {
      setIsLoading(true);
      try {
        const yearlyPrice = subscription.cost * 10; // 2 months free
        await updateSubscription({
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

  const handleQuickRenewal = async () => {
    setIsLoading(true);
    try {
      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + (subscription.billingCycle === 'yearly' ? 12 : 1));
      await updateSubscription({
        ...subscription,
        nextBillingDate: nextDate
      });
      toast({
        title: "Subscription Renewed",
        description: `Your ${subscription.name} subscription has been renewed.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to renew subscription. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-lg font-bold text-gold-400">{subscription.name}</CardTitle>
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {subscription.billingCycle === 'monthly' && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuickUpgrade}
              disabled={isLoading}
              className="h-8 w-8 border-white/10 bg-white/10 hover:bg-white/20"
              title="Upgrade to yearly"
            >
              <Check className="h-4 w-4 text-emerald-400" />
            </Button>
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={handleQuickRenewal}
            disabled={isLoading}
            className="h-8 w-8 border-white/10 bg-white/10 hover:bg-white/20"
            title="Renew subscription"
          >
            <RefreshCw className="h-4 w-4 text-gold-400" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleQuickCancel}
            disabled={isLoading}
            className="h-8 w-8 border-white/10 bg-white/10 hover:bg-white/20"
            title="Cancel subscription"
          >
            <X className="h-4 w-4 text-ruby-400" />
          </Button>
        </div>
        <ManageSubscriptionDialog subscription={subscription} />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleQuickCancel}
          disabled={isLoading}
          className="text-ruby-400 hover:text-ruby-400/90 hover:bg-white/10 h-8 w-8"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};