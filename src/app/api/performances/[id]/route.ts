import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const p = await prisma.performance.findUnique({
    where: { id },
    include: {
      theater: true,
      emotionProfile: true,
      targetAudience: true,
      cast: true,
      reviews: {
        include: { emotions: true },
        orderBy: { date: 'desc' },
      },
    },
  });

  if (!p) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: p.id,
    title: p.title,
    theater: p.theater.name,
    genre: p.genre,
    duration: p.duration,
    director: p.director,
    synopsis: p.synopsis,
    imageUrl: p.imageUrl,
    heroImageUrl: p.heroImageUrl ?? null,
    rating: p.rating,
    reviewCount: p.reviews.length,
    premiere: p.premiere,
    emotionProfile: p.emotionProfile.map((ep: { emotion: string; score: number }) => ({ emotion: ep.emotion, score: ep.score })),
    targetAudience: p.targetAudience.map((ta: { tag: string }) => ta.tag),
    cast: p.cast.map((c: { name: string }) => c.name),
    reviews: p.reviews.map((r: { id: string; userId: string | null; author: string; date: string; rating: number; text: string; emotions: { emotion: string; score: number }[] }) => ({
      id: r.id,
      userId: r.userId,
      author: r.author,
      date: r.date,
      rating: r.rating,
      text: r.text,
      emotionScores: r.emotions.map((e: { emotion: string; score: number }) => ({ emotion: e.emotion, score: e.score })),
    })),
  });
}
