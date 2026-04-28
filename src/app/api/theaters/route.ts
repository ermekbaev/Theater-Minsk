import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const theaters = await prisma.theater.findMany({ orderBy: { name: 'asc' } });
  return NextResponse.json(theaters);
}
