import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@supabase/auth-helpers-react';

interface NotificationScheduleFormProps {
  subscriptionId: string;
  onScheduleAdded?: () => void;
}

interface FormData {
  daysBefore: number;
  notificationTime: string;
  enabled: boolean;
}

export const NotificationScheduleForm = ({ subscriptionId, onScheduleAdded }: NotificationScheduleFormProps) => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { toast } = useToast();
  const session = useSession();

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create notification schedules.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('notification_schedules').insert({
        subscription_id: subscriptionId,
        days_before: data.daysBefore,
        notification_time: data.notificationTime,
        enabled: data.enabled,
        user_id: session.user.id
      });

      if (error) throw error;

      toast({
        title: "Schedule Created",
        description: "Your notification schedule has been created successfully."
      });

      reset();
      onScheduleAdded?.();
    } catch (error) {
      console.error('Error creating notification schedule:', error);
      toast({
        title: "Error",
        description: "Failed to create notification schedule.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Notification Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="daysBefore">Days Before</Label>
            <Input
              id="daysBefore"
              type="number"
              min="1"
              max="30"
              {...register('daysBefore', { required: true, min: 1, max: 30 })}
              placeholder="Days before billing date"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notificationTime">Notification Time</Label>
            <Input
              id="notificationTime"
              type="time"
              {...register('notificationTime', { required: true })}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enabled">Enable Notifications</Label>
            <Switch
              id="enabled"
              {...register('enabled')}
              defaultChecked
            />
          </div>

          <Button type="submit" className="w-full">Add Schedule</Button>
        </form>
      </CardContent>
    </Card>
  );
};