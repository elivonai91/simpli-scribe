import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';
import { FilterState } from '@/types/search';
import { Json } from '@/integrations/supabase/types';

export const useSearchSuggestions = () => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const session = useSession();

  const fetchAISuggestions = useCallback(
    debounce(async (query: string, filters: FilterState) => {
      if (query.length < 3) return;

      try {
        const { data, error } = await supabase.functions.invoke('ai-suggestions', {
          body: { type: 'search', query },
        });

        if (error) throw error;

        if (session?.user) {
          const filtersJson = filters as unknown as Json;
          await supabase.from('search_history').insert({
            user_id: session.user.id,
            query,
            filters: filtersJson,
          });
        }

        const suggestions = data.suggestion
          .split('\n')
          .filter(Boolean)
          .map((s: string) => s.replace(/^-\s*/, ''));
        
        setSuggestions(suggestions);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch suggestions. Please try again.',
          variant: 'destructive',
        });
      }
    }, 500),
    [session, toast]
  );

  return { suggestions, fetchAISuggestions };
};