function Footer({ children }) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 anim-slide-up"
      style={{
        paddingBottom: "max(10px, env(safe-area-inset-bottom))",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        background: "rgba(15,17,21,.6)",
        borderTop: "1px solid #1d2230",
      }}
    >
      <div className="mx-auto w-full max-w-[960px] px-4 sm:px-6 py-2">
        <div className="flex justify-end">{children}</div>
      </div>
    </div>
  );
}

export default Footer;
