export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(222,47%,6%)] via-[hsl(222,47%,8%)] to-[hsl(222,47%,6%)]">
      <div className="w-full max-w-md p-8">
        {children}
      </div>
    </div>
  );
}
