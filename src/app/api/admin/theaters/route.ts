import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

async function checkAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === 'ADMIN';
}

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const theaters = await prisma.theater.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(theaters);
}

export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id, name, shortName } = await req.json();
  if (!id || !name || !shortName) {
    return NextResponse.json({ error: 'id, name и shortName обязательны' }, { status: 400 });
  }

  const theater = await prisma.theater.create({ data: { id, name, shortName } });
  return NextResponse.json(theater, { status: 201 });
}
