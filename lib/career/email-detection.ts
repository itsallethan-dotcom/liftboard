import type { DetectedJobApplicationEmail } from "@/types/career";

/** Phrases that indicate a job application confirmation email. */
export const JOB_APPLICATION_EMAIL_PHRASES = [
  "thank you for applying",
  "thanks for submitting your application",
  "we received your application",
  "your application has been submitted",
  "application received",
] as const;

export type JobApplicationEmailInput = {
  subject: string;
  body: string;
  senderEmail: string;
  receivedAt?: string;
};

/**
 * Placeholder: detects job application confirmation emails.
 *
 * Future Gmail integration point:
 * - Wire this from a Supabase Edge Function or Next.js cron route
 * - Use Gmail API push notifications or periodic inbox sync
 * - On match, call addJobApplication() from lib/career/queries.ts
 */
export function detectJobApplicationEmail(
  email: JobApplicationEmailInput,
): DetectedJobApplicationEmail {
  const haystack = `${email.subject}\n${email.body}`.toLowerCase();
  const matchedPhrase =
    JOB_APPLICATION_EMAIL_PHRASES.find((phrase) => haystack.includes(phrase)) ?? null;

  if (!matchedPhrase) {
    return {
      isJobApplication: false,
      companyName: null,
      roleTitle: null,
      applicationDate: null,
      senderEmail: email.senderEmail,
      subject: email.subject,
      matchedPhrase: null,
    };
  }

  const companyName = extractCompanyFromSender(email.senderEmail, email.subject);
  const roleTitle = extractRoleFromSubject(email.subject);
  const applicationDate = email.receivedAt ?? new Date().toISOString().slice(0, 10);

  return {
    isJobApplication: true,
    companyName,
    roleTitle,
    applicationDate,
    senderEmail: email.senderEmail,
    subject: email.subject,
    matchedPhrase,
  };
}

function extractCompanyFromSender(senderEmail: string, subject: string): string | null {
  const domain = senderEmail.split("@")[1]?.split(".")[0];
  if (domain && domain !== "gmail" && domain !== "outlook") {
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  }

  const atMatch = subject.match(/at\s+([A-Z][A-Za-z0-9&.\s]+?)(?:\s+[-–]|$)/);
  return atMatch?.[1]?.trim() ?? null;
}

function extractRoleFromSubject(subject: string): string | null {
  const roleMatch = subject.match(/(?:for|position|role)[:\s]+(.+?)(?:\s+[-–]|$)/i);
  if (roleMatch?.[1]) return roleMatch[1].trim();

  const atMatch = subject.match(/^(.+?)\s+at\s+/i);
  return atMatch?.[1]?.trim() ?? null;
}

/**
 * Future Gmail integration stub.
 * Implement OAuth + Gmail API watch/sync here when ready.
 */
export async function syncGmailJobApplications(): Promise<{ processed: number; added: number }> {
  return { processed: 0, added: 0 };
}
