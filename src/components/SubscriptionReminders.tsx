import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Subscription } from '@/types/subscription';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { requestNotificationPermission } from '@/utils/notifications';
import { toast } from '@/hooks/use-toast';

interface SubscriptionRemindersProps {
  subscription: Subscription;
}

export const SubscriptionReminders = ({ subscription }: SubscriptionRemindersProps) => {
  const { updateSubscription } = useSubscriptions();

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
  );
};