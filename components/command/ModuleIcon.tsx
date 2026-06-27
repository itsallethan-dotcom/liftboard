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
    case "projects":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 7h6l2 2h8v9H4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      );
    case "finance":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 8v8M9.5 9.5h3.5a1.5 1.5 0 010 3H10a1.5 1.5 0 000 3h4" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </svg>
      );
    case "automations":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <circle cx="6" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="6" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="18" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 12h4l4-5M12 12l4 5" stroke="currentColor" strokeWidth="1.3" fill="none" />
        </svg>
      );
    case "health":
      return (
        <svg className="command-module__icon" viewBox="0 0 24 24" aria-hidden>
          <path d="M4 13h4l2-5 3 9 2-4h5" fill="none" stroke="currentColor" strokeWidth="1.5" />
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
    case "ai-memory":
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
