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
import { motion } from 'framer-motion';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const { removeSubscription, updateSubscription } = useSubscriptions();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
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
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-400/70">Cost:</span>
                <span className="font-medium text-gold-400">
                  ${subscription.cost.toFixed(2)} / {subscription.billingCycle}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-400/70">Category:</span>
                <span className="font-medium text-gold-400">{subscription.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gold-400/70">Next billing:</span>
                <span className="font-medium text-gold-400">
                  {subscription.nextBillingDate.toLocaleDateString()}
                </span>
              </div>
              {subscription.notes && (
                <div className="mt-2 text-sm text-gold-400/70">
                  Note: {subscription.notes}
                </div>
              )}
            </div>

            <NotificationScheduleList subscriptionId={subscription.id} />
            
            {!showScheduleForm ? (
              <Button 
                variant="outline" 
                onClick={() => setShowScheduleForm(true)}
                className="w-full border-white/10 bg-white/10 hover:bg-white/20 text-gold-400"
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
                  className="w-full text-gold-400 hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};