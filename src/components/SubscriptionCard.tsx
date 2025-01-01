import { Subscription } from '@/types/subscription';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { SubscriptionHeader } from './subscription/SubscriptionHeader';
import { SubscriptionDetails } from './subscription/SubscriptionDetails';
import { NotificationSection } from './subscription/NotificationSection';
import { ManageSubscriptionDialog } from './ManageSubscriptionDialog';
import { Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

interface SubscriptionCardProps {
  subscription: Subscription;
}

export const SubscriptionCard = ({ subscription }: SubscriptionCardProps) => {
  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${subscription.name} subscription service!`;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "The subscription link has been copied to your clipboard.",
          });
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Please try again or copy the URL manually.",
            variant: "destructive",
          });
        }
        break;
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="backdrop-blur-xl bg-white/10 border-white/10">
        <CardContent className="pt-6">
          <div className="grid gap-4">
            <div className="flex justify-between items-start">
              <SubscriptionHeader subscription={subscription} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-100">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleShare('twitter')}>
                    Share on Twitter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('facebook')}>
                    Share on Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                    Share on LinkedIn
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleShare('copy')}>
                    Copy Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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