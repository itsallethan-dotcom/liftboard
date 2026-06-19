/**
 * Forgeonix OS write layer — callable by future Jarvis/agents and API routes.
 * Dashboard reads via lib/os/*.ts and lib/career/queries.ts.
 */

export {
  addInfrastructureService,
  updateInfrastructureServiceStatus,
} from "@/lib/os/infrastructure";

export { addLead, updateLead, findLeadByCompany } from "@/lib/os/leads";

export { addBusinessClient, addBusinessTask, updateBusinessTask } from "@/lib/os/business";

export { addOsProject, updateOsProject } from "@/lib/os/projects";

export { addOsNote, updateOsNote } from "@/lib/os/notes";

export { addOsRecord, updateOsRecord } from "@/lib/os/records";

export {
  addCareerSkill,
  updateCareerSkill,
  addJobApplication,
  updateJobApplication,
  addCareerMilestone,
  findJobApplicationByCompany,
} from "@/lib/career/queries";

export { detectJobApplicationEmail, syncGmailJobApplications } from "@/lib/career/email-detection";
