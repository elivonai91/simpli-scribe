import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { SubscriptionCarousel } from './subscription-carousel/SubscriptionCarousel';
import { motion, AnimatePresence } from 'framer-motion';

const popularServices = [
  {
    name: 'Netflix',
    description: 'Stream your favorite movies and TV shows on-demand. Includes HD streaming, multiple profiles, and offline downloads.',
    features: ['4K Ultra HD', 'Multiple Profiles', 'No ads', 'Download & watch offline']
  },
  {
    name: 'Spotify',
    description: 'Listen to millions of songs, podcasts, and audiobooks. Enjoy ad-free music streaming with premium sound quality.',
    features: ['Ad-free music', 'Offline playback', 'High quality audio', 'Collaborative playlists']
  },
  {
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and collaboration. Perfect for personal and team organization.',
    features: ['Unlimited pages', 'Real-time collaboration', 'Custom workflows', 'API access']
  }
];

export const PopularSubscriptions = () => {
  const { toast } = useToast();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['popularSubscriptions'],
    queryFn: async () => {
      const results = await Promise.all(
        popularServices.map(async (service) => {
          try {
            const { data: existingLogo } = await supabase
              .from('subscription_logos')
              .select('logo_path')
              .eq('service_name', service.name)
              .maybeSingle();

            let logoPath = existingLogo?.logo_path;

            if (!logoPath) {
              try {
                const { data: generatedLogo, error: generateError } = await supabase.functions.invoke('generate-logo', {
                  body: { serviceName: service.name },
                });

                if (generateError) throw generateError;
                logoPath = generatedLogo?.logo_path;
              } catch (error) {
                console.error('Error generating logo:', error);
                toast({
                  title: "Couldn't generate logo",
                  description: "Using fallback display",
                  variant: "destructive",
                });
              }
            }

            return {
              ...service,
              logoPath,
            };
          } catch (error) {
            console.error('Error fetching logo:', error);
            return {
              ...service,
              logoPath: null,
            };
          }
        })
      );
      return results;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-[400px] relative"
      >
        <SubscriptionCarousel subscriptions={subscriptions || []} />
      </motion.div>
    </AnimatePresence>
  );
};