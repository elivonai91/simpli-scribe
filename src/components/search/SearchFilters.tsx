import React from 'react';
import { motion } from 'framer-motion';
import { FilterState } from '@/types/search';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface SearchFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: any) => void;
}

export const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'development', label: 'Development' },
  { id: 'design', label: 'Design' },
  { id: 'business', label: 'Business' },
];

export const popularityOptions = [
  { id: 'all', label: 'All' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFilterChange }) => {
  return (
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
            onValueChange={(value) => onFilterChange('category', value)}
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
              onValueChange={(value) => onFilterChange('priceRange', value)}
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
            onValueChange={(value) => onFilterChange('popularity', value)}
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
  );
};