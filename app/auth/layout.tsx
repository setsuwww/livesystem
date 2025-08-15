import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lintasarta",
};

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="antialiased bg-radial-[at_50%_75%] from-sky-300 via-sky-100 to-sky-50">
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </main>
  );
}
