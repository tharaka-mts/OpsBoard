import { Link } from "react-router-dom";
import { ServerCog } from "lucide-react";

export function TopNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-100/60 dark:border-purple-900/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/40 shadow-sm">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 font-bold tracking-tight hover:opacity-80 transition-opacity">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 shadow-md shadow-indigo-500/20">
            <ServerCog className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-purple-700 dark:from-indigo-400 dark:to-purple-400 ml-1">
            OpsBoard
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-semibold">
            <Link to="/dashboard" className="transition-all hover:text-purple-600 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-full hover:bg-purple-100/50 dark:hover:bg-purple-900/30">
              Dashboard
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
