"use client";

import { HudPanel } from "@/components/command/HudPanel";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type ModuleHubShellProps = {
  label: string;
  title: string;
  subtitle?: string;
  onClose?: () => void;
  loading?: boolean;
  error?: string | null;
  children?: ReactNode;
};

export function ModuleHubShell({
  label,
  title,
  subtitle = "Live data · Supabase memory",
  onClose,
  loading,
  error,
  children,
}: ModuleHubShellProps) {
  return (
    <aside className="command-hub-panel" aria-label={`${title} hub`}>
      <HudPanel label={label} title={title} className="command-hub-panel__inner">
        <div className="command-hub-panel__header">
          <p className="command-hub-panel__subtitle">{subtitle}</p>
          {onClose ? (
            <button type="button" className="command-module-detail__close" onClick={onClose}>
              Close
            </button>
          ) : null}
        </div>

        {loading ? (
          <p className="command-hub-panel__status">Loading memory…</p>
        ) : error && !children ? (
          <p className="command-hub-panel__error">{error}</p>
        ) : (
          <div className="command-hub-panel__body">
            {error ? <p className="command-hub-panel__error">{error}</p> : null}
            {children}
          </div>
        )}
      </HudPanel>
    </aside>
  );
}

export function HubSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="command-hub-section">
      <h4 className="command-hub-section__label">{label}</h4>
      {children}
    </section>
  );
}

export function HubMuted({ children }: { children: ReactNode }) {
  return <p className="command-hub-section__muted">{children}</p>;
}

export function HubStats({
  items,
}: {
  items: { label: string; value: string; warn?: boolean }[];
}) {
  return (
    <dl className="command-hub-stats">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd className={item.warn ? "command-hub-stat--warn" : undefined}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function HubListItem({
  title,
  meta,
  badge,
  onClick,
}: {
  title: string;
  meta?: string;
  badge?: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button type="button" className="command-hub-row" onClick={onClick}>
        <span className="command-hub-row__title">{title}</span>
        {meta ? <span className="command-hub-row__meta">{meta}</span> : null}
        {badge ? <span className="command-hub-row__badge">{badge}</span> : null}
      </button>
    );
  }

  return (
    <div className="command-hub-row">
      <span className="command-hub-row__title">{title}</span>
      {meta ? <span className="command-hub-row__meta">{meta}</span> : null}
      {badge ? <span className="command-hub-row__badge">{badge}</span> : null}
    </div>
  );
}

export function HubBtn({
  children,
  onClick,
  primary,
  disabled,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  return (
    <button
      type={type}
      className={`command-hub-btn ${primary ? "command-hub-btn--primary" : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export function HubForm({
  title,
  onSubmit,
  children,
  saving,
  submitLabel,
}: {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  saving?: boolean;
  submitLabel?: string;
}) {
  return (
    <form className="command-hub-form" onSubmit={onSubmit}>
      <p className="command-hub-form__title">{title}</p>
      {children}
      <HubBtn type="submit" primary disabled={saving}>
        {saving ? "Saving…" : (submitLabel ?? "Save")}
      </HubBtn>
    </form>
  );
}

export function HubField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="command-hub-field">
      {label}
      {children}
    </label>
  );
}

export function useHubFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Load failed.");
      setData(json as T);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Load failed.");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, reload: load, setError };
}
