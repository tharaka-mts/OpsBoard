import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ShieldCheck, Zap } from "lucide-react";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center pt-32 pb-16 px-4 relative overflow-hidden">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-purple-200/40 via-purple-100/20 to-transparent dark:from-purple-900/20 -z-10 rounded-full blur-3xl opacity-60 pointer-events-none"></div>
      
      <div className="text-center max-w-4xl space-y-8 relative z-10">
        <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-800 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-300 mb-2 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-purple-600 mr-2 animate-pulse"></span>
          OpsBoard v1.0 is now live
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl mt-4 leading-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 inline-block pb-2">
            Streamline Your Operations
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300 mt-6 max-w-2xl mx-auto leading-relaxed">
          OpsBoard provides a clean, modern interface to track work items, manage priorities, and keep your entire team aligned. Build for speed and scale.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 mt-6">
          <Button asChild size="lg" className="rounded-full h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-purple-500/20 transition-all hover:shadow-purple-500/40 hover:-translate-y-0.5 text-base font-semibold">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          <Button variant="outline" size="lg" className="rounded-full h-14 px-8 border-purple-200 hover:bg-purple-50 text-purple-700 dark:border-purple-800 dark:hover:bg-purple-900/50 dark:text-purple-300 transition-all text-base font-semibold bg-white/50 backdrop-blur-sm dark:bg-slate-900/50 shadow-sm">
            Documentation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 max-w-6xl w-full relative z-10 px-4">
        <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-purple-100/80 dark:border-purple-800/50 group overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-full blur-3xl -z-10 group-hover:bg-indigo-200/50 transition-colors"></div>
          <CardHeader>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">Real-time Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Monitor the status of all your operational tasks instantly. Never lose sight of blocked items.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-purple-100/80 dark:border-purple-800/50 group overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-purple-100/50 dark:bg-purple-900/20 rounded-full blur-3xl -z-10 group-hover:bg-purple-200/50 transition-colors"></div>
          <CardHeader>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center mb-4 shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">Fast Workflows</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Built with performance in mind. Quick entry forms and instant updates keep your team moving fast.
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg border border-purple-100/80 dark:border-purple-800/50 group overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-pink-100/50 dark:bg-pink-900/20 rounded-full blur-3xl -z-10 group-hover:bg-pink-200/50 transition-colors"></div>
          <CardHeader>
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30 group-hover:scale-110 transition-transform duration-300">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <CardTitle className="text-xl font-bold">Secure & Reliable</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              Enterprise-grade structure ready to integrate securely with your backend infrastructure.
            </p>
          </CardContent>
        </Card>
      </div>

      <footer className="mt-32 text-center text-sm font-medium text-slate-500 border-t border-purple-100 dark:border-purple-900/50 pt-8 w-full max-w-5xl">
        &copy; {new Date().getFullYear()} OpsBoard Inc. All rights reserved. Built with precision.
      </footer>
    </div>
  );
}
