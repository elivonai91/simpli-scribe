import React from 'react';
import { motion } from 'framer-motion';

interface SearchSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ suggestions, onSelect }) => {
  if (suggestions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute z-10 w-full mt-2 p-2 backdrop-blur-xl bg-white/10 rounded-xl border border-white/10"
    >
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          className="w-full text-left px-4 py-2 text-white/70 hover:bg-white/10 rounded-lg"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </button>
      ))}
    </motion.div>
  );
};