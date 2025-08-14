function Main({ children }) {
  return (
    <main
      className="main w-full max-w-[960px] mx-auto px-4 sm:px-6 pb-24 anim-fade-in"
      // pb-24 ensures space for the sticky Footer
    >
      {children}
    </main>
  );
}

export default Main;
