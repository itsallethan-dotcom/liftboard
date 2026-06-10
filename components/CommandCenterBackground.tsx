export function CommandCenterBackground() {
  return (
    <div className="forgeonix-command-bg pointer-events-none fixed inset-0 z-0" aria-hidden>
      <div className="forgeonix-hud-grid" />
      <div className="forgeonix-radial-glow" />
      <div className="forgeonix-scanlines" />
      <div className="forgeonix-vignette" />
    </div>
  );
}
