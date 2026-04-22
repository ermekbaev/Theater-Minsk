export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });

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
                  {u.createdAt.toLocaleDateString('ru-RU')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
