export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} Shopbiz. Built for modern commerce.</p>
        <p>Fast checkout • Secure auth • Admin-ready operations</p>
      </div>
    </footer>
  );
}

