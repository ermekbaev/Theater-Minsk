'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

type Theater = { id: string; name: string; shortName: string };

export default function AdminTheatersPage() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editShort, setEditShort] = useState('');
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newShort, setNewShort] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const res = await fetch('/api/admin/theaters');
    setTheaters(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    setError('');
    const res = await fetch('/api/admin/theaters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: newId, name: newName, shortName: newShort }),
    });
    if (!res.ok) { setError((await res.json()).error); return; }
    setNewId(''); setNewName(''); setNewShort(''); setShowAdd(false);
    load();
  }

  async function handleEdit(id: string) {
    await fetch(`/api/admin/theaters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, shortName: editShort }),
    });
    setEditId(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Удалить театр?')) return;
    const res = await fetch(`/api/admin/theaters/${id}`, { method: 'DELETE' });
    if (!res.ok) { alert((await res.json()).error); return; }
    load();
  }

  if (loading) return <p className="text-gray-500">Загрузка...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Театры</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-rose-700 text-white rounded-lg text-sm font-medium hover:bg-rose-800 transition-colors"
        >
          <Plus size={16} /> Добавить
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 space-y-3">
          <h2 className="font-medium text-gray-900">Новый театр</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="ID (например: kupala)"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Полное название"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
            <input
              placeholder="Краткое название"
              value={newShort}
              onChange={(e) => setNewShort(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-rose-700 text-white rounded-lg text-sm hover:bg-rose-800 transition-colors">
              Сохранить
            </button>
            <button onClick={() => { setShowAdd(false); setError(''); }} className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">ID</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Название</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Краткое</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {theaters.map((t) => (
              <tr key={t.id}>
                <td className="px-5 py-3 text-gray-500 font-mono text-xs">{t.id}</td>
                <td className="px-5 py-3">
                  {editId === t.id ? (
                    <input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <span className="text-gray-900">{t.name}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  {editId === t.id ? (
                    <input
                      value={editShort}
                      onChange={(e) => setEditShort(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                    />
                  ) : (
                    <span className="text-gray-600">{t.shortName}</span>
                  )}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {editId === t.id ? (
                      <>
                        <button onClick={() => handleEdit(t.id)} className="p-1 text-green-600 hover:text-green-700">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditId(null)} className="p-1 text-gray-400 hover:text-gray-600">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditId(t.id); setEditName(t.name); setEditShort(t.shortName); }}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
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
