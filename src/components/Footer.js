function Footer({ children }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 anim-slide-up backdrop-blur-md bg-white/80 dark:bg-[#0f1115]/60 border-t border-slate-200/80 dark:border-[#1d2230] transition-colors"
      style={{
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 py-2">
        <div className="flex justify-end">{children}</div>
      </div>
    </div>
  );
}

export default Footer;
