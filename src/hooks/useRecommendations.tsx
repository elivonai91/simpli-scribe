import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';

export const useRecommendations = () => {
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['recommendations', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('subscription_recommendations')
        .select(`
          *,
          partner_services (*)
        `)
        .eq('user_id', session.user.id)
        .order('score', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const generateRecommendations = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('No user logged in');

      const { data, error } = await supabase.functions.invoke('generate-recommendations', {
        body: { userId: session.user.id }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      toast({
        title: 'Recommendations Updated',
        description: 'Your personalized recommendations have been refreshed.'
      });
    },
    onError: (error) => {
      console.error('Error generating recommendations:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate recommendations. Please try again.',
        variant: 'destructive'
      });
    }
  });

  return {
    recommendations,
    isLoading,
    generateRecommendations: generateRecommendations.mutate,
    isGenerating: generateRecommendations.isPending
  };
};