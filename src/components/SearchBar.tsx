import React, { useState, useCallback } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import debounce from 'lodash/debounce';
import { FilterState, SearchBarProps } from '@/types/search';
import { SearchFilters } from './search/SearchFilters';
import { SearchSuggestions } from './search/SearchSuggestions';

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 1000],
    popularity: 'all'
  });
  const { toast } = useToast();
  const session = useSession();

  const fetchAISuggestions = useCallback(
    debounce(async (query: string) => {
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
    [session, toast, filters]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchAISuggestions(query);
    onSearch?.(query, filters);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch?.(searchQuery, newFilters);
  };

  return (
    <div className="space-y-4 w-full max-w-[calc(100%-200px)]">
      <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl flex items-center px-6 h-[60px] w-full">
        <Search className="w-5 h-5 text-white/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search subscriptions..."
          className="ml-4 bg-transparent text-white outline-none w-full placeholder-white/50 text-base"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </motion.button>
      </div>

      {showFilters && (
        <SearchFilters filters={filters} onFilterChange={handleFilterChange} />
      )}

      <SearchSuggestions 
        suggestions={suggestions} 
        onSelect={setSearchQuery} 
      />
    </div>
  );
};