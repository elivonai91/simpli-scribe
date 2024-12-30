import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from '@/hooks/use-toast';

interface ServiceLogo {
  service_name: string;
  logo_path: string;
}

const popularServices = [
  {
    name: 'Netflix',
    category: 'Entertainment',
    price: 19.99,
    description: 'Stream your favorite shows and movies',
    trending: true
  },
  {
    name: 'Spotify',
    category: 'Music',
    price: 9.99,
    description: 'Music streaming with personalized playlists'
  },
  {
    name: 'Notion',
    category: 'Productivity',
    price: 8,
    description: 'All-in-one workspace for notes and collaboration',
    trending: true
  },
  {
    name: 'Adobe CC',
    category: 'Creative',
    price: 52.99,
    description: 'Professional creative tools suite'
  }
];

export const PopularSubscriptions = () => {
  const [logos, setLogos] = useState<Record<string, string>>({});
  const [loadingLogos, setLoadingLogos] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const loadLogos = async () => {
      for (const service of popularServices) {
        try {
          setLoadingLogos(prev => ({ ...prev, [service.name]: true }));
          setErrors(prev => ({ ...prev, [service.name]: '' }));
          
          const { data: existingLogo, error: queryError } = await supabase
            .from('subscription_logos')
            .select('logo_path')
            .eq('service_name', service.name)
            .maybeSingle();

          if (queryError) {
            console.error(`Error querying logo for ${service.name}:`, queryError);
            throw queryError;
          }

          if (existingLogo?.logo_path) {
            setLogos(prev => ({ ...prev, [service.name]: existingLogo.logo_path }));
          } else {
            console.log(`Generating logo for ${service.name}...`);
            const { data, error } = await supabase.functions.invoke('generate-logo', {
              body: { serviceName: service.name }
            });

            if (error) {
              console.error(`Error generating logo for ${service.name}:`, error);
              throw error;
            }

            if (data?.logo_path) {
              setLogos(prev => ({ ...prev, [service.name]: data.logo_path }));
            } else {
              throw new Error('No logo path returned from generation');
            }
          }
        } catch (error) {
          console.error(`Error handling logo for ${service.name}:`, error);
          setErrors(prev => ({ 
            ...prev, 
            [service.name]: error instanceof Error ? error.message : 'Failed to load logo'
          }));
          toast({
            title: "Error with logo",
            description: `Could not load logo for ${service.name}`,
            variant: "destructive"
          });
        } finally {
          setLoadingLogos(prev => ({ ...prev, [service.name]: false }));
        }
      }
    };

    loadLogos();
  }, [toast]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {popularServices.map((service, index) => (
        <motion.div
          key={service.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/10 hover:bg-white/20 transition-all duration-300"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {loadingLogos[service.name] ? (
                <div className="w-16 h-16 rounded-xl bg-white/20 animate-pulse" />
              ) : logos[service.name] ? (
                <img 
                  src={logos[service.name]} 
                  alt={`${service.name} logo`}
                  className="w-16 h-16 rounded-xl object-cover"
                  onError={() => {
                    setErrors(prev => ({ 
                      ...prev, 
                      [service.name]: 'Failed to load image' 
                    }));
                    setLogos(prev => {
                      const newLogos = { ...prev };
                      delete newLogos[service.name];
                      return newLogos;
                    });
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white/50">
                  {errors[service.name] ? '!' : service.name[0]}
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                <p className="text-purple-200/70">{service.category}</p>
              </div>
            </div>
            {service.trending && (
              <div className="flex items-center px-3 py-1 rounded-full bg-pink-500/20 text-pink-300">
                <TrendingUp className="w-4 h-4 mr-1" />
                Trending
              </div>
            )}
          </div>
          
          <p className="text-white/70 mb-4">{service.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
              ${service.price}/mo
            </span>
            <Button
              variant="outline"
              className="bg-white/10 border-purple-400/50 hover:bg-white/20 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </div>
        </motion.div>
      ))}
    </div>
  );
};