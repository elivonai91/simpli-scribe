import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Settings2 } from 'lucide-react';
import { Subscription } from '@/types/subscription';
import { BillingCycleActions } from './subscription-management/BillingCycleActions';
import { CancelSubscriptionButton } from './subscription-management/CancelSubscriptionButton';

interface ManageSubscriptionDialogProps {
  subscription: Subscription;
}

export const ManageSubscriptionDialog = ({ subscription }: ManageSubscriptionDialogProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Subscription</DialogTitle>
          <DialogDescription>
            Manage your {subscription.name} subscription settings and billing cycle.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <BillingCycleActions 
            subscription={subscription}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
          <CancelSubscriptionButton 
            subscription={subscription}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogTrigger asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};