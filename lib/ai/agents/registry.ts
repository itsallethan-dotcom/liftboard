import type { AiAgentKey } from "@/types/ai";
import { getSystemPrompt } from "@/lib/ai/prompts";

export type AiAgentDefinition = {
  key: AiAgentKey;
  label: string;
  description: string;
  enabled: boolean;
  getSystemPrompt: () => string;
};

/**
 * Agent registry — extend here when enabling specialized agents.
 * Only `default` is active in Phase 1–4.
 */
export const AI_AGENT_REGISTRY: Record<AiAgentKey, AiAgentDefinition> = {
  default: {
    key: "default",
    label: "Forgeonix AI",
    description: "General operations co-pilot",
    enabled: true,
    getSystemPrompt: () => getSystemPrompt("default"),
  },
  note: {
    key: "note",
    label: "Note Agent",
    description: "Notes and knowledge capture (coming soon)",
    enabled: false,
    getSystemPrompt: () => getSystemPrompt("note"),
  },
  lead: {
    key: "lead",
    label: "Lead Agent",
    description: "Lead gen and outreach (coming soon)",
    enabled: false,
    getSystemPrompt: () => getSystemPrompt("lead"),
  },
  project: {
    key: "project",
    label: "Project Agent",
    description: "Project delivery planning (coming soon)",
    enabled: false,
    getSystemPrompt: () => getSystemPrompt("project"),
  },
  content: {
    key: "content",
    label: "Content Agent",
    description: "Content and publishing (coming soon)",
    enabled: false,
    getSystemPrompt: () => getSystemPrompt("content"),
  },
  infrastructure: {
    key: "infrastructure",
    label: "Infrastructure Agent",
    description: "Homelab and infra ops (coming soon)",
    enabled: false,
    getSystemPrompt: () => getSystemPrompt("infrastructure"),
  },
};

export function resolveAgent(agentKey?: AiAgentKey): AiAgentDefinition {
  const key = agentKey ?? "default";
  const agent = AI_AGENT_REGISTRY[key];
  if (!agent.enabled && key !== "default") {
    return AI_AGENT_REGISTRY.default;
  }
  return agent;
}
