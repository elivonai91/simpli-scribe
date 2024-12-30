import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles } from 'lucide-react';

export const PremiumFeatures = () => {
  const session = useSession();

  const { data: isPremium } = useQuery({
    queryKey: ['premiumStatus'],
    queryFn: async () => {
      const { data } = await supabase
        .from('premium_subscriptions')
        .select('is_active')
        .single();
      return data?.is_active || false;
    },
    enabled: !!session?.user
  });

  const handleUpgradeClick = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-brand-50 to-brand-100 border-brand-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-500" />
          Premium Features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          <li className="flex items-center gap-2">
            ✓ Unlimited subscriptions
          </li>
          <li className="flex items-center gap-2">
            ✓ Advanced analytics and insights
          </li>
          <li className="flex items-center gap-2">
            ✓ Category budgeting
          </li>
          <li className="flex items-center gap-2">
            ✓ Custom notification schedules
          </li>
          <li className="flex items-center gap-2">
            ✓ Priority support
          </li>
        </ul>
        
        {!isPremium && (
          <Button 
            onClick={handleUpgradeClick}
            className="w-full bg-brand-500 hover:bg-brand-600"
          >
            Upgrade to Premium
          </Button>
        )}
      </CardContent>
    </Card>
  );
};