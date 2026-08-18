function Error() {
  return (
    <div className="glass-card p-8 max-w-md mx-auto my-12 text-center flex flex-col items-center justify-center gap-3 rounded-3xl border-rose-300 dark:border-rose-500/40 bg-rose-50/90 dark:bg-rose-950/40 shadow-xl">
      <span className="text-4xl">💥</span>
      <p className="text-lg font-bold text-rose-800 dark:text-rose-200">
        There was an error fetching questions.
      </p>
    </div>
  );
}

export default Error;
