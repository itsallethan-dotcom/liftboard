"use client";

import {
  HubListItem,
  HubMuted,
  HubSection,
  HubStats,
  ModuleHubShell,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import type { BusinessDashboard } from "@/types/forgeonix-os";

type FinancePanelProps = { onClose?: () => void };

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function FinancePanel({ onClose }: FinancePanelProps) {
  // Finance reads from the existing business revenue + offers tables.
  const { data, loading, error } = useHubFetch<BusinessDashboard>("/api/os/business");

  const revenue = data?.revenue ?? [];
  const offers = data?.offers ?? [];
  const received = revenue
    .filter((r) => r.status === "received")
    .reduce((sum, r) => sum + Number(r.amount ?? 0), 0);
  const pending = revenue
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + Number(r.amount ?? 0), 0);
  const currency = revenue[0]?.currency ?? "USD";

  return (
    <ModuleHubShell
      label="// FINANCE"
      title="Revenue & Cashflow"
      subtitle="Revenue · offers · cashflow"
      onClose={onClose}
      loading={loading}
      error={error}
    >
      {data ? (
        <>
          <HubSection label="Overview">
            <HubStats
              items={[
                { label: "Received", value: formatMoney(received, currency) },
                { label: "Pending", value: formatMoney(pending, currency), warn: pending > 0 },
                { label: "Entries", value: String(revenue.length) },
              ]}
            />
          </HubSection>

          <HubSection label="Revenue">
            {revenue.length === 0 ? (
              <HubMuted>No revenue recorded yet.</HubMuted>
            ) : (
              revenue.map((r) => (
                <HubListItem
                  key={r.id}
                  title={r.label}
                  meta={formatMoney(Number(r.amount ?? 0), r.currency)}
                  badge={r.status}
                />
              ))
            )}
          </HubSection>

          <HubSection label="Offers">
            {offers.length === 0 ? (
              <HubMuted>No offers yet.</HubMuted>
            ) : (
              offers.map((o) => (
                <HubListItem
                  key={o.id}
                  title={o.title}
                  meta={o.amount != null ? formatMoney(Number(o.amount), o.currency) : undefined}
                  badge={o.status}
                />
              ))
            )}
          </HubSection>
        </>
      ) : null}
    </ModuleHubShell>
  );
}
