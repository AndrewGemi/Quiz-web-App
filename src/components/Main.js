import React from "react";

function Main({ children }) {
  return (
    <main className="main-content relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-8 pb-24">
      {children}
    </main>
  );
}

export default Main;
