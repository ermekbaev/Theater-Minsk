import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function normalize(p: {
  id: string; title: string; genre: string; duration: string; director: string;
  synopsis: string; imageUrl: string; rating: number; reviewCount: number; premiere: string;
  theater: { name: string; shortName: string };
  emotionProfile: { emotion: string; score: number }[];
  targetAudience: { tag: string }[];
  cast: { name: string }[];
  _count: { reviews: number };
}) {
  return {
    id: p.id,
    title: p.title,
    theater: p.theater.name,
    genre: p.genre,
    duration: p.duration,
    director: p.director,
    synopsis: p.synopsis,
    imageUrl: p.imageUrl,
    rating: p.rating,
    reviewCount: p._count.reviews,
    premiere: p.premiere,
    emotionProfile: p.emotionProfile.map((ep) => ({ emotion: ep.emotion, score: ep.score })),
    targetAudience: p.targetAudience.map((ta) => ta.tag),
    cast: p.cast.map((c) => c.name),
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const search = searchParams.get('search') ?? '';
  const theater = searchParams.get('theater') ?? '';
  const genre = searchParams.get('genre') ?? '';
  const emotions = searchParams.getAll('emotion');

  const rows = await prisma.performance.findMany({
    where: {
      AND: [
        theater ? { theater: { name: theater } } : {},
        genre ? { genre } : {},
      ],
    },
    include: {
      theater: true,
      emotionProfile: true,
      targetAudience: true,
      cast: true,
      _count: { select: { reviews: true } },
    },
    orderBy: { rating: 'desc' },
  });

  const q = search.toLowerCase();
  const source = q
    ? rows.filter(
        (p: (typeof rows)[0]) =>
          p.title.toLowerCase().includes(q) ||
          p.director.toLowerCase().includes(q) ||
          p.theater.name.toLowerCase().includes(q) ||
          p.theater.shortName.toLowerCase().includes(q)
      )
    : rows;

  const normalized = source.map(normalize);

  type Normalized = ReturnType<typeof normalize>;
  if (emotions.length > 0) {
    const getScore = (p: Normalized) =>
      emotions.reduce((s, e) => s + (p.emotionProfile.find((x: { emotion: string }) => x.emotion === e)?.score ?? 0), 0);

    const threshold = emotions.length * 30;

    return NextResponse.json(
      normalized
        .filter((p) => getScore(p) >= threshold)
        .sort((a, b) => getScore(b) - getScore(a))
    );
  }

  return NextResponse.json(normalized);
}
