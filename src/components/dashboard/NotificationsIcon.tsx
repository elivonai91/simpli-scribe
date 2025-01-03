import React, { useEffect, useState } from 'react';
import { Bell, BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export const NotificationsIcon = () => {
  const session = useSession();
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;

    const checkNotifications = async () => {
      const { data: notifications } = await supabase
        .from('notification_schedules')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('enabled', true);

      setHasNotifications(notifications && notifications.length > 0);
    };

    checkNotifications();

    // Set up real-time subscription
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notification_schedules',
          filter: `user_id=eq.${session.user.id}`
        },
        () => {
          checkNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id]);

  return (
    <Button variant="ghost" size="icon" className="relative w-[60px] h-[60px]">
      {hasNotifications ? (
        <BellDot className="h-15 w-15 text-ruby-500" strokeWidth={1.5} />
      ) : (
        <Bell className="h-15 w-15 text-ruby-500" strokeWidth={1.5} />
      )}
    </Button>
  );
};