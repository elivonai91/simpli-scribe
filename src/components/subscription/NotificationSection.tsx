import { Button } from '@/components/ui/button';
import { NotificationScheduleForm } from '../NotificationScheduleForm';
import { NotificationScheduleList } from '../NotificationScheduleList';
import { useState } from 'react';

interface NotificationSectionProps {
  subscriptionId: string;
}

export const NotificationSection = ({ subscriptionId }: NotificationSectionProps) => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  return (
    <div className="space-y-4">
      <NotificationScheduleList subscriptionId={subscriptionId} />
      
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
            subscriptionId={subscriptionId}
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
  );
};