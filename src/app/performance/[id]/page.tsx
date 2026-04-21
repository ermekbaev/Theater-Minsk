"use client";

import { use, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Users, User, Theater } from "lucide-react";
import Header from "@/components/Header";
import StarRating from "@/components/StarRating";
import EmotionRadar from "@/components/EmotionRadar";
import ReviewForm from "@/components/ReviewForm";
import { THEATER_SHORT, EMOTIONS_MAP } from "@/data/types";
import type { Performance } from "@/data/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default function PerformanceDetailPage({ params }: Props) {
  const { id } = use(params);
  const [perf, setPerf] = useState<Performance | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const loadPerf = useCallback(() => {
    setLoading(true);
    fetch(`/api/performances/${id}`)
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) setPerf(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    loadPerf();
  }, [loadPerf]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="h-[600px] animate-pulse bg-muted" />
        <div className="container mx-auto px-4 py-10">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-6 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !perf) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="font-display text-2xl text-foreground">
            Спектакль не найден
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-block font-body text-sm text-primary hover:underline"
          >
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const shortTheater = THEATER_SHORT[perf.theater] || perf.theater;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[600px] overflow-hidden"
      >
        <Image
          src={perf.heroImageUrl ?? perf.imageUrl}
          alt={perf.title}
          fill
          className="object-cover object-[center_30%]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="container mx-auto">
            <Link
              href="/catalog"
              className="mb-4 inline-flex items-center gap-1.5 font-body text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              Каталог
            </Link>
            <span className="ml-4 inline-block rounded-sm bg-primary px-2 py-0.5 font-body text-xs font-medium text-primary-foreground">
              {perf.genre}
            </span>
            <h1 className="mt-2 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              {perf.title}
            </h1>
            <p className="mt-2 font-body text-primary-foreground/80">
              {perf.theater}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Meta */}
            <div className="flex flex-wrap gap-6 font-body text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock size={15} /> {perf.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={15} /> Премьера: {perf.premiere}
              </span>
              <span className="flex items-center gap-1.5">
                <User size={15} /> {perf.director}
              </span>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="mb-3 font-display text-xl font-semibold text-foreground">
                О спектакле
              </h2>
              <p className="font-body leading-relaxed text-foreground/85">
                {perf.synopsis}
              </p>
            </div>

            {/* Cast */}
            <div>
              <h2 className="mb-3 font-display text-xl font-semibold text-foreground">
                В ролях
              </h2>
              <div className="flex flex-wrap gap-2">
                {perf.cast.map((actor) => (
                  <span
                    key={actor}
                    className="rounded-full border border-border bg-muted px-3 py-1 font-body text-sm text-foreground"
                  >
                    {actor}
                  </span>
                ))}
              </div>
            </div>

            {/* Target audience */}
            <div>
              <h2 className="mb-3 flex items-center gap-2 font-display text-xl font-semibold text-foreground">
                <Users size={18} />
                Для кого этот спектакль
              </h2>
              <div className="flex flex-wrap gap-2">
                {perf.targetAudience.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-primary/20 bg-primary/5 px-3 py-1.5 font-body text-sm font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h2 className="mb-4 font-display text-xl font-semibold text-foreground">
                Отзывы ({perf.reviews.length})
              </h2>
              <div className="space-y-4">
                {perf.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-lg border border-border bg-card p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-body font-semibold text-foreground">
                        {review.author}
                      </span>
                      <span className="font-body text-xs text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="mt-1">
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <p className="mt-3 font-body text-sm leading-relaxed text-foreground/85">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <ReviewForm performanceId={perf.id} onSuccess={loadPerf} />
              </div>
            </div>
          </motion.div>

          {/* Right - Emotion analysis */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Rating card */}
            <div className="rounded-lg border border-border bg-card p-6 text-center">
              <p className="font-display text-4xl font-bold text-foreground">
                {perf.rating.toFixed(1)}
              </p>
              <div className="mt-2 flex justify-center">
                <StarRating rating={perf.rating} size={20} />
              </div>
              <p className="mt-1 font-body text-sm text-muted-foreground">
                {perf.reviewCount} отзывов
              </p>
            </div>

            {/* Emotion chart */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                Эмоциональный профиль
              </h3>
              <EmotionRadar profile={perf.emotionProfile} />
              <div className="mt-4 grid grid-cols-2 gap-2">
                {[...perf.emotionProfile]
                  .sort((a, b) => b.score - a.score)
                  .map((ep) => (
                    <div key={ep.emotion} className="flex items-center gap-2">
                      <div
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            EMOTIONS_MAP[
                              ep.emotion as keyof typeof EMOTIONS_MAP
                            ].color,
                        }}
                      />
                      <span className="font-body text-xs text-muted-foreground">
                        {
                          EMOTIONS_MAP[ep.emotion as keyof typeof EMOTIONS_MAP]
                            .label
                        }
                      </span>
                      <span className="ml-auto font-body text-xs font-semibold text-foreground">
                        {ep.score}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Compare CTA */}
            <Link
              href={`/compare?a=${perf.id}`}
              className="block rounded-lg border border-primary/20 bg-primary/5 p-4 text-center font-body text-sm font-medium text-primary transition-colors hover:bg-primary/10"
            >
              Сравнить с другим спектаклем →
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
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
