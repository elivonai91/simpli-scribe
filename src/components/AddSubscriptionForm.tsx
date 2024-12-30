import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FormData {
  name: string;
  cost: number;
  billingCycle: 'monthly' | 'yearly';
  category: string;
  nextBillingDate: string;
  notes?: string;
}

export const AddSubscriptionForm = () => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const { addSubscription } = useSubscriptions();

  const onSubmit = (data: FormData) => {
    addSubscription({
      ...data,
      cost: Number(data.cost),
      nextBillingDate: new Date(data.nextBillingDate),
      reminders: {
        fortyEightHour: false,
        twentyFourHour: false
      }
    });
    reset();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Subscription</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name</Label>
            <Input id="name" {...register('name', { required: true })} placeholder="Netflix" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              {...register('cost', { required: true, min: 0 })}
              placeholder="9.99"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="billingCycle">Billing Cycle</Label>
            <Select {...register('billingCycle')}>
              <SelectTrigger>
                <SelectValue placeholder="Select billing cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" {...register('category')} placeholder="Entertainment" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nextBillingDate">Next Billing Date</Label>
            <Input
              id="nextBillingDate"
              type="date"
              {...register('nextBillingDate', { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input id="notes" {...register('notes')} placeholder="Family plan" />
          </div>

          <Button type="submit" className="w-full">Add Subscription</Button>
        </form>
      </CardContent>
    </Card>
  );
};