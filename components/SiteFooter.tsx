export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#1a1a1a]/80 px-6 py-8 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-2 text-sm text-[#a0a0a0] sm:flex-row">
        <p>Forgeonix © 2026</p>
        <a
          href="mailto:ethan@forgeonix.dev"
          className="forgeonix-footer-email transition-colors"
        >
          ethan@forgeonix.dev
        </a>
      </div>
    </footer>
  );
}
