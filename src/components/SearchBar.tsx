import React, { useState, useCallback } from 'react';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import debounce from 'lodash/debounce';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface FilterState {
  category: string;
  priceRange: [number, number];
  popularity: string;
}

export const SearchBar = () => {
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

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'productivity', label: 'Productivity' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' },
  ];

  const popularityOptions = [
    { id: 'all', label: 'All' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
  ];

  const fetchAISuggestions = useCallback(
    debounce(async (query: string) => {
      if (query.length < 3) return;

      try {
        const { data, error } = await supabase.functions.invoke('ai-suggestions', {
          body: { type: 'search', query },
        });

        if (error) throw error;

        if (session?.user) {
          await supabase.from('search_history').insert({
            user_id: session.user.id,
            query,
            filters: filters,
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
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 p-6 backdrop-blur-xl bg-white/10 rounded-xl border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-white/70">Category</label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange('category', value)}
              >
                <SelectTrigger className="bg-white/10 border-white/10 text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Price Range</label>
              <div className="pt-4">
                <Slider
                  value={filters.priceRange}
                  min={0}
                  max={1000}
                  step={10}
                  onValueChange={(value) => handleFilterChange('priceRange', value)}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-sm text-white/70">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/70">Popularity</label>
              <Select
                value={filters.popularity}
                onValueChange={(value) => handleFilterChange('popularity', value)}
              >
                <SelectTrigger className="bg-white/10 border-white/10 text-white">
                  <SelectValue placeholder="Select popularity" />
                </SelectTrigger>
                <SelectContent>
                  {popularityOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
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