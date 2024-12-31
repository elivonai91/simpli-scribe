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
    description: 'Stream your favorite movies and TV shows on-demand.',
    features: ['4K Ultra HD', 'Multiple Profiles', 'No ads', 'Download & watch offline']
  },
  {
    name: 'Spotify',
    description: 'Listen to millions of songs, podcasts, and audiobooks.',
    features: ['Ad-free music', 'Offline playback', 'High quality audio', 'Collaborative playlists']
  },
  {
    name: 'Notion',
    description: 'All-in-one workspace for notes, docs, and collaboration.',
    features: ['Unlimited pages', 'Real-time collaboration', 'Custom workflows', 'API access']
  },
  {
    name: 'Adobe Creative Cloud',
    description: 'Professional creative tools for design and content creation.',
    features: ['Photoshop', 'Illustrator', 'Premium fonts', 'Cloud storage']
  },
  {
    name: 'Microsoft 365',
    description: 'Complete suite of productivity applications.',
    features: ['Word', 'Excel', 'PowerPoint', 'OneDrive storage']
  },
  {
    name: 'Disney+',
    description: 'Stream exclusive Disney, Pixar, Marvel, and Star Wars content.',
    features: ['4K streaming', 'Multiple profiles', 'Downloads', 'No ads']
  },
  {
    name: 'Amazon Prime',
    description: 'Shopping benefits, streaming, and more.',
    features: ['Free shipping', 'Prime Video', 'Prime Music', 'Prime Gaming']
  },
  {
    name: 'GitHub',
    description: 'Development platform for version control and collaboration.',
    features: ['Private repos', 'CI/CD', 'Issue tracking', 'Team management']
  },
  {
    name: 'Slack',
    description: 'Business communication and team collaboration platform.',
    features: ['Channels', 'File sharing', 'App integrations', 'Video calls']
  },
  {
    name: 'Dropbox',
    description: 'Cloud storage and file synchronization service.',
    features: ['File backup', 'File sharing', 'Team collaboration', 'Smart sync']
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
            // First check if we already have a logo stored
            const { data: existingLogo, error: fetchError } = await supabase
              .from('subscription_logos')
              .select('logo_path')
              .eq('service_name', service.name)
              .maybeSingle();

            if (fetchError) {
              console.error('Error fetching logo:', fetchError);
              throw fetchError;
            }

            if (existingLogo?.logo_path) {
              return {
                ...service,
                logoPath: existingLogo.logo_path,
                features: service.features || []
              };
            }

            // If no logo exists, generate one using the AI function
            const { data: generatedLogo, error: generateError } = await supabase.functions.invoke('generate-logo', {
              body: { serviceName: service.name }
            });

            if (generateError) {
              console.error('Error generating logo:', generateError);
              throw generateError;
            }

            // Store the generated logo path, handle potential duplicates
            if (generatedLogo?.logo_path) {
              const { error: insertError } = await supabase
                .from('subscription_logos')
                .upsert({ 
                  service_name: service.name, 
                  logo_path: generatedLogo.logo_path 
                }, {
                  onConflict: 'service_name',
                  ignoreDuplicates: true
                });

              if (insertError) {
                console.error('Error storing logo:', insertError);
                // Don't throw here, we still have the generated logo
              }

              return {
                ...service,
                logoPath: generatedLogo.logo_path,
                features: service.features || []
              };
            }

            throw new Error('No logo path received');
          } catch (error) {
            console.error('Error handling logo for', service.name, ':', error);
            toast({
              title: `Couldn't load logo for ${service.name}`,
              description: "Using fallback display",
              variant: "destructive",
            });
            return {
              ...service,
              logoPath: null,
              features: service.features || []
            };
          }
        })
      );
      return results;
    },
    retry: 2,
    retryDelay: 1000,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
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
        className="w-full h-full relative"
      >
        <SubscriptionCarousel subscriptions={subscriptions || []} />
      </motion.div>
    </AnimatePresence>
  );
};
