import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function recomputePerformance(performanceId: string) {
  const agg = await prisma.review.aggregate({
    where: { performanceId },
    _avg: { rating: true },
    _count: { id: true },
  });

  await prisma.performance.update({
    where: { id: performanceId },
    data: {
      rating: Math.round((agg._avg.rating ?? 0) * 10) / 10,
      reviewCount: agg._count.id,
    },
  });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const currentUser = session?.user as { id?: string; role?: string } | undefined;
  if (!currentUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (review.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { rating, text, emotions } = (await req.json()) as {
    rating: number;
    text: string;
    emotions?: { emotion: string; score: number }[];
  };

  if (!rating || !text?.trim()) {
    return NextResponse.json({ error: 'rating and text are required' }, { status: 400 });
  }

  await prisma.reviewEmotion.deleteMany({ where: { reviewId: id } });

  const updated = await prisma.review.update({
    where: { id },
    data: {
      rating,
      text: text.trim(),
      emotions: emotions && emotions.length ? { create: emotions } : undefined,
    },
    include: { emotions: true },
  });

  await recomputePerformance(review.performanceId);

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const currentUser = session?.user as { id?: string; role?: string } | undefined;
  if (!currentUser?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (review.userId !== currentUser.id && currentUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.reviewEmotion.deleteMany({ where: { reviewId: id } });
  await prisma.review.delete({ where: { id } });

  await recomputePerformance(review.performanceId);

  return NextResponse.json({ ok: true });
}
