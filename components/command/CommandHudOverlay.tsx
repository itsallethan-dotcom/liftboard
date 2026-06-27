/**
 * Decorative command-center HUD chrome — corner frames, ambient status tags, and
 * edge rails that imply a monitoring system. Purely cosmetic: aria-hidden,
 * pointer-events:none, no application data, no real metrics. Labels are static
 * "system chrome" words only (never numbers/values).
 */
export function CommandHudOverlay() {
  return (
    <div className="command-hud-overlay" aria-hidden>
      <span className="command-hud-frame command-hud-frame--tl" />
      <span className="command-hud-frame command-hud-frame--tr" />
      <span className="command-hud-frame command-hud-frame--bl" />
      <span className="command-hud-frame command-hud-frame--br" />

      <span className="command-hud-tag command-hud-tag--tl">
        <span className="command-hud-dot" />
        SYS ONLINE
      </span>
      <span className="command-hud-tag command-hud-tag--tr">
        CORE LINK ACTIVE
        <span className="command-hud-dot" />
      </span>
      <span className="command-hud-tag command-hud-tag--bl">
        <span className="command-hud-dot" />
        NODE GRID STABLE
      </span>
      <span className="command-hud-tag command-hud-tag--br">
        SIGNAL ROUTING
        <span className="command-hud-dot" />
      </span>

      <span className="command-hud-rail command-hud-rail--l">TELEMETRY STREAM</span>
      <span className="command-hud-rail command-hud-rail--r">REACTOR OUTPUT</span>

      <span className="command-hud-id command-hud-id--top">MOD-RING</span>
      <span className="command-hud-id command-hud-id--bottom">CORE-01</span>

      <span className="command-hud-tick command-hud-tick--tl" />
      <span className="command-hud-tick command-hud-tick--tr" />
      <span className="command-hud-tick command-hud-tick--bl" />
      <span className="command-hud-tick command-hud-tick--br" />

      <span className="command-hud-caution" />
    </div>
  );
}
