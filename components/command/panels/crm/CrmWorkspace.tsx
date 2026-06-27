"use client";

/**
 * CRM workspace (Phases 3–7) — the working Forgeonix Business module.
 * Sub-tabs over the source-agnostic /api/crm layer, rendered with the frozen V1
 * hub toolkit (no new visual direction).
 */
import { useState } from "react";
import { CrmDashboard } from "@/components/command/panels/CrmDashboard";
import { CrmClients } from "@/components/command/panels/crm/CrmClients";
import { CrmLeads } from "@/components/command/panels/crm/CrmLeads";
import { CrmRevenue } from "@/components/command/panels/crm/CrmRevenue";
import { CrmTasks } from "@/components/command/panels/crm/CrmTasks";

const SUBTABS = ["Overview", "Clients", "Leads", "Tasks", "Revenue"] as const;
type SubTab = (typeof SUBTABS)[number];

const ACCENT = "#ff7a36";

export function CrmWorkspace() {
  const [sub, setSub] = useState<SubTab>("Overview");

  return (
    <>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "0 0 8px" }}>
        {SUBTABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setSub(t)}
            style={{
              background: sub === t ? "rgba(255,122,54,0.15)" : "rgba(8,14,20,0.7)",
              border: "1px solid rgba(255,122,54,0.2)",
              borderRadius: 3,
              color: sub === t ? ACCENT : "#cfeff5",
              cursor: "pointer",
              font: "11px ui-monospace, monospace",
              padding: "5px 9px",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {sub === "Overview" ? <CrmDashboard /> : null}
      {sub === "Clients" ? <CrmClients /> : null}
      {sub === "Leads" ? <CrmLeads /> : null}
      {sub === "Tasks" ? <CrmTasks /> : null}
      {sub === "Revenue" ? <CrmRevenue /> : null}
    </>
  );
}
