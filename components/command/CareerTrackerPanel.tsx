"use client";

import { HudPanel } from "@/components/command/HudPanel";
import type {
  CareerDashboardData,
  CareerSkill,
  JobApplication,
  JobApplicationStatus,
} from "@/types/career";
import { JOB_APPLICATION_STATUSES } from "@/types/career";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const STATUS_LABEL: Record<JobApplicationStatus, string> = {
  applied: "Applied",
  follow_up_due: "Follow-up due",
  interview: "Interview",
  rejected: "Rejected",
  offer: "Offer",
  archived: "Archived",
};

type CareerTrackerPanelProps = {
  onClose?: () => void;
};

type ApplicationFormState = {
  company_name: string;
  role_title: string;
  source: string;
  status: JobApplicationStatus;
  applied_date: string;
  follow_up_date: string;
  contact_email: string;
  job_url: string;
  notes: string;
};

const EMPTY_FORM: ApplicationFormState = {
  company_name: "",
  role_title: "",
  source: "manual",
  status: "applied",
  applied_date: new Date().toISOString().slice(0, 10),
  follow_up_date: "",
  contact_email: "",
  job_url: "",
  notes: "",
};

function groupFeaturedSkills(skills: CareerSkill[]) {
  const featured = skills.filter((s) => s.is_featured);
  const byCategory = new Map<string, CareerSkill[]>();

  for (const skill of featured) {
    const list = byCategory.get(skill.category) ?? [];
    list.push(skill);
    byCategory.set(skill.category, list);
  }

  return [...byCategory.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function CareerTrackerPanel({ onClose }: CareerTrackerPanelProps) {
  const [data, setData] = useState<CareerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ApplicationFormState>(EMPTY_FORM);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/career");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load career data.");
      setData(json as CareerDashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load career data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const skillGroups = useMemo(
    () => (data ? groupFeaturedSkills(data.skills) : []),
    [data],
  );

  const recentApplications = useMemo(
    () => (data ? data.applications.slice(0, 5) : []),
    [data],
  );

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, applied_date: new Date().toISOString().slice(0, 10) });
    setFormOpen(true);
  };

  const openEditForm = (app: JobApplication) => {
    setEditingId(app.id);
    setForm({
      company_name: app.company_name,
      role_title: app.role_title,
      source: app.source ?? "manual",
      status: app.status,
      applied_date: app.applied_date ?? "",
      follow_up_date: app.follow_up_date ?? "",
      contact_email: app.contact_email ?? "",
      job_url: app.job_url ?? "",
      notes: app.notes ?? "",
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      follow_up_date: form.follow_up_date || null,
      contact_email: form.contact_email || null,
      job_url: form.job_url || null,
      notes: form.notes || null,
    };

    try {
      const url = editingId ? `/api/career/applications/${editingId}` : "/api/career/applications";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed.");
      setFormOpen(false);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside className="command-hub-panel command-career-panel" aria-label="Career Tracker hub">
      <HudPanel label="// CAREER TRACKER" title="Career Hub" className="command-hub-panel__inner command-career-panel__inner">
        <div className="command-hub-panel__header command-career-panel__header">
          <p className="command-hub-panel__subtitle command-career-panel__subtitle">Live data · Supabase memory</p>
          {onClose ? (
            <button type="button" className="command-module-detail__close" onClick={onClose}>
              Close
            </button>
          ) : null}
        </div>

        {loading ? (
          <p className="command-hub-panel__status command-career-panel__status">Loading career memory…</p>
        ) : error && !data ? (
          <p className="command-hub-panel__error command-career-panel__error">{error}</p>
        ) : data ? (
          <div className="command-hub-panel__body command-career-panel__body">
            {error ? <p className="command-hub-panel__error command-career-panel__error">{error}</p> : null}

            <section className="command-career-section">
              <h4 className="command-career-section__label">Resume Overview</h4>
              <dl className="command-career-kv">
                <div>
                  <dt>Current</dt>
                  <dd>{data.profile?.current_role ?? "—"}</dd>
                </div>
                <div>
                  <dt>Target</dt>
                  <dd>{data.profile?.target_role ?? "—"}</dd>
                </div>
              </dl>
              {data.profile?.summary ? (
                <p className="command-career-section__text">{data.profile.summary}</p>
              ) : null}
              {data.profile?.resume_url ? (
                <Link href={data.profile.resume_url} className="command-career-link" download>
                  Download resume ↓
                </Link>
              ) : null}
            </section>

            <section className="command-career-section">
              <h4 className="command-career-section__label">Skills · Featured</h4>
              {skillGroups.length === 0 ? (
                <p className="command-career-section__muted">No featured skills in database.</p>
              ) : (
                skillGroups.map(([category, skills]) => (
                  <div key={category} className="command-career-skill-group">
                    <p className="command-career-skill-group__title">{category}</p>
                    <ul className="command-career-skill-list">
                      {skills.map((skill) => (
                        <li key={skill.id}>{skill.name}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </section>

            <section className="command-career-section">
              <h4 className="command-career-section__label">Applications</h4>
              <dl className="command-career-stats">
                <div>
                  <dt>Active</dt>
                  <dd>{data.stats.totalActive}</dd>
                </div>
                <div>
                  <dt>This week</dt>
                  <dd>{data.stats.submittedThisWeek}</dd>
                </div>
                <div>
                  <dt>Follow-ups</dt>
                  <dd className={data.stats.followUpsDue > 0 ? "command-career-stat--warn" : undefined}>
                    {data.stats.followUpsDue}
                  </dd>
                </div>
              </dl>

              <div className="command-career-apps">
                {recentApplications.length === 0 ? (
                  <p className="command-career-section__muted">No applications tracked yet.</p>
                ) : (
                  recentApplications.map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      className="command-career-app-row"
                      onClick={() => openEditForm(app)}
                    >
                      <span className="command-career-app-row__company">{app.company_name}</span>
                      <span className="command-career-app-row__role">{app.role_title}</span>
                      <span className={`command-career-app-row__status command-career-app-row__status--${app.status}`}>
                        {STATUS_LABEL[app.status]}
                      </span>
                      <span className="command-career-app-row__date">{formatDate(app.applied_date)}</span>
                    </button>
                  ))
                )}
              </div>

              <button
                type="button"
                className="command-career-btn"
                onClick={formOpen && !editingId ? () => setFormOpen(false) : openCreateForm}
              >
                {formOpen && !editingId ? "Cancel" : "+ Add application"}
              </button>

              {formOpen ? (
                <form className="command-career-form" onSubmit={handleSubmit}>
                  <p className="command-career-form__title">
                    {editingId ? "Edit application" : "New application"}
                  </p>
                  <label>
                    Company
                    <input
                      required
                      value={form.company_name}
                      onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
                    />
                  </label>
                  <label>
                    Role
                    <input
                      required
                      value={form.role_title}
                      onChange={(e) => setForm((f) => ({ ...f, role_title: e.target.value }))}
                    />
                  </label>
                  <label>
                    Status
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, status: e.target.value as JobApplicationStatus }))
                      }
                    >
                      {JOB_APPLICATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Applied
                    <input
                      type="date"
                      value={form.applied_date}
                      onChange={(e) => setForm((f) => ({ ...f, applied_date: e.target.value }))}
                    />
                  </label>
                  <label>
                    Follow-up
                    <input
                      type="date"
                      value={form.follow_up_date}
                      onChange={(e) => setForm((f) => ({ ...f, follow_up_date: e.target.value }))}
                    />
                  </label>
                  <label>
                    Source
                    <input
                      value={form.source}
                      onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                    />
                  </label>
                  <label>
                    Contact email
                    <input
                      type="email"
                      value={form.contact_email}
                      onChange={(e) => setForm((f) => ({ ...f, contact_email: e.target.value }))}
                    />
                  </label>
                  <label>
                    Job URL
                    <input
                      value={form.job_url}
                      onChange={(e) => setForm((f) => ({ ...f, job_url: e.target.value }))}
                    />
                  </label>
                  <label>
                    Notes
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    />
                  </label>
                  <button type="submit" className="command-career-btn command-career-btn--primary" disabled={saving}>
                    {saving ? "Saving…" : editingId ? "Update" : "Save"}
                  </button>
                </form>
              ) : null}
            </section>

            <section className="command-career-section">
              <h4 className="command-career-section__label">Milestones</h4>
              <ul className="command-career-milestones">
                {data.milestones.slice(0, 6).map((m) => (
                  <li key={m.id}>
                    <p className="command-career-milestone__title">{m.title}</p>
                    {m.project ? (
                      <p className="command-career-milestone__meta">{m.project}</p>
                    ) : null}
                    {m.description ? (
                      <p className="command-career-milestone__desc">{m.description}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : null}
      </HudPanel>
    </aside>
  );
}
