// app/api/schedules/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // sesuaikan path prisma client

// Update schedule (PUT)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const { title, date } = body;

    const updated = await prisma.schedule.update({
      where: { id: Number(params.id) },
      data: { title, date: new Date(date) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}

// Delete schedule (DELETE)
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.schedule.delete({
      where: { id: Number(params.id) },
    });

    return NextResponse.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json({ error: 'Failed to delete schedule' }, { status: 500 });
  }
}
