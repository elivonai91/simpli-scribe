import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface SubscriptionsHeaderProps {
  subscriptionCount: number;
}

export const SubscriptionsHeader = ({ subscriptionCount }: SubscriptionsHeaderProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isDetecting, setIsDetecting] = React.useState(false);

  const handleDetectSubscriptions = async () => {
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
          await supabase.from('user_subscriptions').insert({
            user_id: session.user.id,
            service_name: sub.name,
            billing_amount: sub.cost,
            billing_cycle: sub.billingCycle,
            service_category: sub.category,
            next_billing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
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

  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Active Subscriptions ({subscriptionCount})
        </h2>
        <p className="text-white/70">
          Manage and track all your subscriptions in one place
        </p>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={handleDetectSubscriptions} 
          disabled={isDetecting}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
        >
          <Search className="w-4 h-4 mr-2" />
          {isDetecting ? 'Detecting...' : 'Detect Subscriptions'}
        </Button>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>
    </div>
  );
};