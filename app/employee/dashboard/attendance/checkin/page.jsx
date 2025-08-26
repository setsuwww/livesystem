import { getCurrentUser } from "@/lib/auth";
import CheckinButton from "./CheckinForm";

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

  return (
    <div>
      <h1>Halo {employee.name}, shift kamu: {employee.shift.type}</h1>
      <p>
        {employee.shift.startTime.toLocaleTimeString()} -{" "}
        {employee.shift.endTime.toLocaleTimeString()}
      </p>
      <CheckinButton shiftId={employee.shift.id} />
    </div>
  );
}

