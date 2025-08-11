interface AuthFormProps {
  children: React.ReactNode
  headers: string
}

export default function AuthForm({ children, headers }: AuthFormProps) {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-2xl border border-zinc-300">
        
        <div className="text-center">
          <h1 className="text-gray-700 text-3xl font-bold mb-2">{headers}</h1>
          <div className="h-[2px] bg-zinc-500 mx-auto rounded-full" style={{ width: `${headers.length * 10}px`, maxWidth: '50%', marginBottom: '12px' }}/>
        </div>

        {children}

      </div>
    </div>
  );
}