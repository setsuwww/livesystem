import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

export default async function Page({ params }) {
  const userId = parseInt(params.id);

  // ambil data paralel
  const [user, shifts, offices] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        officeId: true,
        shiftId: true,
      },
    }),
    prisma.shift.findMany({
      select: {
        id: true,
        name: true,
        startTime: true,
        endTime: true,
      },
    }),
    prisma.office.findMany({
      select: {
        id: true,
        name: true,
        startTime: true,
        endTime: true,
        shifts: {
          select: {
            id: true,
            name: true,
            startTime: true,
            endTime: true,
          },
        },
      },
    }),
  ]);

  // kalau user gak ketemu, bisa balikin 404 (opsional)
  if (!user) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-500">User not found</h1>
      </div>
    );
  }

  // FIX: serialize semua data biar aman dikirim ke client component
  const safeUser = JSON.parse(JSON.stringify(user));
  const safeShifts = JSON.parse(JSON.stringify(shifts));
  const safeOffices = JSON.parse(JSON.stringify(offices));

  return <EditForm user={safeUser} shifts={safeShifts} offices={safeOffices} />;
}
