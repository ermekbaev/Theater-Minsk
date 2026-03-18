'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Theater } from 'lucide-react';
import Header from '@/components/Header';
import PerformanceCard from '@/components/PerformanceCard';
import CatalogFilters from '@/components/CatalogFilters';
import { MOODS } from '@/data/types';
import type { Performance } from '@/data/types';

export default function CatalogPage() {
  const [search, setSearch] = useState('');
  const [selectedTheaters, setSelectedTheaters] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPerformances = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (selectedTheaters.length === 1) params.set('theater', selectedTheaters[0]);
    if (selectedGenres.length === 1) params.set('genre', selectedGenres[0]);
    if (selectedMood) {
      const mood = MOODS.find((m) => m.id === selectedMood);
      if (mood) mood.emotions.forEach((e) => params.append('emotion', e));
    }
    const res = await fetch(`/api/performances?${params.toString()}`);
    const data: Performance[] = await res.json();

    // client-side multi-theater/genre filter (API handles single values)
    let result = data;
    if (selectedTheaters.length > 1) {
      result = result.filter((p) => selectedTheaters.includes(p.theater));
    }
    if (selectedGenres.length > 1) {
      result = result.filter((p) => selectedGenres.includes(p.genre));
    }

    setPerformances(result);
    setLoading(false);
  }, [search, selectedTheaters, selectedGenres, selectedMood]);

  useEffect(() => {
    const timer = setTimeout(fetchPerformances, 200);
    return () => clearTimeout(timer);
  }, [fetchPerformances]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative h-[340px] overflow-hidden"
      >
        <Image
          src="/images/hero-theater.jpg"
          alt="Театральная сцена"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="max-w-lg font-display text-4xl font-bold text-primary-foreground md:text-5xl"
            >
              Откройте мир
              <br />
              <span className="text-accent">театра Минска</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-4 max-w-md font-body text-primary-foreground/80"
            >
              Подберите спектакль по настроению, сравните эмоциональные профили и найдите идеальную постановку
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Catalog */}
      <main className="container mx-auto px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <CatalogFilters
              search={search}
              onSearchChange={setSearch}
              selectedTheaters={selectedTheaters}
              onTheatersChange={setSelectedTheaters}
              selectedGenres={selectedGenres}
              onGenresChange={setSelectedGenres}
              selectedMood={selectedMood}
              onMoodChange={setSelectedMood}
              onReset={() => {
                setSearch('');
                setSelectedTheaters([]);
                setSelectedGenres([]);
                setSelectedMood(null);
              }}
            />
          </div>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-body text-sm text-muted-foreground">
                {loading ? 'Загрузка...' : `Найдено: ${performances.length} спектаклей`}
              </p>
            </div>
            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
                ))}
              </div>
            ) : performances.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {performances.map((p, i) => (
                  <PerformanceCard key={p.id} performance={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="font-display text-lg text-muted-foreground">Спектакли не найдены</p>
                <p className="mt-2 font-body text-sm text-muted-foreground">
                  Попробуйте изменить параметры поиска
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-foreground py-10 px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Theater size={22} className="text-accent" />
            <span className="font-display text-lg font-bold text-primary-foreground">
              Театральный <span className="text-accent">гид</span>
            </span>
          </div>
          <p className="font-body text-sm text-primary-foreground/50">
            © 2026 Театральный гид. Дипломный проект. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
