import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

async function checkAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === 'ADMIN';
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const {
    title, theaterId, genre, duration, director, synopsis,
    imageUrl, heroImageUrl, premiere,
    emotionProfile, targetAudience, cast,
  } = body;

  if (!title || !theaterId || !genre || !duration || !director || !synopsis || !imageUrl || !premiere) {
    return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
  }

  const id = randomUUID();

  const performance = await prisma.performance.create({
    data: {
      id,
      title,
      theaterId,
      genre,
      duration,
      director,
      synopsis,
      imageUrl,
      heroImageUrl: heroImageUrl || null,
      rating: 0,
      reviewCount: 0,
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

  return NextResponse.json(performance, { status: 201 });
}
