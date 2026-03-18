'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Theater } from 'lucide-react';
import Header from '@/components/Header';
import EmotionRadar from '@/components/EmotionRadar';
import StarRating from '@/components/StarRating';
import { THEATER_SHORT, EMOTIONS_MAP } from '@/data/types';
import type { Performance } from '@/data/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

function CompareContent() {
  const searchParams = useSearchParams();
  const initialA = searchParams.get('a') || '';

  const [perfAId, setPerfAId] = useState(initialA);
  const [perfBId, setPerfBId] = useState('');
  const [performances, setPerformances] = useState<Performance[]>([]);

  useEffect(() => {
    fetch('/api/performances')
      .then((r) => r.json())
      .then(setPerformances);
  }, []);

  const perfA = useMemo(() => performances.find((p) => p.id === perfAId), [perfAId, performances]);
  const perfB = useMemo(() => performances.find((p) => p.id === perfBId), [perfBId, performances]);

  const swap = () => {
    setPerfAId(perfBId);
    setPerfBId(perfAId);
  };

  const CompactCard = ({ perf }: { perf: typeof perfA }) => {
    if (!perf) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4"
      >
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={perf.imageUrl}
            alt={perf.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-foreground truncate">{perf.title}</h3>
          <p className="font-body text-sm text-muted-foreground truncate">
            {THEATER_SHORT[perf.theater]} · {perf.genre} · {perf.duration}
          </p>
          <div className="mt-1 flex items-center gap-2">
            <StarRating rating={perf.rating} size={14} />
            <span className="font-body text-xs text-muted-foreground">{perf.reviewCount} отзывов</span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 font-display text-3xl font-bold text-foreground"
      >
        Сравнение спектаклей
      </motion.h1>

      {/* Selection row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <label className="font-body text-xs font-medium text-muted-foreground">Спектакль A</label>
          <Select value={perfAId} onValueChange={setPerfAId}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Выберите первый спектакль" />
            </SelectTrigger>
            <SelectContent>
              {performances.filter((p) => p.id !== perfBId).map((p) => (
                <SelectItem key={p.id} value={p.id} className="font-body">
                  {p.title} — {THEATER_SHORT[p.theater]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={swap}
          disabled={!perfAId && !perfBId}
          className="shrink-0 self-center text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftRight size={20} />
        </Button>

        <div className="flex-1 space-y-1.5">
          <label className="font-body text-xs font-medium text-muted-foreground">Спектакль B</label>
          <Select value={perfBId} onValueChange={setPerfBId}>
            <SelectTrigger className="font-body">
              <SelectValue placeholder="Выберите второй спектакль" />
            </SelectTrigger>
            <SelectContent>
              {performances.filter((p) => p.id !== perfAId).map((p) => (
                <SelectItem key={p.id} value={p.id} className="font-body">
                  {p.title} — {THEATER_SHORT[p.theater]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards row */}
      {(perfA || perfB) && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            {perfA ? <CompactCard perf={perfA} /> : <p className="py-4 text-center font-body text-sm text-muted-foreground">Выберите спектакль A</p>}
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            {perfB ? <CompactCard perf={perfB} /> : <p className="py-4 text-center font-body text-sm text-muted-foreground">Выберите спектакль B</p>}
          </div>
        </div>
      )}

      {/* Comparison content */}
      {perfA && perfB && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 space-y-8"
        >
          {/* Emotion bars */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-5 font-display text-xl font-semibold text-foreground">Эмоциональный профиль</h2>
            <div className="space-y-4">
              {perfA.emotionProfile.map((epA) => {
                const epB = perfB.emotionProfile.find((e) => e.emotion === epA.emotion);
                const bScore = epB?.score ?? 0;
                return (
                  <div key={epA.emotion} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-body text-sm text-foreground font-medium">
                        {EMOTIONS_MAP[epA.emotion as keyof typeof EMOTIONS_MAP].label}
                      </span>
                      <div className="flex items-center gap-4 font-body text-xs">
                        <span className="text-primary font-semibold">{epA.score}%</span>
                        <span className="text-accent-foreground font-semibold">{bScore}%</span>
                      </div>
                    </div>
                    <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${epA.score}%` }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="absolute inset-y-0 left-0 rounded-full bg-primary/70"
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${bScore}%` }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="absolute inset-y-0 left-0 rounded-full border-2 border-accent"
                        style={{ background: 'transparent' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="font-body text-xs text-muted-foreground">{perfA.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border-2 border-accent" />
                <span className="font-body text-xs text-muted-foreground">{perfB.title}</span>
              </div>
            </div>
          </div>

          {/* Radar overlay */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-2 text-center font-display text-xl font-semibold text-foreground">
              Наложение профилей
            </h2>
            <div className="flex items-center justify-center gap-6 mb-2">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-primary" />
                <span className="font-body text-xs text-muted-foreground">{perfA.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-accent" />
                <span className="font-body text-xs text-muted-foreground">{perfB.title}</span>
              </div>
            </div>
            <EmotionRadar
              profile={perfA.emotionProfile}
              secondProfile={perfB.emotionProfile}
              height={320}
            />
          </div>

          {/* Target audience comparison */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-3 font-display text-base font-semibold text-foreground">
                Для кого — {perfA.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {perfA.targetAudience.map((tag) => (
                  <span key={tag} className="rounded-md border border-primary/20 bg-primary/5 px-2 py-1 font-body text-xs text-primary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="mb-3 font-display text-base font-semibold text-foreground">
                Для кого — {perfB.title}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {perfB.targetAudience.map((tag) => (
                  <span key={tag} className="rounded-md border border-accent/30 bg-accent/5 px-2 py-1 font-body text-xs text-accent-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!perfA && !perfB && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-16 text-center"
        >
          <ArrowLeftRight size={48} className="mx-auto mb-4 text-muted-foreground/30" />
          <p className="font-display text-lg text-muted-foreground">
            Выберите два спектакля для сравнения
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <Suspense fallback={<div className="container mx-auto px-4 py-8"><p className="font-body text-muted-foreground">Загрузка...</p></div>} >
        <div className="flex-1">
          <CompareContent />
        </div>
      </Suspense>

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
