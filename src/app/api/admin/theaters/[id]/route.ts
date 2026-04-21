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
  const { name, shortName } = await req.json();

  const theater = await prisma.theater.update({ where: { id }, data: { name, shortName } });
  return NextResponse.json(theater);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;

  const count = await prisma.performance.count({ where: { theaterId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: 'Нельзя удалить театр с постановками' },
      { status: 400 }
    );
  }

  await prisma.theater.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
