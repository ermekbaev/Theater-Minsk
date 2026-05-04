import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id || !session.user.name) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { rating, text, emotions } = body as {
    rating: number;
    text: string;
    emotions?: { emotion: string; score: number }[];
  };

  if (!rating || !text) {
    return NextResponse.json({ error: 'rating and text are required' }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      id: crypto.randomUUID(),
      performanceId: id,
      userId: session.user.id,
      author: session.user.name,
      rating,
      text,
      date: new Date().toISOString().split('T')[0],
      emotions: emotions ? { create: emotions } : undefined,
    },
    include: { emotions: true },
  });

  // Recompute rating and reviewCount
  const agg = await prisma.review.aggregate({
    where: { performanceId: id },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.performance.update({
    where: { id },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count.id,
    },
  });

  return NextResponse.json(review, { status: 201 });
}
