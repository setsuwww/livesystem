export default function ContentForm({ children }: { children: React.ReactNode }) {

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md">
      <main>{children}</main>
    </div>
  );
}
