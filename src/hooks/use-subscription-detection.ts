import { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const useSubscriptionDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const session = useSession();
  const queryClient = useQueryClient();

  const detectSubscriptions = async () => {
    if (!session?.user?.email) {
      toast({
        title: "Error",
        description: "Please log in to detect subscriptions",
        variant: "destructive"
      });
      return;
    }

    setIsDetecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-subscriptions', {
        body: {
          email: session.user.email,
          userId: session.user.id
        }
      });

      if (error) throw error;

      if (data.subscriptions?.length > 0) {
        // Add detected subscriptions to the database
        for (const sub of data.subscriptions) {
          const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await supabase.from('user_subscriptions').insert({
            user_id: session.user.id,
            service_name: sub.name,
            billing_amount: sub.cost,
            billing_cycle: sub.billingCycle,
            service_category: sub.category,
            next_billing_date: nextBillingDate.toISOString().split('T')[0],
            status: 'active'
          });
        }

        // Invalidate and refetch subscriptions
        queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });

        toast({
          title: "Success",
          description: `Found ${data.subscriptions.length} subscriptions!`,
        });
      } else {
        toast({
          title: "No subscriptions found",
          description: "We couldn't detect any active subscriptions for your email.",
        });
      }
    } catch (error) {
      console.error('Error detecting subscriptions:', error);
      toast({
        title: "Error",
        description: "Failed to detect subscriptions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  return {
    isDetecting,
    detectSubscriptions
  };
};