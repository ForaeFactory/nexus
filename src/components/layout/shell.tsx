import { AppSidebar } from "./app-sidebar";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-muted/10">
        <div className="container mx-auto p-6 max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  );
}
