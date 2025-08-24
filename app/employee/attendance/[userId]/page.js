import AttendanceForm from './AttendanceForm';
import { prisma } from '@/lib/prisma';

export default async function page({ params }) {
  const userId = parseInt(params.userId);
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { shift: true },
  });

  if (!user) return <div>User not found</div>;

  return <AttendanceForm userId={user.id} shift={user.shift} />;
}
