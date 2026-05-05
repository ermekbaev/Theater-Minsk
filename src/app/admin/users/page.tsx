'use client';

import { useEffect, useState } from 'react';
import { Trash2, ShieldCheck, Shield } from 'lucide-react';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch('/api/admin/users');
    setUsers(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleRole(u: User) {
    const nextRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
    const action = nextRole === 'ADMIN' ? 'Назначить администратором?' : 'Снять права администратора?';
    if (!confirm(`${action} (${u.email})`)) return;

    const res = await fetch(`/api/admin/users/${u.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: nextRole }),
    });
    if (!res.ok) { alert((await res.json()).error); return; }
    load();
  }

  async function handleDelete(u: User) {
    if (!confirm(`Удалить пользователя ${u.email}?`)) return;
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' });
    if (!res.ok) { alert((await res.json()).error); return; }
    load();
  }

  if (loading) return <p className="text-gray-500">Загрузка...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Пользователи</h1>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Имя</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Email</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Роль</th>
              <th className="text-left px-5 py-3 font-medium text-gray-600">Дата регистрации</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-5 py-3 font-medium text-gray-900">{u.name}</td>
                <td className="px-5 py-3 text-gray-600">{u.email}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    u.role === 'ADMIN' ? 'bg-rose-100 text-rose-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-gray-500 text-xs">
                  {new Date(u.createdAt).toLocaleDateString('ru-RU')}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleRole(u)}
                      title={u.role === 'ADMIN' ? 'Снять права администратора' : 'Назначить администратором'}
                      className="p-1 text-gray-400 hover:text-rose-700 transition-colors"
                    >
                      {u.role === 'ADMIN' ? <Shield size={16} /> : <ShieldCheck size={16} />}
                    </button>
                    <button
                      onClick={() => handleDelete(u)}
                      title="Удалить пользователя"
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
