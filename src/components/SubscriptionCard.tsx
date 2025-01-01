import { Subscription } from '@/types/subscription';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { SubscriptionHeader } from './subscription/SubscriptionHeader';
import { SubscriptionDetails } from './subscription/SubscriptionDetails';
import { NotificationSection } from './subscription/NotificationSection';
import { ManageSubscriptionDialog } from './ManageSubscriptionDialog';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/10">
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <SubscriptionHeader subscription={subscription} />
            <SubscriptionDetails subscription={subscription} />
            <div className="flex justify-end">
              <ManageSubscriptionDialog subscription={subscription} />
            </div>
            <NotificationSection subscriptionId={subscription.id} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};