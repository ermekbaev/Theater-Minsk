'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';

type Performance = {
  id: string;
  title: string;
  genre: string;
  theater: { name: string };
  imageUrl: string;
  rating: number;
};

export default function AdminPerformancesPage() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/performances');
    const data = await res.json();
    setPerformances(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Удалить постановку "${title}"?`)) return;
    const res = await fetch(`/api/admin/performances/${id}`, { method: 'DELETE' });
    if (!res.ok) { alert('Ошибка удаления'); return; }
    load();
  }

  if (loading) return <p className="text-gray-500">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Постановки</h1>
        <Link
          href="/admin/performances/new"
          className="flex items-center gap-2 px-4 py-2 bg-rose-700 text-white rounded-lg text-sm font-medium hover:bg-rose-800 transition-colors"
        >
          <Plus size={16} /> Добавить
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Постановка</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Театр</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Жанр</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Рейтинг</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {performances.map((p) => (
              <tr key={p.id}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {p.imageUrl && (
                        <Image
                          src={p.imageUrl}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{p.title}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-600">{(p as unknown as { theater: string }).theater || (p as { theater: { name: string } }).theater?.name}</td>
                <td className="px-5 py-3 text-gray-600">{p.genre}</td>
                <td className="px-5 py-3 text-gray-600">{p.rating.toFixed(1)}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/performances/${p.id}/edit`}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
