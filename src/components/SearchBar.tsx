import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

export const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(false);

  const filters = [
    { id: 'productivity', label: 'Productivity' },
    { id: 'entertainment', label: 'Entertainment' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' },
  ];

  return (
    <div className="space-y-4">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl flex items-center px-6 py-3 w-full">
        <Search className="w-5 h-5 text-white/50" />
        <input
          type="text"
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
    </div>
  );
};