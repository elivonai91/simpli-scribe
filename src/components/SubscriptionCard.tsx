import { Subscription } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Trash2, Check, X, RefreshCw } from 'lucide-react';
import { ManageSubscriptionDialog } from './ManageSubscriptionDialog';
import { NotificationScheduleForm } from './NotificationScheduleForm';
import { NotificationScheduleList } from './NotificationScheduleList';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const { removeSubscription, updateSubscription } = useSubscriptions();
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const handleQuickCancel = () => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      removeSubscription(subscription.id);
      toast({
        title: "Subscription Cancelled",
        description: `Your ${subscription.name} subscription has been cancelled.`
      });
    }
  };

  const handleQuickUpgrade = () => {
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

  const handleQuickRenewal = () => {
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + (subscription.billingCycle === 'yearly' ? 12 : 1));
    updateSubscription({
      ...subscription,
      nextBillingDate: nextDate
    });
    toast({
      title: "Subscription Renewed",
      description: `Your ${subscription.name} subscription has been renewed.`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{subscription.name}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {subscription.billingCycle === 'monthly' && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleQuickUpgrade}
                className="h-8 w-8"
                title="Upgrade to yearly"
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuickRenewal}
              className="h-8 w-8"
              title="Renew subscription"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleQuickCancel}
              className="h-8 w-8"
              title="Cancel subscription"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <ManageSubscriptionDialog subscription={subscription} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeSubscription(subscription.id)}
            className="text-destructive hover:text-destructive/90 h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cost:</span>
              <span className="font-medium">
                ${subscription.cost.toFixed(2)} / {subscription.billingCycle}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Category:</span>
              <span className="font-medium">{subscription.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next billing:</span>
              <span className="font-medium">
                {subscription.nextBillingDate.toLocaleDateString()}
              </span>
            </div>
            {subscription.notes && (
              <div className="mt-2 text-sm text-muted-foreground">
                Note: {subscription.notes}
              </div>
            )}
          </div>

          <NotificationScheduleList subscriptionId={subscription.id} />
          
          {!showScheduleForm ? (
            <Button 
              variant="outline" 
              onClick={() => setShowScheduleForm(true)}
              className="w-full"
            >
              Add Notification Schedule
            </Button>
          ) : (
            <div className="space-y-4">
              <NotificationScheduleForm 
                subscriptionId={subscription.id}
                onScheduleAdded={() => setShowScheduleForm(false)}
              />
              <Button 
                variant="ghost" 
                onClick={() => setShowScheduleForm(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};