import { useEffect, useState } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { PortfolioData } from "@/lib/portfolio";
import { useMediaUrl } from "@/lib/media";

function Stage({ children, step, delay }: { children: React.ReactNode; step: number; delay: number }) {
  return (
    <div
      className="transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{
        opacity: step >= delay ? 1 : 0,
        transform: step >= delay ? "none" : "translateY(16px)",
      }}
    >
      {children}
    </div>
  );
}

export function Hero({ data }: { data: PortfolioData }) {
  const [step, setStep] = useState(0);
  const profile = data.profile;
  const image = useMediaUrl(profile?.profile_image_url ?? null);
  const resumeUrl = useMediaUrl(data.resume?.file_path ?? null);

  useEffect(() => {
    const timers = [1, 2, 3, 4, 5].map((n) => window.setTimeout(() => setStep(n), 120 * n));
    return () => timers.forEach(window.clearTimeout);
  }, []);

  if (!profile) return null;

  const positioning = profile.professional_title.split("•").map((s) => s.trim()).filter(Boolean);

  return (
    <section id="top" className="shell pt-32 pb-20 md:pt-44 md:pb-28">
      <div className="grid items-end gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <Stage step={step} delay={1}>
            <p className="label-xs flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              {positioning.map((item, i) => (
                <span key={item} className="flex items-center gap-3">
                  {item}
                  {i < positioning.length - 1 ? <span className="h-px w-4 bg-hairline" /> : null}
                </span>
              ))}
            </p>
          </Stage>

          <Stage step={step} delay={2}>
            <h1 className="display mt-8 uppercase">
              {profile.full_name.split(" ").map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </h1>
          </Stage>

          <Stage step={step} delay={3}>
            <p className="mt-8 font-serif text-xl leading-snug text-foreground italic md:text-2xl">
              {profile.tagline}
            </p>
            <p className="measure mt-6 text-base leading-relaxed text-muted-foreground">{profile.summary}</p>
          </Stage>

          <Stage step={step} delay={4}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition-opacity duration-200 hover:opacity-90"
              >
                View Projects
                <ArrowDownRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors duration-200 hover:border-accent hover:text-accent"
                >
                  Download Resume
                </a>
              ) : null}
              <a
                href="#contact"
                className="link-underline inline-flex items-center gap-1.5 px-1 py-3 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                Contact Me
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </Stage>

          <Stage step={step} delay={5}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
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
          </Stage>
        </div>

        <Stage step={step} delay={5}>
          <div className="lg:col-span-4">
            {image ? (
              <img
                src={image}
                alt={`Portrait of ${profile.full_name}`}
                loading="eager"
                className="aspect-[4/5] w-full object-cover grayscale transition-[filter] duration-500 hover:grayscale-0"
              />
            ) : (
              <div className="aspect-[4/5] w-full border border-hairline bg-surface p-6">
                <div className="flex h-full flex-col justify-between">
                  <p className="label-xs">{profile.current_status}</p>
                  <p className="font-serif text-[clamp(3rem,9vw,5rem)] leading-[0.85] tracking-tight text-foreground">
                    {profile.full_name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </p>
                  <p className="text-sm text-muted-foreground">{profile.location}</p>
                </div>
              </div>
            )}
          </div>
        </Stage>
      </div>
    </section>
  );
}
