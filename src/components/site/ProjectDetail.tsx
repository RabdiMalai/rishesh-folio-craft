import { useEffect } from "react";
import { ArrowUpRight, X } from "lucide-react";
import { useMediaUrl } from "@/lib/media";
import type { Project } from "@/lib/portfolio";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-hairline py-6">
      <h4 className="label-xs">{title}</h4>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

function Cover({ value, alt }: { value: string; alt: string }) {
  const src = useMediaUrl(value);
  if (!src) return null;
  return <img src={src} alt={alt} loading="lazy" className="w-full object-cover" />;
}

export function ProjectDetail({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  const links = [
    { label: "GitHub", url: project.github_url },
    { label: "Live demo", url: project.live_url },
    { label: "Documentation", url: project.docs_url },
  ].filter((l) => l.url);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[60] overflow-y-auto bg-background/95 backdrop-blur-sm"
    >
      <div className="shell py-16 md:py-24">
        <button
          type="button"
          onClick={onClose}
          className="label-xs sticky top-4 z-10 -mb-4 inline-flex items-center gap-2 text-foreground transition-colors duration-200 hover:text-accent"
        >
          <X className="h-4 w-4" /> Close
        </button>

        <div className="mt-10 grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            {project.category || project.status ? (
              <p className="label-xs">{[project.category, project.status].filter(Boolean).join(" · ")}</p>
            ) : null}
            <h3 className="heading-2 mt-4 text-balance">{project.title}</h3>
            {project.overview ? (
              <p className="measure mt-6 text-lg leading-relaxed text-muted-foreground">{project.overview}</p>
            ) : null}

            {project.problem ? <Block title="Problem">{project.problem}</Block> : null}
            {project.solution ? <Block title="Solution">{project.solution}</Block> : null}
            {project.features.length ? (
              <Block title="Features">
                <ul className="space-y-1.5">
                  {project.features.map((f) => (
                    <li key={f} className="flex gap-3">
                      <span className="mt-2 h-px w-3 shrink-0 bg-accent" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Block>
            ) : null}
            {project.contribution ? <Block title="My contribution">{project.contribution}</Block> : null}
            {project.start_date || project.end_date ? (
              <Block title="Timeline">{[project.start_date, project.end_date].filter(Boolean).join(" — ")}</Block>
            ) : null}
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            {project.metrics.length ? (
              <div className="border-t border-hairline py-6">
                <h4 className="label-xs">Performance</h4>
                <dl className="mt-4 space-y-4">
                  {project.metrics.map((metric) => (
                    <div key={metric.label}>
                      <dt className="text-xs text-muted-foreground">{metric.label}</dt>
                      <dd className="font-mono text-xl text-foreground">{metric.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
            {project.technologies.length ? (
              <Block title="Technologies">
                <ul className="space-y-1">
                  {project.technologies.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </Block>
            ) : null}
            {links.length ? (
              <div className="border-t border-hairline py-6">
                <h4 className="label-xs">Links</h4>
                <ul className="mt-3 space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.url as string}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-accent"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>

        {project.cover_image_url || project.images.length ? (
          <div className="mt-14 space-y-6">
            {[project.cover_image_url, ...project.images].filter(Boolean).map((image) => (
              <Cover key={image as string} value={image as string} alt={project.title} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
