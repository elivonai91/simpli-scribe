import React, { useState, useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import debounce from 'lodash/debounce';

export const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { toast } = useToast();
  const session = useSession();

  const filters = [
    { id: 'productivity', label: 'Productivity' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' },
  ];

  const fetchAISuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) return;

      try {
        const { data, error } = await supabase.functions.invoke('ai-suggestions', {
          body: { type: 'search', query },
        });

        if (error) throw error;

        // Save search query to history
        if (session?.user) {
          await supabase.from('search_history').insert({
            user_id: session.user.id,
            query,
            filters: null,
          });
        }

        // Parse suggestions from AI response
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchAISuggestions(query);
  };

  return (
    <div className="space-y-4 w-full max-w-[calc(100%-200px)]">
      <div className="backdrop-blur-xl bg-white/10 rounded-xl flex items-center px-6 h-[52px] w-full">
        <Search className="w-5 h-5 text-white/50" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search subscriptions..."
          className="ml-4 bg-transparent text-white outline-none w-full placeholder-white/50"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70"
        >
          <Filter className="w-4 h-4" />
          Filters
        </motion.button>
      </div>

      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 p-4 backdrop-blur-xl bg-white/10 rounded-xl border border-white/10"
        >
          {filters.map(filter => (
            <button
              key={filter.id}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
            >
              {filter.label}
            </button>
          ))}
        </motion.div>
      )}

      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-2 p-2 backdrop-blur-xl bg-white/10 rounded-xl border border-white/10"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
              onClick={() => setSearchQuery(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};