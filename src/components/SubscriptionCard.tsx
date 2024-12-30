import { Subscription } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Trash2, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { requestNotificationPermission } from '@/utils/notifications';
import { toast } from '@/hooks/use-toast';
import { ManageSubscriptionDialog } from './ManageSubscriptionDialog';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const { removeSubscription, updateSubscription } = useSubscriptions();

  const handleReminderToggle = async (type: '48hour' | '24hour') => {
    const hasPermission = await requestNotificationPermission();
    
    if (!hasPermission) {
      toast({
        title: "Permission Required",
        description: "Please enable notifications to set reminders.",
        variant: "destructive"
      });
      return;
    }

    const updatedSubscription = {
      ...subscription,
      reminders: {
        ...subscription.reminders,
        [type === '48hour' ? 'fortyEightHour' : 'twentyFourHour']: 
          !subscription.reminders[type === '48hour' ? 'fortyEightHour' : 'twentyFourHour']
      }
    };
    
    updateSubscription(updatedSubscription);
    
    toast({
      title: "Reminder Updated",
      description: `${type === '48hour' ? '48-hour' : '24-hour'} reminder ${
        updatedSubscription.reminders[type === '48hour' ? 'fortyEightHour' : 'twentyFourHour'] 
          ? 'enabled' 
          : 'disabled'
      } for ${subscription.name}`
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{subscription.name}</CardTitle>
        <div className="flex items-center gap-2">
          <ManageSubscriptionDialog subscription={subscription} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeSubscription(subscription.id)}
            className="text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-sm">48-hour reminder</span>
              </div>
              <Switch
                checked={subscription.reminders.fortyEightHour}
                onCheckedChange={() => handleReminderToggle('48hour')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="text-sm">24-hour reminder</span>
              </div>
              <Switch
                checked={subscription.reminders.twentyFourHour}
                onCheckedChange={() => handleReminderToggle('24hour')}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};