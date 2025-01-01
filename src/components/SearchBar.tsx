import React, { useState } from 'react';
import { FilterState, SearchBarProps } from '@/types/search';
import { SearchFilters } from './search/SearchFilters';
import { SearchSuggestions } from './search/SearchSuggestions';
import { SearchInput } from './search/SearchInput';
import { useSearchSuggestions } from '@/hooks/useSearchSuggestions';

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: [0, 1000],
    popularity: 'all'
  });

  const { suggestions, fetchAISuggestions } = useSearchSuggestions();

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    fetchAISuggestions(query, filters);
    onSearch?.(query, filters);
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch?.(searchQuery, newFilters);
  };

  return (
    <div className="space-y-4 w-full max-w-[calc(100%-200px)]">
      <SearchInput
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />

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