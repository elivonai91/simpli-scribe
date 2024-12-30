import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface SubscriptionLogo {
  logo_path: string;
}

const popularServices = ['Netflix', 'Spotify', 'Notion'];

export const PopularSubscriptions = () => {
  const { toast } = useToast();

  const fetchLogo = async (serviceName: string) => {
    // Try to fetch existing logo first
    const { data: existingLogo, error: fetchError } = await supabase
      .from('subscription_logos')
      .select('logo_path')
      .eq('service_name', serviceName)
      .maybeSingle();

    if (fetchError) {
      console.error('Error fetching logo:', fetchError);
      return null;
    }

    if (existingLogo) {
      return existingLogo.logo_path;
    }

    // If no logo exists, try to generate one
    try {
      const { data: generatedLogo, error: generateError } = await supabase.functions.invoke('generate-logo', {
        body: { serviceName },
      });

      if (generateError) {
        throw generateError;
      }

      return generatedLogo?.logo_path;
    } catch (error) {
      console.error('Error generating logo:', error);
      toast({
        title: "Couldn't generate logo",
        description: "Using fallback display",
        variant: "destructive",
      });
      return null;
    }
  };

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['popularSubscriptions'],
    queryFn: async () => {
      const results = await Promise.all(
        popularServices.map(async (service) => {
          const logoPath = await fetchLogo(service);
          return {
            name: service,
            logoPath,
          };
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {subscriptions?.map((subscription) => (
        <div
          key={subscription.name}
          className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
        >
          <div className="flex items-center space-x-4">
            {subscription.logoPath ? (
              <img
                src={subscription.logoPath}
                alt={`${subscription.name} logo`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                {subscription.name[0]}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">{subscription.name}</h3>
              <p className="text-sm text-white/60">Popular subscription</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};