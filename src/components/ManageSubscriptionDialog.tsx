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

interface ManageSubscriptionDialogProps {
  subscription: Subscription;
}

export const ManageSubscriptionDialog = ({ subscription }: ManageSubscriptionDialogProps) => {
  const { updateSubscription, removeSubscription } = useSubscriptions();

  const handleCancel = () => {
    removeSubscription(subscription.id);
    toast({
      title: "Subscription Cancelled",
      description: `Your ${subscription.name} subscription has been cancelled.`
    });
  };

  const handleUpgrade = () => {
    if (subscription.billingCycle === 'monthly') {
      const yearlyPrice = subscription.cost * 10; // 2 months free
      updateSubscription({
        ...subscription,
        billingCycle: 'yearly',
        cost: yearlyPrice
      });
      toast({
        title: "Subscription Upgraded",
        description: `Your ${subscription.name} subscription has been upgraded to yearly billing with 2 months free!`
      });
    }
  };

  const handleDowngrade = () => {
    if (subscription.billingCycle === 'yearly') {
      const monthlyPrice = subscription.cost / 12;
      updateSubscription({
        ...subscription,
        billingCycle: 'monthly',
        cost: monthlyPrice
      });
      toast({
        title: "Subscription Downgraded",
        description: `Your ${subscription.name} subscription has been changed to monthly billing.`
      });
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
            <Button onClick={handleUpgrade} className="w-full">
              Upgrade to Yearly (Save 2 Months)
            </Button>
          )}
          {subscription.billingCycle === 'yearly' && (
            <Button onClick={handleDowngrade} variant="outline" className="w-full">
              Switch to Monthly Billing
            </Button>
          )}
          <Button onClick={handleCancel} variant="destructive" className="w-full">
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