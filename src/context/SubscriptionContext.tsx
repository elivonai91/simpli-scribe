import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription } from '../types/subscription';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  removeSubscription: (id: string) => void;
  totalMonthlyCost: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const stored = localStorage.getItem('subscriptions');
    if (stored) {
      const parsed = JSON.parse(stored);
      setSubscriptions(parsed.map((sub: any) => ({
        ...sub,
        nextBillingDate: new Date(sub.nextBillingDate)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSub = {
      ...subscription,
      id: crypto.randomUUID()
    };
    setSubscriptions(prev => [...prev, newSub]);
    toast({
      title: "Subscription Added",
      description: `${subscription.name} has been added to your subscriptions.`
    });
  };

  const removeSubscription = (id: string) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
    toast({
      title: "Subscription Removed",
      description: "The subscription has been removed from your list."
    });
  };

  const totalMonthlyCost = subscriptions.reduce((acc, sub) => {
    const cost = sub.billingCycle === 'yearly' ? sub.cost / 12 : sub.cost;
    return acc + cost;
  }, 0);

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      addSubscription,
      removeSubscription,
      totalMonthlyCost
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