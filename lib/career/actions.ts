/**
 * Career database action layer — callable by Jarvis commands and API routes.
 * All writes go through Supabase service role (server-side only).
 */

export {
  addCareerSkill,
  updateCareerSkill,
  addJobApplication,
  updateJobApplication,
  addCareerMilestone,
  findJobApplicationByCompany,
} from "@/lib/career/queries";

export { detectJobApplicationEmail, syncGmailJobApplications } from "@/lib/career/email-detection";
