export default function Loader() {
  return (
    <div className="glass-card p-10 max-w-sm mx-auto my-12 text-center flex flex-col items-center justify-center gap-4 rounded-3xl border-purple-200 dark:border-purple-500/30 bg-white/90 dark:bg-card shadow-xl">
      <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(139,92,246,0.5)]" />
      <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
        Loading questions...
      </p>
    </div>
  );
}
