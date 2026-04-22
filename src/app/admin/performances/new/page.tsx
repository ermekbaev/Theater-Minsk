export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import PerformanceForm from '../_components/PerformanceForm';

export const dynamic = 'force-dynamic';

export default async function NewPerformancePage() {
  const theaters = await prisma.theater.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Новая постановка</h1>
      <PerformanceForm theaters={theaters} mode="create" />
    </div>
  );
}
