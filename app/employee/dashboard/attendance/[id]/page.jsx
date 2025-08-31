import AttendanceForm from "../../../AttendanceForm"

export default function ShiftPage({ params }) {
  const { id } = params

  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-100">
      <AttendanceForm shiftId={Number(id)} />
    </main>
  )
}
