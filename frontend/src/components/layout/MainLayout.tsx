import { Outlet } from "react-router-dom";
import { TopNav } from "./TopNav";
import { Toaster } from "sonner";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50/50 to-pink-50 dark:from-slate-950 dark:via-purple-950/20 dark:to-slate-950 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      <TopNav />
      <main className="flex-1 relative">
        <Outlet />
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
