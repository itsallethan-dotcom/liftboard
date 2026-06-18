type ModuleIconProps = {
  moduleId: string;
};

export function ModuleIcon({ moduleId }: ModuleIconProps) {
  switch (moduleId) {
    case "infrastructure":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 7h16v10H4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 11h8M8 14h5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "business":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M5 19V9l7-4 7 4v10" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 19v-6h6v6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "leads":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 18V6h16v12" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 14l3-3 3 2 4-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "career":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M6 8h12v11H6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 8V6h6v2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "ai-ops":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M9 12h6M12 9v6" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "liftboard":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M5 18h14M7 14h2M11 10h2M15 14h2" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 6h12v12H6z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
  }
}
