import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription } from '../types/subscription';
import { useToast } from '@/hooks/use-toast';
import { scheduleSubscriptionReminders } from '@/utils/notifications';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (subscription: Subscription) => void;
  totalMonthlyCost: number;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const { toast } = useToast();
  const session = useSession();
  const supabase = useSupabaseClient();
  const queryClient = useQueryClient();

  // Fetch subscriptions
  const { data: subscriptions = [], isLoading } = useQuery({
    queryKey: ['subscriptions', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      return data.map(sub => ({
        id: sub.id,
        name: sub.service_name,
        cost: sub.billing_amount,
        billingCycle: sub.billing_cycle || 'monthly',
        category: sub.service_category || 'Other',
        nextBillingDate: new Date(sub.next_billing_date),
        notes: sub.notes || '',
        reminders: { fortyEightHour: false, twentyFourHour: false }
      }));
    },
    enabled: !!session?.user?.id
  });

  // Add subscription mutation
  const addSubscriptionMutation = useMutation({
    mutationFn: async (subscription: Omit<Subscription, 'id'>) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: session.user.id,
          service_name: subscription.name,
          billing_amount: subscription.cost,
          billing_cycle: subscription.billingCycle,
          service_category: subscription.category,
          next_billing_date: subscription.nextBillingDate,
          notes: subscription.notes
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: "Subscription Added",
        description: "Your subscription has been successfully added."
      });
    }
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async (subscription: Subscription) => {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .update({
          service_name: subscription.name,
          billing_amount: subscription.cost,
          billing_cycle: subscription.billingCycle,
          service_category: subscription.category,
          next_billing_date: subscription.nextBillingDate,
          notes: subscription.notes
        })
        .eq('id', subscription.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been successfully updated."
      });
    }
  });

  // Remove subscription mutation
  const removeSubscriptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: "Subscription Removed",
        description: "Your subscription has been successfully removed."
      });
    }
  });

  // Calculate total monthly cost
  const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
    const cost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    return acc + cost;
  }, 0);

  // Set up real-time subscription updates
  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_subscriptions',
          filter: `user_id=eq.${session.user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, supabase, queryClient]);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      addSubscription: (sub) => addSubscriptionMutation.mutate(sub),
      updateSubscription: (sub) => updateSubscriptionMutation.mutate(sub),
      removeSubscription: (id) => removeSubscriptionMutation.mutate(id),
      totalMonthlyCost,
      isLoading
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
};