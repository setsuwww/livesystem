"use server"

import { prisma } from "@/lib/prisma";

export async function deleteOneSchedule(id: number) {
  await prisma.schedule.delete({
    where: { id }
  });
}

export async function deleteManySchedules(ids: number[]) {
  await prisma.schedule.deleteMany({
    where: { id: { in: ids } }
  });
}