export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';
import { Film, Theater, Users, Plus } from 'lucide-react';

export default async function AdminDashboard() {
  const [performanceCount, theaterCount, userCount, recentPerformances] = await Promise.all([
    prisma.performance.count(),
    prisma.theater.count(),
    prisma.user.count(),
    prisma.performance.findMany({
      take: 5,
      include: { theater: true },
      orderBy: { id: 'desc' },
    }),
  ]);

  const stats = [
    { label: 'Постановки', value: performanceCount, icon: Film, href: '/admin/performances' },
    { label: 'Театры', value: theaterCount, icon: Theater, href: '/admin/theaters' },
    { label: 'Пользователи', value: userCount, icon: Users, href: '/admin/users' },
  ];

  const quickActions = [
    { label: 'Добавить постановку', href: '/admin/performances/new', icon: Film },
    { label: 'Добавить театр', href: '/admin/theaters', icon: Theater },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Дашборд</h1>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-6">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="bg-white rounded-xl border border-gray-200 p-6 flex items-center gap-4 hover:border-rose-300 transition-colors"
          >
            <div className="p-3 bg-rose-50 rounded-lg">
              <Icon size={22} className="text-rose-700" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Последние постановки */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Последние постановки</h2>
            <Link href="/admin/performances" className="text-sm text-rose-700 hover:underline">
              Все постановки →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPerformances.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  {p.imageUrl && (
                    <Image
                      src={p.imageUrl}
                      alt={p.title}
                      width={36}
                      height={36}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.theater.name} · {p.genre}</p>
                </div>
                <Link
                  href={`/admin/performances/${p.id}/edit`}
                  className="text-xs text-gray-400 hover:text-rose-600 transition-colors shrink-0"
                >
                  Изменить
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Быстрые действия</h2>
          </div>
          <div className="p-4 space-y-3">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-rose-300 hover:bg-rose-50 transition-colors"
              >
                <Plus size={15} className="text-rose-700" />
                <span className="text-sm text-gray-700">{label}</span>
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <Film size={15} className="text-gray-500" />
              <span className="text-sm text-gray-700">Открыть сайт</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
