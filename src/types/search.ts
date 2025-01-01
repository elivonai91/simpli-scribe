import { Json } from "@/integrations/supabase/types";

export interface FilterState {
  [key: string]: string | [number, number] | string[];
  category: string;
  priceRange: [number, number];
  popularity: string;
}

export interface SearchBarProps {
  onSearch?: (query: string, filters: FilterState) => void;
}