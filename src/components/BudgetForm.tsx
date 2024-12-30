import React from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { useQueryClient } from '@tanstack/react-query';

interface BudgetFormData {
  monthlyLimit: number;
  categoryLimits: { [key: string]: number };
}

export const BudgetForm = () => {
  const { toast } = useToast();
  const session = useSession();
  const { subscriptions } = useSubscriptions();
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm<BudgetFormData>();

  // Get unique categories
  const categories = Array.from(new Set(subscriptions.map(sub => sub.category)));

  const onSubmit = async (data: BudgetFormData) => {
    if (!session?.user) return;

    try {
      const categoryLimits = categories.reduce((acc, category) => {
        acc[category] = Number(data.categoryLimits[category]) || 0;
        return acc;
      }, {} as { [key: string]: number });

      const { error } = await supabase
        .from('budgets')
        .upsert({
          user_id: session.user.id,
          monthly_limit: Number(data.monthlyLimit),
          category_limits: categoryLimits
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['budget'] });
      toast({
        title: "Budget Updated",
        description: "Your budget settings have been saved successfully."
      });
    } catch (error) {
      console.error('Error updating budget:', error);
      toast({
        title: "Error",
        description: "Failed to update budget settings.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Set Budget Limits</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyLimit">Monthly Budget Limit</Label>
            <Input
              id="monthlyLimit"
              type="number"
              step="0.01"
              min="0"
              {...register('monthlyLimit')}
              placeholder="Enter monthly budget limit"
            />
          </div>

          {categories.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium">Category Limits</h3>
              {categories.map(category => (
                <div key={category} className="space-y-2">
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                  <Input
                    id={`category-${category}`}
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`categoryLimits.${category}`)}
                    placeholder={`Enter limit for ${category}`}
                  />
                </div>
              ))}
            </div>
          )}

          <Button type="submit" className="w-full">Save Budget Settings</Button>
        </form>
      </CardContent>
    </Card>
  );
};