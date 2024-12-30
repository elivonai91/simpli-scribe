import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subscription } from '../types/subscription';
import { useToast } from '@/hooks/use-toast';
import { scheduleSubscriptionReminders } from '@/utils/notifications';
import CryptoJS from 'crypto-js';

// Encryption key - in a real production app, this would come from a secure source
const STORAGE_KEY = 'subscriptions';
const ENCRYPTION_KEY = 'lovable-subscription-manager-2024';

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (subscription: Omit<Subscription, 'id'>) => void;
  removeSubscription: (id: string) => void;
  updateSubscription: (subscription: Subscription) => void;
  totalMonthlyCost: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const { toast } = useToast();

  // Encrypt data before storing
  const encryptData = (data: any): string => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
  };

  // Decrypt data after retrieving
  const decryptData = (encryptedData: string): any => {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Error decrypting data:', error);
      return null;
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const decryptedData = decryptData(stored);
        if (decryptedData) {
          const loadedSubscriptions = decryptedData.map((sub: any) => ({
            ...sub,
            nextBillingDate: new Date(sub.nextBillingDate),
            reminders: sub.reminders || { fortyEightHour: false, twentyFourHour: false }
          }));
          setSubscriptions(loadedSubscriptions);
          
          // Schedule reminders for all loaded subscriptions
          loadedSubscriptions.forEach(scheduleSubscriptionReminders);
        }
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        toast({
          title: "Error Loading Data",
          description: "There was an error loading your subscription data.",
          variant: "destructive"
        });
      }
    }
  }, []);

  useEffect(() => {
    const encryptedData = encryptData(subscriptions);
    localStorage.setItem(STORAGE_KEY, encryptedData);
  }, [subscriptions]);

  const addSubscription = (subscription: Omit<Subscription, 'id'>) => {
    const newSub = {
      ...subscription,
      id: crypto.randomUUID(),
      reminders: { fortyEightHour: false, twentyFourHour: false }
    };
    setSubscriptions(prev => [...prev, newSub]);
    toast({
      title: "Subscription Added",
      description: `${subscription.name} has been added to your subscriptions.`
    });
  };

  const updateSubscription = (updatedSubscription: Subscription) => {
    setSubscriptions(prev => 
      prev.map(sub => 
        sub.id === updatedSubscription.id ? updatedSubscription : sub
      )
    );
    scheduleSubscriptionReminders(updatedSubscription);
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
      updateSubscription,
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