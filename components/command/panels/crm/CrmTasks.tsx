"use client";

/** CRM Phase 6 — tasks + follow-ups: create, assign, due date, priority, complete, overdue. */
import { useState } from "react";
import {
  HubBtn,
  HubField,
  HubForm,
  HubListItem,
  HubMuted,
  HubSection,
  useHubFetch,
} from "@/components/command/ModuleHubShell";
import { isOverdue, toDateInput, useCrmSection } from "@/components/command/panels/crm/crm-hooks";
import { crmApi } from "@/lib/crm/client";
import {
  PRIORITY_LEVELS,
  type Client,
  type FollowUp,
  type Lead,
  type PriorityLevel,
  type Task,
} from "@/lib/crm/types";

const PRIORITY_NUM: Record<PriorityLevel, number> = { low: 0, medium: 1, high: 2 };

/** "client:<id>" | "lead:<id>" | "" → { client_id, lead_id } */
function parseAssign(value: string): { client_id: string | null; lead_id: string | null } {
  if (value.startsWith("client:")) return { client_id: value.slice(7), lead_id: null };
  if (value.startsWith("lead:")) return { client_id: null, lead_id: value.slice(5) };
  return { client_id: null, lead_id: null };
}

export function CrmTasks() {
  const tasks = useCrmSection<Task>("tasks");
  const followUps = useCrmSection<FollowUp>("follow-ups");
  const { data: clients } = useHubFetch<Client[]>("/api/crm/clients");
  const { data: leads } = useHubFetch<Lead[]>("/api/crm/leads");

  const nameFor = (clientId: string | null, leadId: string | null): string => {
    if (clientId) return (clients ?? []).find((c) => c.id === clientId)?.name ?? "Client";
    if (leadId) return (leads ?? []).find((l) => l.id === leadId)?.name ?? "Lead";
    return "Unassigned";
  };

  const [task, setTask] = useState({ title: "", assign: "", due_date: "", level: "medium" as PriorityLevel });
  const [fu, setFu] = useState({ title: "", assign: "", due_date: "" });

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    void tasks.run(async () => {
      const a = parseAssign(task.assign);
      await crmApi.create("tasks", {
        title: task.title.trim(),
        client_id: a.client_id,
        lead_id: a.lead_id,
        status: "open",
        priority: PRIORITY_NUM[task.level],
        priority_level: task.level,
        due_date: task.due_date || null,
        notes: null,
      });
      setTask({ title: "", assign: "", due_date: "", level: "medium" });
    });
  };

  const addFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fu.title.trim()) return;
    void followUps.run(async () => {
      const a = parseAssign(fu.assign);
      await crmApi.create("follow-ups", {
        title: fu.title.trim(),
        client_id: a.client_id,
        lead_id: a.lead_id,
        status: "pending",
        due_date: fu.due_date || null,
        notes: null,
        channel: null,
      });
      setFu({ title: "", assign: "", due_date: "" });
    });
  };

  const assignOptions = (
    <>
      <option value="">Unassigned</option>
      {(clients ?? []).map((c) => (
        <option key={`c-${c.id}`} value={`client:${c.id}`}>
          Client · {c.name}
        </option>
      ))}
      {(leads ?? []).map((l) => (
        <option key={`l-${l.id}`} value={`lead:${l.id}`}>
          Lead · {l.name}
        </option>
      ))}
    </>
  );

  if (tasks.loading) return <HubMuted>Loading tasks…</HubMuted>;

  const openTasks = tasks.rows.filter((t) => t.status === "open" || t.status === "in_progress");
  const doneTasks = tasks.rows.filter((t) => t.status === "done");
  const pendingFu = followUps.rows.filter((f) => f.status === "pending");

  return (
    <>
      {tasks.error ? <p className="command-hub-panel__error">{tasks.error}</p> : null}

      <HubSection label={`Open Tasks · ${openTasks.length}`}>
        {openTasks.length === 0 ? <HubMuted>No open tasks.</HubMuted> : null}
        {openTasks.map((t) => {
          const overdue = isOverdue(t.due_date) ;
          return (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <HubListItem
                  title={`${overdue ? "⚠ " : ""}${t.title}`}
                  meta={`${nameFor(t.client_id, t.lead_id)}${t.due_date ? ` · due ${toDateInput(t.due_date)}` : ""}`}
                  badge={t.priority_level}
                />
              </div>
              <HubBtn
                onClick={() => tasks.run(async () => void (await crmApi.update("tasks", t.id, { status: "done" })))}
                disabled={tasks.saving}
              >
                Done
              </HubBtn>
            </div>
          );
        })}
      </HubSection>

      {doneTasks.length > 0 ? (
        <HubSection label={`Completed · ${doneTasks.length}`}>
          {doneTasks.slice(0, 6).map((t) => (
            <HubListItem key={t.id} title={t.title} meta={nameFor(t.client_id, t.lead_id)} badge="done" />
          ))}
        </HubSection>
      ) : null}

      <HubForm title="Add Task" onSubmit={addTask} saving={tasks.saving} submitLabel="Add Task">
        <HubField label="Title">
          <input value={task.title} onChange={(e) => setTask({ ...task, title: e.target.value })} />
        </HubField>
        <HubField label="Assign to">
          <select value={task.assign} onChange={(e) => setTask({ ...task, assign: e.target.value })}>
            {assignOptions}
          </select>
        </HubField>
        <HubField label="Due date">
          <input type="date" value={task.due_date} onChange={(e) => setTask({ ...task, due_date: e.target.value })} />
        </HubField>
        <HubField label="Priority">
          <select
            value={task.level}
            onChange={(e) => setTask({ ...task, level: e.target.value as PriorityLevel })}
          >
            {PRIORITY_LEVELS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </HubField>
      </HubForm>

      <HubSection label={`Follow-ups Due · ${pendingFu.length}`}>
        {pendingFu.length === 0 ? <HubMuted>No pending follow-ups.</HubMuted> : null}
        {pendingFu.map((f) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <HubListItem
                title={`${isOverdue(f.due_date) ? "⚠ " : ""}${f.title}`}
                meta={`${nameFor(f.client_id, f.lead_id)}${f.due_date ? ` · ${toDateInput(f.due_date)}` : ""}`}
              />
            </div>
            <HubBtn
              onClick={() => followUps.run(async () => void (await crmApi.update("follow-ups", f.id, { status: "done" })))}
              disabled={followUps.saving}
            >
              Done
            </HubBtn>
          </div>
        ))}
      </HubSection>

      <HubForm title="Add Follow-up" onSubmit={addFollowUp} saving={followUps.saving} submitLabel="Add Follow-up">
        <HubField label="Title">
          <input value={fu.title} onChange={(e) => setFu({ ...fu, title: e.target.value })} />
        </HubField>
        <HubField label="Assign to">
          <select value={fu.assign} onChange={(e) => setFu({ ...fu, assign: e.target.value })}>
            {assignOptions}
          </select>
        </HubField>
        <HubField label="Due date">
          <input type="date" value={fu.due_date} onChange={(e) => setFu({ ...fu, due_date: e.target.value })} />
        </HubField>
      </HubForm>
    </>
  );
}
