import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';
import { CreditCard, Package, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  features: string[];
  monthly_price: number;
  yearly_price: number;
}

export const SubscriptionsTab = () => {
  const session = useSession();

  const { data: userSubscriptions, isLoading: userSubsLoading } = useQuery({
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
      
      console.log('User subscriptions:', data);
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: subscriptionPlans, isLoading: plansLoading } = useQuery({
    queryKey: ['subscriptionPlans'],
    queryFn: async () => {
      console.log('Fetching subscription plans...');
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('monthly_price', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscription plans:', error);
        toast({
          title: "Error",
          description: "Failed to load subscription plans",
          variant: "destructive"
        });
        throw error;
      }
      
      console.log('Fetched subscription plans:', data);
      return data.map(plan => ({
        ...plan,
        features: Array.isArray(plan.features) ? plan.features : []
      })) as SubscriptionPlan[];
    }
  });

  if (plansLoading || userSubsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Use the first plan as current plan or fallback to a default
  const currentPlan = subscriptionPlans?.[0] || {
    name: 'Basic',
    description: 'Free tier',
    features: []
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Package className="h-6 w-6 text-purple-400" />
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{currentPlan?.name}</h3>
                <p className="text-white/70">{currentPlan?.description}</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subscription Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-6 w-6 text-purple-400" />
                Active Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">
                {userSubscriptions?.length || 0}
              </div>
              <p className="text-white/70">Total active subscriptions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-white/10 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-6 w-6 text-purple-400" />
                Premium Features
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/70">
                {currentPlan?.features?.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};