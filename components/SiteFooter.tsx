export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#10121a]/80 px-6 py-10 backdrop-blur-sm">
      {/* Brand spine hairline */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff7a36]/35 to-transparent"
        aria-hidden
      />
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-[#a0a0a0] sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#ff7a36] shadow-[0_0_8px_rgba(255,122,54,0.6)]" aria-hidden />
          <p className="tracking-wide">
            <span className="font-semibold tracking-[0.18em] text-[#d8dde6] uppercase">Forgeonix</span>
            <span className="mx-2 text-white/20">·</span>
            <span>© 2026</span>
          </p>
        </div>
        <a
          href="mailto:ethan@forgeonix.dev"
          className="forgeonix-footer-email font-mono text-[#9aa0aa] transition-colors"
        >
          ethan@forgeonix.dev
        </a>
      </div>
    </footer>
  );
}
