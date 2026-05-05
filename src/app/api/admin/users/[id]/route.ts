import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const currentUser = session?.user as { id?: string; role?: string } | undefined;
  if (currentUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const { role } = await req.json();

  if (role !== 'USER' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Недопустимая роль' }, { status: 400 });
  }

  if (currentUser.id === id && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Нельзя понизить собственную роль' }, { status: 400 });
  }

  const user = await prisma.user.update({ where: { id }, data: { role } });
  return NextResponse.json(user);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const currentUser = session?.user as { id?: string; role?: string } | undefined;
  if (currentUser?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;

  if (currentUser.id === id) {
    return NextResponse.json({ error: 'Нельзя удалить собственный аккаунт' }, { status: 400 });
  }

  await prisma.review.updateMany({ where: { userId: id }, data: { userId: null } });
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
