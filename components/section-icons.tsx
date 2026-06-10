type IconProps = {
  className?: string;
};

const defaultClass = "h-6 w-6 text-[#c0c0c0]";

export function IconServer({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="4" width="18" height="6" rx="1" />
      <rect x="3" y="14" width="18" height="6" rx="1" />
      <circle cx="7" cy="7" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="7" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconCloud({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M7 18h10a4 4 0 0 0 .5-8 5.5 5.5 0 0 0-10.6 1.8A3.5 3.5 0 0 0 7 18z" />
    </svg>
  );
}

export function IconNetwork({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="20" cy="6" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
      <circle cx="20" cy="18" r="1.5" />
      <path d="M6 7l4 4M18 7l-4 4M6 17l4-4M18 17l-4-4" />
    </svg>
  );
}

export function IconGear({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export function IconChart({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 16V11M12 16V7M16 16v-4" />
    </svg>
  );
}

export function IconCode({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M8 8L4 12l4 4M16 8l4 4-4 4" />
    </svg>
  );
}

export function IconTool({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 0 0 5.4-5.4l-2.1 2.1-3.3-3.3 2.1-2.1z" />
    </svg>
  );
}

export function IconLayers({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M12 3L3 8l9 5 9-5-9-5z" />
      <path d="M3 12l9 5 9-5M3 16l9 5 9-5" />
    </svg>
  );
}

export function IconCycle({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

export function IconTerminal({ className = defaultClass }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="1.5" />
      <path d="M7 9l3 3-3 3M12 15h5" />
    </svg>
  );
}
