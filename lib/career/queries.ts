import { requireSupabaseAdminClient } from "@/lib/supabase/admin";
import type {
  AddCareerMilestoneInput,
  AddCareerSkillInput,
  AddJobApplicationInput,
  CareerDashboardData,
  CareerMilestone,
  CareerProfile,
  CareerSkill,
  JobApplication,
  JobApplicationStatus,
  UpdateCareerSkillInput,
  UpdateJobApplicationInput,
} from "@/types/career";
import { JOB_APPLICATION_STATUSES } from "@/types/career";

function db() {
  return requireSupabaseAdminClient();
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function computeStats(applications: JobApplication[]) {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const activeStatuses: JobApplicationStatus[] = [
    "applied",
    "follow_up_due",
    "interview",
    "offer",
  ];

  const totalActive = applications.filter((a) => activeStatuses.includes(a.status)).length;

  const submittedThisWeek = applications.filter((a) => {
    if (!a.applied_date) return false;
    const applied = new Date(a.applied_date);
    return applied >= weekStart && applied <= now;
  }).length;

  const followUpsDue = applications.filter((a) => {
    if (a.status !== "follow_up_due") return false;
    if (!a.follow_up_date) return true;
    return new Date(a.follow_up_date) <= now;
  }).length;

  return { totalActive, submittedThisWeek, followUpsDue };
}

export async function fetchCareerProfile(): Promise<CareerProfile | null> {
  const { data, error } = await db()
    .from("career_profile")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as CareerProfile | null;
}

export async function fetchCareerSkills(): Promise<CareerSkill[]> {
  const { data, error } = await db()
    .from("career_skills")
    .select("*")
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as CareerSkill[];
}

export async function fetchJobApplications(): Promise<JobApplication[]> {
  const { data, error } = await db()
    .from("job_applications")
    .select("*")
    .order("applied_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as JobApplication[];
}

export async function fetchCareerMilestones(): Promise<CareerMilestone[]> {
  const { data, error } = await db()
    .from("career_milestones")
    .select("*")
    .order("milestone_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as CareerMilestone[];
}

export async function fetchCareerDashboard(): Promise<CareerDashboardData> {
  const [profile, skills, applications, milestones] = await Promise.all([
    fetchCareerProfile(),
    fetchCareerSkills(),
    fetchJobApplications(),
    fetchCareerMilestones(),
  ]);

  return {
    profile,
    skills,
    applications,
    milestones,
    stats: computeStats(applications),
  };
}

export async function addCareerSkill(input: AddCareerSkillInput): Promise<CareerSkill> {
  const name = input.name.trim();
  if (!name) throw new Error("Skill name is required.");

  const { data, error } = await db()
    .from("career_skills")
    .insert({
      name,
      category: input.category.trim(),
      proficiency: input.proficiency ?? null,
      source: input.source ?? "jarvis",
      display_order: input.display_order ?? 999,
      is_featured: input.is_featured ?? false,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as CareerSkill;
}

export async function updateCareerSkill(
  id: string,
  input: UpdateCareerSkillInput,
): Promise<CareerSkill> {
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name.trim();
  if (input.category !== undefined) patch.category = input.category.trim();
  if (input.proficiency !== undefined) patch.proficiency = input.proficiency;
  if (input.source !== undefined) patch.source = input.source;
  if (input.display_order !== undefined) patch.display_order = input.display_order;
  if (input.is_featured !== undefined) patch.is_featured = input.is_featured;

  const { data, error } = await db()
    .from("career_skills")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as CareerSkill;
}

export async function addJobApplication(input: AddJobApplicationInput): Promise<JobApplication> {
  const company = input.company_name.trim();
  const role = input.role_title.trim();
  if (!company || !role) throw new Error("Company name and role title are required.");

  const status = input.status ?? "applied";
  if (!JOB_APPLICATION_STATUSES.includes(status)) {
    throw new Error(`Invalid status. Allowed: ${JOB_APPLICATION_STATUSES.join(", ")}`);
  }

  const { data, error } = await db()
    .from("job_applications")
    .insert({
      company_name: company,
      role_title: role,
      source: input.source ?? "manual",
      status,
      applied_date: input.applied_date ?? new Date().toISOString().slice(0, 10),
      follow_up_date: input.follow_up_date ?? null,
      contact_email: input.contact_email ?? null,
      job_url: input.job_url ?? null,
      notes: input.notes ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as JobApplication;
}

export async function updateJobApplication(
  id: string,
  input: UpdateJobApplicationInput,
): Promise<JobApplication> {
  const patch: Record<string, unknown> = {};
  if (input.company_name !== undefined) patch.company_name = input.company_name.trim();
  if (input.role_title !== undefined) patch.role_title = input.role_title.trim();
  if (input.source !== undefined) patch.source = input.source;
  if (input.status !== undefined) {
    if (!JOB_APPLICATION_STATUSES.includes(input.status)) {
      throw new Error(`Invalid status. Allowed: ${JOB_APPLICATION_STATUSES.join(", ")}`);
    }
    patch.status = input.status;
  }
  if (input.applied_date !== undefined) patch.applied_date = input.applied_date;
  if (input.follow_up_date !== undefined) patch.follow_up_date = input.follow_up_date;
  if (input.contact_email !== undefined) patch.contact_email = input.contact_email;
  if (input.job_url !== undefined) patch.job_url = input.job_url;
  if (input.notes !== undefined) patch.notes = input.notes;

  const { data, error } = await db()
    .from("job_applications")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as JobApplication;
}

export async function addCareerMilestone(input: AddCareerMilestoneInput): Promise<CareerMilestone> {
  const title = input.title.trim();
  if (!title) throw new Error("Milestone title is required.");

  const { data, error } = await db()
    .from("career_milestones")
    .insert({
      title,
      description: input.description ?? null,
      project: input.project ?? null,
      milestone_date: input.milestone_date ?? null,
      category: input.category ?? null,
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as CareerMilestone;
}

/** Find application by company name (case-insensitive) for Jarvis status updates. */
export async function findJobApplicationByCompany(
  companyName: string,
): Promise<JobApplication | null> {
  const { data, error } = await db()
    .from("job_applications")
    .select("*")
    .ilike("company_name", companyName.trim())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as JobApplication | null;
}
