import {
  CAREER_MILESTONES_SEED,
  CAREER_PROFILE_SEED,
  CAREER_SKILLS_SEED,
} from "../lib/career/seed-data";

const esc = (s: string) => s.replace(/'/g, "''");

const skillRows = CAREER_SKILLS_SEED.map(
  (s) =>
    `  ('${esc(s.name)}', '${esc(s.category)}', 'proficient', 'resume', ${s.display_order}, ${s.is_featured})`,
).join(",\n");

const milestoneRows = CAREER_MILESTONES_SEED.map(
  (m) =>
    `  ('${esc(m.title)}', ${m.description ? `'${esc(m.description)}'` : "null"}, ${m.project ? `'${esc(m.project)}'` : "null"}, ${m.category ? `'${esc(m.category)}'` : "null"})`,
).join(",\n");

const sql = `-- Auto-generated seed block (from lib/career/seed-data.ts)
insert into public.career_profile (summary, resume_url, "current_role", target_role)
select
  '${esc(CAREER_PROFILE_SEED.summary)}',
  '${esc(CAREER_PROFILE_SEED.resume_url)}',
  '${esc(CAREER_PROFILE_SEED.current_role)}',
  '${esc(CAREER_PROFILE_SEED.target_role)}'
where not exists (select 1 from public.career_profile);

insert into public.career_skills (name, category, proficiency, source, display_order, is_featured)
select v.name, v.category, v.proficiency, v.source, v.display_order, v.is_featured
from (values
${skillRows}
) as v(name, category, proficiency, source, display_order, is_featured)
where not exists (select 1 from public.career_skills limit 1);

insert into public.career_milestones (title, description, project, category)
select v.title, v.description, v.project, v.category
from (values
${milestoneRows}
) as v(title, description, project, category)
where not exists (select 1 from public.career_milestones limit 1);
`;

console.log(sql);
