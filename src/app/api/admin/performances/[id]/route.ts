import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === 'ADMIN';
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const body = await req.json();
  const {
    title, theaterId, genre, duration, director, synopsis,
    imageUrl, heroImageUrl, premiere,
    emotionProfile, targetAudience, cast,
  } = body;

  await prisma.$transaction([
    prisma.emotionProfile.deleteMany({ where: { performanceId: id } }),
    prisma.targetAudience.deleteMany({ where: { performanceId: id } }),
    prisma.castMember.deleteMany({ where: { performanceId: id } }),
  ]);

  const performance = await prisma.performance.update({
    where: { id },
    data: {
      title,
      theaterId,
      genre,
      duration,
      director,
      synopsis,
      imageUrl,
      heroImageUrl: heroImageUrl || null,
      premiere,
      emotionProfile: {
        create: (emotionProfile as { emotion: string; score: number }[]).map((e) => ({
          emotion: e.emotion,
          score: e.score,
        })),
      },
      targetAudience: {
        create: (targetAudience as string[]).map((tag) => ({ tag })),
      },
      cast: {
        create: (cast as string[]).map((name) => ({ name })),
      },
    },
    include: { theater: true, emotionProfile: true, targetAudience: true, cast: true },
  });

  return NextResponse.json(performance);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  await prisma.$transaction([
    prisma.reviewEmotion.deleteMany({ where: { review: { performanceId: id } } }),
    prisma.review.deleteMany({ where: { performanceId: id } }),
    prisma.emotionProfile.deleteMany({ where: { performanceId: id } }),
    prisma.targetAudience.deleteMany({ where: { performanceId: id } }),
    prisma.castMember.deleteMany({ where: { performanceId: id } }),
    prisma.performance.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
