import { useMemo, useState } from "react";
import { ArrowUpRight, Check, FileText, Loader2, Mail, Phone } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMediaUrl } from "@/lib/media";
import type { PortfolioData, Project } from "@/lib/portfolio";
import { Reveal, Section, SectionHeader } from "./primitives";
import { ProjectDetail } from "./ProjectDetail";

/* ------------------------------ About ------------------------------ */

export function About({ data }: { data: PortfolioData }) {
  const profile = data.profile;
  if (!profile) return null;

  const facts = [
    { label: "Focus", value: profile.professional_focus },
    { label: "Location", value: profile.location },
    { label: "Status", value: profile.current_status },
  ].filter((f) => f.value);

  return (
    <Section id="about">
      <SectionHeader index="01" label="About" title={profile.about_heading || "About"} />
      <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-7 md:col-start-5">
          <Reveal as="p" className="text-xl leading-relaxed text-foreground text-pretty md:text-2xl">
            {profile.biography}
          </Reveal>
          {profile.short_description ? (
            <Reveal as="p" delay={80} className="measure mt-6 text-base leading-relaxed text-muted-foreground">
              {profile.short_description}
            </Reveal>
          ) : null}
          <dl className="mt-12 grid gap-px border-t border-hairline sm:grid-cols-3">
            {facts.map((fact, i) => (
              <Reveal key={fact.label} delay={i * 70} className="border-b border-hairline py-5 sm:border-b-0 sm:pr-6">
                <dt className="label-xs">{fact.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-foreground">{fact.value}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------- Education ---------------------------- */

export function EducationSection({ data }: { data: PortfolioData }) {
  if (!data.education.length) return null;
  return (
    <Section id="education">
      <SectionHeader index="02" label="Education" title="Academic foundation" />
      <ol className="mt-12 md:grid md:grid-cols-12 md:gap-10">
        <li className="md:col-span-8 md:col-start-5">
          <ol>
            {data.education.map((item, i) => (
              <Reveal
                key={item.id}
                as="li"
                delay={i * 80}
                className="group grid gap-2 border-t border-hairline py-8 sm:grid-cols-[8rem_1fr] sm:gap-8"
              >
                <span className="label-xs pt-1">
                  {[item.start_year, item.end_year].filter(Boolean).join(" — ")}
                </span>
                <div>
                  <h3 className="text-lg leading-snug text-foreground">
                    {item.degree}
                    {item.field ? <span className="text-muted-foreground"> — {item.field}</span> : null}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">
                    {item.institution}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  {item.score ? <p className="mt-3 font-mono text-sm text-accent">{item.score}</p> : null}
                  {item.description ? (
                    <p className="measure mt-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </ol>
        </li>
      </ol>
    </Section>
  );
}

/* ------------------------------ Skills ----------------------------- */

export function Skills({ data }: { data: PortfolioData }) {
  const grouped = useMemo(
    () =>
      data.categories
        .map((category) => ({
          category,
          skills: data.skills.filter((s) => s.category_id === category.id),
        }))
        .filter((group) => group.skills.length),
    [data.categories, data.skills],
  );

  if (!grouped.length) return null;

  return (
    <Section id="skills">
      <SectionHeader index="03" label="Capabilities" title="Core competencies" />
      <div className="mt-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-8 md:col-start-5">
          <div className="grid gap-px sm:grid-cols-2">
            {grouped.map((group, i) => (
              <Reveal key={group.category.id} delay={i * 70} className="border-t border-hairline py-7 sm:pr-10">
                <h3 className="label-xs text-foreground">{group.category.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {group.skills.map((skill) => (
                    <li
                      key={skill.id}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------- Experience --------------------------- */

export function ExperienceSection({ data }: { data: PortfolioData }) {
  if (!data.experiences.length) return null;
  return (
    <Section id="experience">
      <SectionHeader index="04" label="Experience" title="Professional experience" />
      <div className="mt-12 grid md:grid-cols-12 md:gap-10">
        <ol className="md:col-span-8 md:col-start-5">
          {data.experiences.map((item, i) => (
            <Reveal key={item.id} as="li" delay={i * 80} className="border-t border-hairline py-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg text-foreground">
                  {item.role} <span className="text-muted-foreground">· {item.company}</span>
                </h3>
                <span className="label-xs">
                  {[item.start_date, item.is_current ? "Present" : item.end_date].filter(Boolean).join(" — ")}
                </span>
              </div>
              {item.location || item.employment_type ? (
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {[item.location, item.employment_type].filter(Boolean).join(" · ")}
                </p>
              ) : null}
              {item.description ? (
                <p className="measure mt-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              ) : null}
              {item.responsibilities.length ? (
                <ul className="mt-4 space-y-1.5">
                  {item.responsibilities.map((r) => (
                    <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-px w-3 shrink-0 bg-accent" />
                      {r}
                    </li>
                  ))}
                </ul>
              ) : null}
              {item.technologies.length ? (
                <p className="mt-4 font-mono text-xs text-muted-foreground">{item.technologies.join(" / ")}</p>
              ) : null}
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}

/* ---------------------------- Leadership --------------------------- */

export function Leadership({ data }: { data: PortfolioData }) {
  if (!data.leadership.length) return null;
  return (
    <Section id="leadership">
      <SectionHeader
        index="05"
        label="Leadership"
        title="Leading teams, fests and national-scale events"
        intro="Six programmes led end to end — from technical event design to sponsorships, hospitality and national outreach."
      />
      <ol className="mt-14">
        {data.leadership.map((item, i) => (
          <Reveal key={item.id} as="li" delay={i * 60} className="group border-t border-hairline py-10">
            <div className="grid gap-6 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-4">
                <h3 className="text-xl leading-tight text-foreground text-balance">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {[item.role, item.organization].filter(Boolean).join(" · ")}
                </p>
                {item.date_range ? <p className="label-xs mt-2">{item.date_range}</p> : null}
              </div>

              <div className="md:col-span-5">
                {item.description ? (
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                ) : null}
                {item.responsibilities.length ? (
                  <ul className="space-y-1.5">
                    {item.responsibilities.map((r) => (
                      <li key={r} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="mt-2 h-px w-3 shrink-0 bg-accent transition-[width] duration-300 group-hover:w-5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {item.recognition ? (
                  <p className="mt-4 font-serif text-base text-foreground italic">{item.recognition}</p>
                ) : null}
                {item.impact ? (
                  <p className="mt-4 text-sm leading-relaxed text-foreground">{item.impact}</p>
                ) : null}
              </div>

              {item.metrics.length ? (
                <div className="grid grid-cols-2 gap-6 self-start md:col-span-3 md:grid-cols-1 md:gap-5">
                  {item.metrics.map((metric) => (
                    <div key={metric.label} className="border-l border-accent/50 pl-4">
                      <p className="font-mono text-2xl leading-none text-foreground">{metric.value}</p>
                      <p className="label-xs mt-2 normal-case tracking-normal">{metric.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ----------------------------- Projects ---------------------------- */

function ProjectCover({ project }: { project: Project }) {
  const src = useMediaUrl(project.cover_image_url);
  if (!src) return null;
  return (
    <div className="overflow-hidden">
      <img
        src={src}
        alt={project.title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
}

function ProjectRow({
  project,
  index,
  featured,
  onOpen,
}: {
  project: Project;
  index: number;
  featured?: boolean;
  onOpen: () => void;
}) {
  return (
    <Reveal as="article" delay={index * 60} className="group border-t border-hairline">
      <button
        type="button"
        onClick={onOpen}
        className="w-full cursor-pointer py-10 text-left"
        aria-label={`Open case study: ${project.title}`}
      >
        <div className="grid gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <p className="label-xs">
              {String(index + 1).padStart(2, "0")}
              {featured ? " · Featured" : ""}
            </p>
            <h3
              className={`mt-3 leading-tight text-foreground text-balance ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}
            >
              {project.title}
            </h3>
          </div>

          <div className="md:col-span-5">
            <p className="text-base leading-relaxed text-muted-foreground">
              {project.description ?? project.overview}
            </p>
            {project.technologies.length ? (
              <p className="mt-5 font-mono text-xs text-muted-foreground">{project.technologies.join(" / ")}</p>
            ) : null}
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent">
              Read case study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>

          {project.metrics.length ? (
            <dl className="grid grid-cols-2 gap-5 self-start md:col-span-3 md:grid-cols-1">
              {project.metrics.slice(0, 4).map((metric) => (
                <div key={metric.label}>
                  <dt className="label-xs normal-case tracking-normal">{metric.label}</dt>
                  <dd className="mt-1 font-mono text-lg text-foreground">{metric.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        {project.cover_image_url ? (
          <div className="mt-8 aspect-[16/7]">
            <ProjectCover project={project} />
          </div>
        ) : null}
      </button>
    </Reveal>
  );
}

export function Projects({ data }: { data: PortfolioData }) {
  const [active, setActive] = useState<Project | null>(null);
  if (!data.projects.length) return null;

  const ordered = [...data.projects].sort(
    (a, b) => Number(b.is_featured) - Number(a.is_featured) || a.display_order - b.display_order,
  );

  return (
    <Section id="projects">
      <SectionHeader
        index="06"
        label="Selected work"
        title="Engineering case studies"
        intro="Machine learning and data systems built end to end — from model calibration to streaming inference."
      />
      <div className="mt-14">
        {ordered.map((project, i) => (
          <ProjectRow
            key={project.id}
            project={project}
            index={i}
            featured={project.is_featured}
            onOpen={() => setActive(project)}
          />
        ))}
      </div>
      <ProjectDetail project={active} onClose={() => setActive(null)} />
    </Section>
  );
}

/* -------------------------- Certifications ------------------------- */

export function Certifications({ data }: { data: PortfolioData }) {
  if (!data.certifications.length) return null;
  return (
    <Section id="certifications">
      <SectionHeader index="07" label="Credentials" title="Certifications & highlights" />
      <div className="mt-12 grid md:grid-cols-12 md:gap-10">
        <ul className="md:col-span-8 md:col-start-5">
          {data.certifications.map((cert, i) => (
            <Reveal key={cert.id} as="li" delay={i * 60} className="border-t border-hairline py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-base text-foreground">{cert.name}</h3>
                <span className="label-xs">{[cert.issuer, cert.issue_date].filter(Boolean).join(" · ")}</span>
              </div>
              {cert.description ? (
                <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">{cert.description}</p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-5">
                {cert.credential_url ? (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline text-sm text-accent"
                  >
                    Verify credential
                  </a>
                ) : null}
                {cert.credential_id ? (
                  <span className="font-mono text-xs text-muted-foreground">ID: {cert.credential_id}</span>
                ) : null}
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* --------------------------- Achievements -------------------------- */

export function Achievements({ data }: { data: PortfolioData }) {
  if (!data.achievements.length) return null;
  return (
    <Section id="achievements">
      <SectionHeader index="08" label="Impact" title="Achievements" />
      <ul className="mt-12 grid gap-px sm:grid-cols-2 lg:grid-cols-3">
        {data.achievements.map((item, i) => (
          <Reveal key={item.id} as="li" delay={(i % 3) * 70} className="border-t border-hairline py-7 pr-8">
            {item.metric ? (
              <p className="font-mono text-3xl leading-none text-accent">{item.metric}</p>
            ) : (
              <p className="label-xs">{item.context}</p>
            )}
            <h3 className="mt-4 text-base text-foreground">{item.title}</h3>
            {item.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            ) : null}
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ---------------------------- Positions ---------------------------- */

export function Positions({ data }: { data: PortfolioData }) {
  if (!data.positions.length) return null;
  return (
    <Section id="positions">
      <SectionHeader index="09" label="Responsibility" title="Positions of responsibility" />
      <div className="mt-12 grid md:grid-cols-12 md:gap-10">
        <ul className="md:col-span-8 md:col-start-5">
          {data.positions.map((item, i) => (
            <Reveal key={item.id} as="li" delay={i * 60} className="border-t border-hairline py-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3 className="text-base text-foreground">{item.title}</h3>
                {item.date_range ? <span className="label-xs">{item.date_range}</span> : null}
              </div>
              {item.organization ? (
                <p className="mt-1.5 text-sm text-muted-foreground">{item.organization}</p>
              ) : null}
              {item.description ? (
                <p className="measure mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              ) : null}
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ------------------------------ Resume ----------------------------- */

export function ResumeSection({ data }: { data: PortfolioData }) {
  const url = useMediaUrl(data.resume?.file_path ?? null);
  if (!data.resume || !url) return null;
  return (
    <Section id="resume">
      <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-10">
        <Reveal className="md:col-span-7">
          <p className="label-xs">Resume</p>
          <h2 className="heading-2 mt-4">{data.resume.label}</h2>
          <p className="measure mt-4 text-base text-muted-foreground">
            The full document, including education, projects and leadership record.
          </p>
        </Reveal>
        <Reveal delay={80} className="md:col-span-5 md:text-right">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity duration-200 hover:opacity-90"
          >
            <FileText className="h-4 w-4" />
            Download Resume
          </a>
        </Reveal>
      </div>
    </Section>
  );
}

/* ------------------------------ Contact ---------------------------- */

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  subject: z.string().trim().max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

export function Contact({ data }: { data: PortfolioData }) {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const profile = data.profile;

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (values.website) return; // honeypot
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        next[String(issue.path[0])] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setState("sending");
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    if (error) {
      setState("idle");
      toast.error("Message could not be sent. Please email directly.");
      return;
    }
    setState("sent");
    setValues({ name: "", email: "", subject: "", message: "", website: "" });
    toast.success("Message sent — thank you.");
  }

  const field =
    "w-full border-b border-border bg-transparent py-3 text-base text-foreground outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-accent";

  return (
    <Section id="contact">
      <SectionHeader index="10" label="Contact" title="Let's build something with impact" />
      <div className="mt-12 grid gap-12 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <ul className="space-y-5">
            {profile?.email ? (
              <li>
                <p className="label-xs">Email</p>
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline mt-1 inline-flex items-center gap-2 text-base text-foreground"
                >
                  <Mail className="h-4 w-4 text-accent" />
                  {profile.email}
                </a>
              </li>
            ) : null}
            {profile?.phone ? (
              <li>
                <p className="label-xs">Phone</p>
                <a
                  href={`tel:${profile.phone}`}
                  className="link-underline mt-1 inline-flex items-center gap-2 text-base text-foreground"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  {profile.phone}
                </a>
              </li>
            ) : null}
            {data.socials
              .filter((s) => s.is_active && s.platform !== "email")
              .map((social) => (
                <li key={social.id}>
                  <p className="label-xs">{social.label ?? social.platform}</p>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-underline mt-1 inline-block text-base text-foreground"
                  >
                    {social.url.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              ))}
          </ul>
        </div>

        <form onSubmit={onSubmit} className="md:col-span-8" noValidate>
          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="label-xs">
                Name
              </label>
              <input
                id="name"
                className={field}
                value={values.name}
                onChange={(e) => setValues({ ...values, name: e.target.value })}
                aria-invalid={!!errors.name}
                required
              />
              {errors.name ? <p className="mt-2 text-xs text-destructive">{errors.name}</p> : null}
            </div>
            <div>
              <label htmlFor="email" className="label-xs">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={field}
                value={values.email}
                onChange={(e) => setValues({ ...values, email: e.target.value })}
                aria-invalid={!!errors.email}
                required
              />
              {errors.email ? <p className="mt-2 text-xs text-destructive">{errors.email}</p> : null}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="subject" className="label-xs">
                Subject
              </label>
              <input
                id="subject"
                className={field}
                value={values.subject}
                onChange={(e) => setValues({ ...values, subject: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="label-xs">
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className={`${field} resize-none`}
                value={values.message}
                onChange={(e) => setValues({ ...values, message: e.target.value })}
                aria-invalid={!!errors.message}
                required
              />
              {errors.message ? <p className="mt-2 text-xs text-destructive">{errors.message}</p> : null}
            </div>
          </div>

          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
            value={values.website}
            onChange={(e) => setValues({ ...values, website: e.target.value })}
          />

          <button
            type="submit"
            disabled={state === "sending"}
            className="mt-10 inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
          >
            {state === "sending" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {state === "sent" ? <Check className="h-4 w-4" /> : null}
            {state === "sent" ? "Message sent" : "Send message"}
          </button>
        </form>
      </div>
    </Section>
  );
}

/* ------------------------------ Footer ----------------------------- */

export function Footer({ data }: { data: PortfolioData }) {
  const profile = data.profile;
  const settings = data.settings;
  return (
    <footer className="rule-top py-14">
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-lg text-foreground">{profile?.full_name}</p>
          <p className="mt-2 font-serif text-base text-muted-foreground italic">
            {settings?.footer_text || profile?.tagline}
          </p>
          {profile?.email ? (
            <a href={`mailto:${profile.email}`} className="link-underline mt-4 inline-block text-sm text-foreground">
              {profile.email}
            </a>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-5">
            {data.socials
              .filter((s) => s.is_active)
              .map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target={social.url.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="label-xs transition-colors duration-200 hover:text-accent"
                >
                  {social.label ?? social.platform}
                </a>
              ))}
          </div>
          <p className="label-xs">{settings?.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
