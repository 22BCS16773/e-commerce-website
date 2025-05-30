
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = "Search products..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-lg">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 group-focus-within:text-purple-400 transition-colors" />
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onSearch(e.target.value);
          }}
          placeholder={placeholder}
          className="pl-12 pr-12 py-3 bg-white/10 backdrop-blur-md border-white/30 text-white placeholder-gray-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 transition-all duration-300 rounded-xl"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
};
