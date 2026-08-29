import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Metric = { label: string; value: string };

export type Profile = {
  id: string;
  full_name: string;
  professional_title: string;
  tagline: string;
  summary: string;
  about_heading: string;
  biography: string;
  short_description: string;
  professional_focus: string;
  location: string;
  current_status: string;
  email: string;
  phone: string;
  profile_image_url: string | null;
  is_active: boolean;
};

export type SkillCategory = {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export type Skill = {
  id: string;
  category_id: string | null;
  name: string;
  level: string | null;
  display_order: number;
  is_active: boolean;
};

export type Education = {
  id: string;
  degree: string;
  field: string | null;
  institution: string;
  location: string | null;
  score: string | null;
  start_year: string | null;
  end_year: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export type Experience = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  employment_type: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean;
  description: string | null;
  responsibilities: string[];
  technologies: string[];
  company_logo_url: string | null;
  company_website: string | null;
  display_order: number;
  is_active: boolean;
};

export type Leadership = {
  id: string;
  title: string;
  organization: string | null;
  role: string | null;
  date_range: string | null;
  description: string | null;
  responsibilities: string[];
  metrics: Metric[];
  impact: string | null;
  recognition: string | null;
  logo_url: string | null;
  display_order: number;
  is_active: boolean;
};

export type Project = {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  status: string | null;
  overview: string | null;
  description: string | null;
  problem: string | null;
  solution: string | null;
  contribution: string | null;
  features: string[];
  technologies: string[];
  metrics: Metric[];
  github_url: string | null;
  live_url: string | null;
  docs_url: string | null;
  cover_image_url: string | null;
  images: string[];
  start_date: string | null;
  end_date: string | null;
  is_featured: boolean;
  is_published: boolean;
  is_active: boolean;
  display_order: number;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string | null;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  file_url: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  metric: string | null;
  description: string | null;
  context: string | null;
  display_order: number;
  is_active: boolean;
};

export type Position = {
  id: string;
  title: string;
  organization: string | null;
  date_range: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
};

export type Resume = {
  id: string;
  label: string;
  file_path: string;
  file_name: string | null;
  is_active: boolean;
  display_order: number;
};

export type SocialLink = {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  display_order: number;
  is_active: boolean;
};

export type SiteSettings = {
  id: string;
  site_title: string;
  meta_title: string;
  meta_description: string;
  favicon_url: string | null;
  og_image_url: string | null;
  accent_color: string;
  default_theme: string;
  footer_text: string;
  contact_email: string;
  copyright: string;
  is_active: boolean;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

async function list<T>(table: string, order = "display_order"): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(order, { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as T[];
}

export const portfolioQuery = queryOptions({
  queryKey: ["portfolio"],
  staleTime: 30_000,
  queryFn: async () => {
    const [
      profiles,
      settings,
      categories,
      skills,
      education,
      experiences,
      leadership,
      projects,
      certifications,
      achievements,
      positions,
      resumes,
      socials,
    ] = await Promise.all([
      list<Profile>("profiles"),
      list<SiteSettings>("site_settings"),
      list<SkillCategory>("skill_categories"),
      list<Skill>("skills"),
      list<Education>("education"),
      list<Experience>("experiences"),
      list<Leadership>("leadership_experiences"),
      list<Project>("projects"),
      list<Certification>("certifications"),
      list<Achievement>("achievements"),
      list<Position>("positions_of_responsibility"),
      list<Resume>("resumes"),
      list<SocialLink>("social_links"),
    ]);

    return {
      profile: profiles[0] ?? null,
      settings: settings[0] ?? null,
      categories,
      skills,
      education,
      experiences,
      leadership,
      projects: projects.filter((p) => p.is_published),
      certifications,
      achievements,
      positions,
      resume: resumes[0] ?? null,
      socials,
    };
  },
});

export type PortfolioData = Awaited<ReturnType<typeof portfolioQuery.queryFn>>;

/** Admin-side: reads every row regardless of visibility (RLS allows admins). */
export function adminListQuery<T>(table: string) {
  return queryOptions({
    queryKey: ["admin", table],
    queryFn: () => list<T>(table),
  });
}

export const adminMessagesQuery = queryOptions({
  queryKey: ["admin", "contact_messages"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as ContactMessage[];
  },
});
