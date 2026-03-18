'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { THEATERS, THEATER_SHORT, GENRES, MOODS } from '@/data/types';

interface CatalogFiltersProps {
  search: string;
  onSearchChange: (v: string) => void;
  selectedTheaters: string[];
  onTheatersChange: (v: string[]) => void;
  selectedGenres: string[];
  onGenresChange: (v: string[]) => void;
  selectedMood: string | null;
  onMoodChange: (v: string | null) => void;
  onReset: () => void;
}

const CatalogFilters = ({
  search, onSearchChange,
  selectedTheaters, onTheatersChange,
  selectedGenres, onGenresChange,
  selectedMood, onMoodChange,
  onReset,
}: CatalogFiltersProps) => {
  const [showFilters, setShowFilters] = useState(true);

  const hasActiveFilters = search || selectedTheaters.length > 0 || selectedGenres.length > 0 || selectedMood;

  const toggleItem = (arr: string[], item: string, setter: (v: string[]) => void) => {
    setter(arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item]);
  };

  return (
    <aside className="space-y-6">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Поиск спектакля..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 font-body"
          />
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            title="Сбросить фильтры"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex w-full items-center gap-2 font-body text-sm font-medium text-muted-foreground hover:text-foreground transition-colors lg:hidden"
      >
        <SlidersHorizontal size={16} />
        {showFilters ? 'Скрыть фильтры' : 'Показать фильтры'}
      </button>

      <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Mood selector */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-semibold text-foreground">
            <Sparkles size={16} className="text-accent" />
            Подобрать по настроению
          </h3>
          <div className="space-y-2">
            {MOODS.map((mood) => (
              <button
                key={mood.id}
                onClick={() => onMoodChange(selectedMood === mood.id ? null : mood.id)}
                className={`w-full rounded-md border px-3 py-2 text-left font-body text-sm transition-all ${
                  selectedMood === mood.id
                    ? 'border-primary bg-primary/5 text-primary font-medium'
                    : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {mood.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theaters */}
        <div>
          <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Театр</h3>
          <div className="space-y-1.5">
            {THEATERS.map((theater) => (
              <label key={theater} className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedTheaters.includes(theater)}
                  onChange={() => toggleItem(selectedTheaters, theater, onTheatersChange)}
                  className="h-4 w-4 rounded border-border text-primary accent-primary"
                />
                <span className="font-body text-sm text-muted-foreground">
                  {THEATER_SHORT[theater] || theater}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Genres */}
        <div>
          <h3 className="mb-3 font-display text-sm font-semibold text-foreground">Жанр</h3>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => toggleItem(selectedGenres, genre, onGenresChange)}
                className={`rounded-full border px-3 py-1 font-body text-xs transition-all ${
                  selectedGenres.includes(genre)
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default CatalogFilters;
