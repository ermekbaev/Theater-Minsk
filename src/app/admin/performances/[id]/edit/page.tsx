export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PerformanceForm from '../../_components/PerformanceForm';

export const dynamic = 'force-dynamic';

export default async function EditPerformancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [performance, theaters] = await Promise.all([
    prisma.performance.findUnique({
      where: { id },
      include: { emotionProfile: true, targetAudience: true, cast: true },
    }),
    prisma.theater.findMany({ orderBy: { name: 'asc' } }),
  ]);

  if (!performance) notFound();

  const initialData = {
    id: performance.id,
    title: performance.title,
    theaterId: performance.theaterId,
    genre: performance.genre,
    duration: performance.duration,
    director: performance.director,
    synopsis: performance.synopsis,
    imageUrl: performance.imageUrl,
    heroImageUrl: performance.heroImageUrl ?? '',
    premiere: performance.premiere,
    emotionProfile: performance.emotionProfile.map((e) => ({ emotion: e.emotion, score: e.score })),
    targetAudience: performance.targetAudience.map((t) => t.tag),
    cast: performance.cast.map((c) => c.name),
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Редактировать: {performance.title}</h1>
      <PerformanceForm theaters={theaters} initialData={initialData} mode="edit" />
    </div>
  );
}
