export const JOB_APPLICATION_STATUSES = [
  "applied",
  "follow_up_due",
  "interview",
  "rejected",
  "offer",
  "archived",
] as const;

export type JobApplicationStatus = (typeof JOB_APPLICATION_STATUSES)[number];

export type CareerProfile = {
  id: string;
  summary: string | null;
  resume_url: string | null;
  current_role: string | null;
  target_role: string | null;
  created_at: string;
  updated_at: string;
};

export type CareerSkill = {
  id: string;
  name: string;
  category: string;
  proficiency: string | null;
  source: string | null;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type JobApplication = {
  id: string;
  company_name: string;
  role_title: string;
  source: string | null;
  status: JobApplicationStatus;
  applied_date: string | null;
  follow_up_date: string | null;
  contact_email: string | null;
  job_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CareerMilestone = {
  id: string;
  title: string;
  description: string | null;
  project: string | null;
  milestone_date: string | null;
  category: string | null;
  created_at: string;
  updated_at: string;
};

export type CareerApplicationStats = {
  totalActive: number;
  submittedThisWeek: number;
  followUpsDue: number;
};

export type CareerDashboardData = {
  profile: CareerProfile | null;
  skills: CareerSkill[];
  applications: JobApplication[];
  milestones: CareerMilestone[];
  stats: CareerApplicationStats;
};

export type AddCareerSkillInput = {
  name: string;
  category: string;
  proficiency?: string | null;
  source?: string | null;
  display_order?: number;
  is_featured?: boolean;
};

export type UpdateCareerSkillInput = Partial<AddCareerSkillInput>;

export type AddJobApplicationInput = {
  company_name: string;
  role_title: string;
  source?: string | null;
  status?: JobApplicationStatus;
  applied_date?: string | null;
  follow_up_date?: string | null;
  contact_email?: string | null;
  job_url?: string | null;
  notes?: string | null;
};

export type UpdateJobApplicationInput = Partial<AddJobApplicationInput>;

export type AddCareerMilestoneInput = {
  title: string;
  description?: string | null;
  project?: string | null;
  milestone_date?: string | null;
  category?: string | null;
};

export type DetectedJobApplicationEmail = {
  companyName: string | null;
  roleTitle: string | null;
  applicationDate: string | null;
  senderEmail: string | null;
  subject: string | null;
  matchedPhrase: string | null;
  isJobApplication: boolean;
};
