// Header.js
import Logo from "./Logo";

function Header() {
  return (
    <>
      {/* Sticky app bar */}
      <header
        className="fixed inset-x-0 top-0 z-50"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(15,17,21,.6)",
          borderBottom: "1px solid #1d2230",
        }}
      >
        <div className="md:mx-20 w-full max-w-[960px] px-4 sm:px-3 py-3">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
        </div>
      </header>

      {/* Spacer to offset fixed header height */}
      <div style={{ height: "64px" }} />
    </>
  );
}

export default Header;
