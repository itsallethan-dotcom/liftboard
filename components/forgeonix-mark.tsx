import Image from "next/image";

/** Commissioned mark with alpha — no substitute geometry. */
export const FORGEONIX_LOGO_TRANSPARENT = "/forgeonix-logo-transparent.png";

type MarkProps = {
  className?: string;
};

/**
 * Hero mark: transparent PNG only — no square frame, no plate behind the art.
 * Glow / sweep are separate layers (see `fn-hero-mark*` in globals.css).
 */
export function ForgeonixHeroMark({ className }: MarkProps) {
  return (
    <div
      className={`fn-hero-mark ${className ?? ""}`}
      role="img"
      aria-label="Forgeonix"
    >
      <div className="fn-hero-mark__glow" aria-hidden />
      <div className="fn-hero-mark__float">
        <div className="fn-hero-mark__mask-wrap">
          <Image
            src={FORGEONIX_LOGO_TRANSPARENT}
            alt=""
            width={1024}
            height={1024}
            priority
            className="fn-hero-mark__img bg-transparent"
            sizes="(max-width: 640px) 88vw, 480px"
          />
          {/* Sheen mask URL must match FORGEONIX_LOGO_TRANSPARENT in this file. */}
          <div className="fn-hero-mark__shine" aria-hidden />
        </div>
      </div>
    </div>
  );
}

/** Nav mark: same asset, intrinsic width — not a square box. */
export function ForgeonixNavMark({ className }: MarkProps) {
  return (
    <span
      className={`fn-nav-mark inline-flex shrink-0 items-center ${className ?? ""}`}
      role="img"
      aria-label="Forgeonix"
    >
      <Image
        src={FORGEONIX_LOGO_TRANSPARENT}
        alt=""
        width={512}
        height={512}
        className="fn-nav-mark__img w-auto bg-transparent"
        sizes="120px"
      />
    </span>
  );
}
