import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { FilterState } from '@/types/search';

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  searchQuery,
  onSearchChange,
  showFilters,
  setShowFilters,
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl flex items-center px-6 h-[60px] w-full">
      <Search className="w-5 h-5 text-white/50" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
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
  );
};