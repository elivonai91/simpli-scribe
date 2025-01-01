import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { SubscriptionCard } from '@/components/SubscriptionCard';
import { motion } from 'framer-motion';

export const SubscriptionsTab = () => {
  const session = useSession();

  const { data: userSubscriptions, isLoading } = useQuery({
    queryKey: ['userSubscriptions', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', session?.user?.id);
      
      if (error) {
        console.error('Error fetching user subscriptions:', error);
        toast({
          title: "Error",
          description: "Failed to load your subscriptions",
          variant: "destructive"
        });
        throw error;
      }
      
      return data?.map(sub => {
        // Ensure billing_cycle is either 'monthly' or 'yearly'
        let validBillingCycle: 'monthly' | 'yearly' = 'monthly';
        if (sub.billing_cycle === 'monthly' || sub.billing_cycle === 'yearly') {
          validBillingCycle = sub.billing_cycle as 'monthly' | 'yearly';
        }

        return {
          id: sub.id,
          name: sub.service_name,
          cost: sub.billing_amount,
          billingCycle: validBillingCycle,
          category: sub.service_category || 'Other',
          nextBillingDate: new Date(sub.next_billing_date),
          notes: sub.notes,
          reminders: { fortyEightHour: false, twentyFourHour: false }
        };
      }) || [];
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading your subscriptions...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Active Subscriptions ({userSubscriptions?.length || 0})
          </h2>
          <p className="text-white/70">
            Manage and track all your subscriptions in one place
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Subscription
        </Button>
      </div>

      {userSubscriptions?.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-white mb-2">
            No active subscriptions
          </h3>
          <p className="text-white/70 mb-6">
            Start tracking your subscriptions by adding your first one
          </p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Subscription
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userSubscriptions?.map((subscription, index) => (
            <motion.div
              key={subscription.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <SubscriptionCard subscription={subscription} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};