'use client';

import { useState } from 'react';
import { Star, LogIn } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { EMOTIONS_MAP } from '@/data/types';
import type { Emotion, EmotionScore } from '@/data/types';

interface Props {
  performanceId: string;
  onSuccess: () => void;
  reviewId?: string;
  initialRating?: number;
  initialText?: string;
  initialEmotions?: EmotionScore[];
  onCancel?: () => void;
}

const EMOTIONS = Object.entries(EMOTIONS_MAP) as [Emotion, { label: string; color: string }][];

const EMPTY_SCORES: Record<Emotion, number> = {
  joy: 0, melancholy: 0, tension: 0, passion: 0, wonder: 0, sadness: 0,
};

export default function ReviewForm({
  performanceId,
  onSuccess,
  reviewId,
  initialRating = 0,
  initialText = '',
  initialEmotions,
  onCancel,
}: Props) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const sessionName = session?.user?.name ?? '';
  const isEdit = Boolean(reviewId);

  const [rating, setRating] = useState(initialRating);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState(initialText);
  const [emotionScores, setEmotionScores] = useState<Record<Emotion, number>>(() => {
    const base = { ...EMPTY_SCORES };
    initialEmotions?.forEach((e) => { base[e.emotion] = e.score; });
    return base;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!rating || !text.trim()) {
      setError('Заполните оценку и текст отзыва');
      return;
    }
    setError('');
    setLoading(true);

    const emotions = EMOTIONS
      .filter(([key]) => emotionScores[key] > 0)
      .map(([emotion]) => ({ emotion, score: emotionScores[emotion] }));

    const url = isEdit ? `/api/reviews/${reviewId}` : `/api/performances/${performanceId}/reviews`;
    const method = isEdit ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, text: text.trim(), emotions }),
    });

    setLoading(false);
    if (res.ok) {
      if (!isEdit) {
        setRating(0);
        setText('');
        setEmotionScores({ ...EMPTY_SCORES });
      }
      onSuccess();
    } else {
      setError('Ошибка при отправке. Попробуйте ещё раз.');
    }
  };

  if (!isEdit && status !== 'loading' && !session) {
    return (
      <div className="rounded-lg border border-border bg-card p-5 text-center space-y-3">
        <h3 className="font-display text-lg font-semibold text-foreground">Оставить отзыв</h3>
        <p className="font-body text-sm text-muted-foreground">
          Войдите в аккаунт, чтобы написать отзыв
        </p>
        <Button asChild className="gap-2">
          <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}>
            <LogIn size={16} />
            Войти
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-border bg-card p-5 space-y-5">
      <h3 className="font-display text-lg font-semibold text-foreground">
        {isEdit ? 'Редактировать отзыв' : 'Оставить отзыв'}
      </h3>

      {!isEdit && (
        <p className="font-body text-sm text-muted-foreground">
          Отзыв от: <span className="font-semibold text-foreground">{sessionName}</span>
        </p>
      )}

      <div className="space-y-1.5">
        <label className="font-body text-xs font-medium text-muted-foreground">Оценка</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="transition-transform hover:scale-110"
            >
              <Star
                size={28}
                className={`transition-colors ${
                  star <= (hovered || rating)
                    ? 'fill-accent text-accent'
                    : 'text-muted-foreground'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="font-body text-xs font-medium text-muted-foreground">Текст отзыва</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Поделитесь впечатлениями о спектакле..."
          rows={3}
          maxLength={1000}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-right font-body text-xs text-muted-foreground">{text.length}/1000</p>
      </div>

      <div className="space-y-2">
        <label className="font-body text-xs font-medium text-muted-foreground">
          Эмоции (необязательно)
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {EMOTIONS.map(([key, em]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: em.color }}
              />
              <span className="w-24 shrink-0 font-body text-xs text-muted-foreground">{em.label}</span>
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={emotionScores[key]}
                onChange={(e) => setEmotionScores((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                className="h-1.5 flex-1 cursor-pointer accent-primary"
              />
              <span className="w-8 text-right font-body text-xs font-semibold text-foreground">
                {emotionScores[key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="font-body text-xs text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? 'Отправка...' : isEdit ? 'Сохранить' : 'Опубликовать отзыв'}
        </Button>
        {isEdit && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
      </div>
    </form>
  );
}
