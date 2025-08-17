export default function ContentForm({ children }: { children: React.ReactNode }) {

  return (
    <div className="mx-auto bg-white rounded-lg shadow-md">
      <main className="p-6">{children}</main>
    </div>
  );
}
