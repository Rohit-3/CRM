import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Sparkles, Filter, X, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AISmartSearchProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchFilters {
  minAmount?: number;
  maxAmount?: number;
  minProbability?: number;
  maxProbability?: number;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export function AISmartSearch({ 
  value, 
  onChange, 
  onFilterChange,
  placeholder = 'Search with AI...', 
  className 
}: AISmartSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleFilterChange = (key: keyof SearchFilters, filterValue: any) => {
    const newFilters = { ...filters, [key]: filterValue };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange?.({});
  };

  const activeFilterCount = Object.keys(filters).filter(key => {
    const val = filters[key as keyof SearchFilters];
    if (key === 'dateRange') {
      const dateRange = val as { from?: string; to?: string } | undefined;
      return dateRange && (dateRange.from || dateRange.to);
    }
    return val !== undefined && val !== null && String(val) !== '';
  }).length;

  // Simulate AI suggestions based on input
  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    // AI-powered suggestions (simulated)
    if (inputValue.length > 2) {
      const suggestions = [
        'High-value deals over $50k',
        'Opportunities closing this month',
        'Deals with >75% probability',
        'Stale opportunities (no activity)',
      ].filter(s => s.toLowerCase().includes(inputValue.toLowerCase()));
      setAiSuggestions(suggestions);
    } else {
      setAiSuggestions([]);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary animate-pulse" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 focus:border-primary focus:ring-primary"
          />
        </div>

        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="relative bg-slate-800 border-slate-700 hover:bg-slate-700"
            >
              <Filter className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-slate-900 border-slate-700 text-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Advanced Filters</h4>
                {activeFilterCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-8 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    Amount Range
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount || ''}
                      onChange={(e) => handleFilterChange('minAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="bg-slate-800 border-slate-700"
                    />
                    <span className="text-slate-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount || ''}
                      onChange={(e) => handleFilterChange('maxAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-amber-400" />
                    Probability Range
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min %"
                      min="0"
                      max="100"
                      value={filters.minProbability || ''}
                      onChange={(e) => handleFilterChange('minProbability', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="bg-slate-800 border-slate-700"
                    />
                    <span className="text-slate-400">-</span>
                    <Input
                      type="number"
                      placeholder="Max %"
                      min="0"
                      max="100"
                      value={filters.maxProbability || ''}
                      onChange={(e) => handleFilterChange('maxProbability', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    Close Date Range
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={filters.dateRange?.from || ''}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, from: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                    <span className="text-slate-400">-</span>
                    <Input
                      type="date"
                      value={filters.dateRange?.to || ''}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, to: e.target.value })}
                      className="bg-slate-800 border-slate-700"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI-powered filtering for smarter results
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* AI Suggestions */}
      {aiSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-2 border-b border-slate-700 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-white">AI Suggestions</span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {aiSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  onChange(suggestion);
                  setAiSuggestions([]);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-800 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          {filters.minAmount && (
            <Badge variant="secondary" className="bg-slate-800 text-white">
              Min: ${filters.minAmount}
            </Badge>
          )}
          {filters.maxAmount && (
            <Badge variant="secondary" className="bg-slate-800 text-white">
              Max: ${filters.maxAmount}
            </Badge>
          )}
          {filters.minProbability && (
            <Badge variant="secondary" className="bg-slate-800 text-white">
              Prob ≥ {filters.minProbability}%
            </Badge>
          )}
          {filters.maxProbability && (
            <Badge variant="secondary" className="bg-slate-800 text-white">
              Prob ≤ {filters.maxProbability}%
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
