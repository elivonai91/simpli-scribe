import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export const EmptySubscriptions = () => {
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
          const nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await supabase.from('user_subscriptions').insert({
            user_id: session.user.id,
            service_name: sub.name,
            billing_amount: sub.cost,
            billing_cycle: sub.billingCycle,
            service_category: sub.category,
            next_billing_date: nextBillingDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
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
    <div className="text-center py-12">
      <h3 className="text-lg font-medium text-white mb-2">
        No active subscriptions
      </h3>
      <p className="text-white/70 mb-6">
        Start tracking your subscriptions by adding your first one or let us detect them automatically
      </p>
      <div className="flex justify-center gap-4">
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
          Add Your First Subscription
        </Button>
      </div>
    </div>
  );
};