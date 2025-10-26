import { prisma } from "@/_lib/prisma";
import EditForm from "./EditForm";

export default async function Page({ params }) {
  const userId = parseInt(params.id);

  // ambil data paralel
  const [user, shifts, divisions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        divisionId: true,
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
    prisma.division.findMany({
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
  const safeDivisions = JSON.parse(JSON.stringify(divisions));

  return <EditForm user={safeUser} shifts={safeShifts} divisions={safeDivisions} />;
}
