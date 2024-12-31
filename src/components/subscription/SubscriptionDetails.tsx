import { Subscription } from '@/types/subscription';

interface SubscriptionDetailsProps {
  subscription: Subscription;
}

export const SubscriptionDetails = ({ subscription }: SubscriptionDetailsProps) => {
  return (
    <div className="grid gap-1">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gold-400/70">Cost:</span>
        <span className="font-medium text-gold-400">
          ${subscription.cost.toFixed(2)} / {subscription.billingCycle}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gold-400/70">Category:</span>
        <span className="font-medium text-gold-400">{subscription.category}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gold-400/70">Next billing:</span>
        <span className="font-medium text-gold-400">
          {subscription.nextBillingDate.toLocaleDateString()}
        </span>
      </div>
      {subscription.notes && (
        <div className="mt-2 text-sm text-gold-400/70">
          Note: {subscription.notes}
        </div>
      )}
    </div>
  );
};