import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Trash2, Clock } from 'lucide-react';

interface NotificationSchedule {
  id: string;
  days_before: number;
  notification_time: string;
  enabled: boolean;
}

interface NotificationScheduleListProps {
  subscriptionId: string;
}

export const NotificationScheduleList = ({ subscriptionId }: NotificationScheduleListProps) => {
  const [schedules, setSchedules] = useState<NotificationSchedule[]>([]);
  const { toast } = useToast();

  const fetchSchedules = async () => {
    const { data, error } = await supabase
      .from('notification_schedules')
      .select('*')
      .eq('subscription_id', subscriptionId);

    if (error) {
      console.error('Error fetching schedules:', error);
      return;
    }

    setSchedules(data || []);
  };

  useEffect(() => {
    fetchSchedules();
  }, [subscriptionId]);

  const handleToggle = async (id: string, enabled: boolean) => {
    const { error } = await supabase
      .from('notification_schedules')
      .update({ enabled })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update notification status.",
        variant: "destructive"
      });
      return;
    }

    setSchedules(prev =>
      prev.map(schedule =>
        schedule.id === id ? { ...schedule, enabled } : schedule
      )
    );

    toast({
      title: "Schedule Updated",
      description: `Notifications ${enabled ? 'enabled' : 'disabled'}.`
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('notification_schedules')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete notification schedule.",
        variant: "destructive"
      });
      return;
    }

    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
    toast({
      title: "Schedule Deleted",
      description: "Notification schedule has been removed."
    });
  };

  if (schedules.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  {schedule.days_before} days before at {schedule.notification_time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={schedule.enabled}
                  onCheckedChange={(checked) => handleToggle(schedule.id, checked)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(schedule.id)}
                  className="text-destructive hover:text-destructive/90"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};