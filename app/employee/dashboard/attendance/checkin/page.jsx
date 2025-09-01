import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CheckinForm from "./CheckinForm";

export default async function Page() {
  const user = await getCurrentUser();

  if (!user || user.role !== "EMPLOYEE") {
    return <div>Unauthorized ❌</div>;
  }

  const employee = await prisma.user.findUnique({
    where: { id: user.id },
    include: { shift: true },
  });

  if (!employee?.shift) {
    return <div>Belum ada shift untuk kamu 🚫</div>;
  }

  const shiftStart = employee.shift.startTime.toISOString();
  const shiftEnd = employee.shift.endTime.toISOString();

  return (
    <div>
      <h1>Halo {employee.name}, shift kamu: {employee.shift.type}</h1>
      <p>Shift Start: {new Date(shiftStart).toLocaleTimeString()}</p>
      <p>Shift End: {new Date(shiftEnd).toLocaleTimeString()}</p>

      <CheckinForm
        shiftId={employee.shift.id}
        shiftStart={shiftStart}
        shiftEnd={shiftEnd}
      />
    </div>
  );
}
