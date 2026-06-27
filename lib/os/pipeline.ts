// Pure lead→client pipeline builder — no server imports, safe for client components.
import {
  PIPELINE_STAGES,
  type BusinessClient,
  type BusinessDashboard,
  type Lead,
  type PipelineCard,
  type PipelineColumn,
  type PipelineStageKey,
} from "@/types/forgeonix-os";

const STAGE_LABELS: Record<PipelineStageKey, string> = {
  lead: "Lead",
  contacted: "Contacted",
  proposal: "Proposal Sent",
  client: "Client",
  project_work: "Project Work",
  revenue: "Revenue",
  review: "Review",
  archived: "Archived",
};

/** Map a lead's status to a pipeline column (or null to exclude from the board). */
function leadStage(lead: Lead): PipelineStageKey | null {
  switch (lead.status) {
    case "new":
      return "lead";
    case "contacted":
    case "qualified":
      return "contacted";
    case "proposal":
      return "proposal";
    case "lost":
    case "archived":
      return "archived";
    case "won":
      return null; // represented as its converted client
    default:
      return null;
  }
}

/** Map a client's lifecycle stage to a pipeline column. */
function clientStage(client: BusinessClient): PipelineStageKey {
  switch (client.stage) {
    case "project_work":
      return "project_work";
    case "revenue":
      return "revenue";
    case "review":
      return "review";
    case "archived":
      return "archived";
    case "active":
    default:
      return "client";
  }
}

export function buildPipeline(
  data: Pick<BusinessDashboard, "leads" | "clients">,
): PipelineColumn[] {
  const columns: Record<PipelineStageKey, PipelineCard[]> = {
    lead: [],
    contacted: [],
    proposal: [],
    client: [],
    project_work: [],
    revenue: [],
    review: [],
    archived: [],
  };

  for (const lead of data.leads) {
    const stage = leadStage(lead);
    if (!stage) continue;
    columns[stage].push({
      id: lead.id,
      kind: "lead",
      title: lead.company ?? lead.name,
      subtitle: lead.company ? lead.name : (lead.email ?? null),
      stage,
      value: lead.estimated_value,
      status: lead.status,
    });
  }

  for (const client of data.clients) {
    const stage = clientStage(client);
    columns[stage].push({
      id: client.id,
      kind: "client",
      title: client.company ?? client.name,
      subtitle: client.company ? client.name : (client.email ?? null),
      stage,
      value: null,
      status: client.status,
    });
  }

  return PIPELINE_STAGES.map((key) => ({
    key,
    label: STAGE_LABELS[key],
    cards: columns[key],
  }));
}
