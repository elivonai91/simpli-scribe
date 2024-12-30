import { Subscription } from '@/types/subscription';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSubscriptions } from '@/context/SubscriptionContext';
import { Trash2 } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const { removeSubscription } = useSubscriptions();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{subscription.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeSubscription(subscription.id)}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Cost:</span>
            <span className="font-medium">
              ${subscription.cost.toFixed(2)} / {subscription.billingCycle}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Category:</span>
            <span className="font-medium">{subscription.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Next billing:</span>
            <span className="font-medium">
              {subscription.nextBillingDate.toLocaleDateString()}
            </span>
          </div>
          {subscription.notes && (
            <div className="mt-2 text-sm text-muted-foreground">
              Note: {subscription.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};