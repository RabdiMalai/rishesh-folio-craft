import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme";
import type { PortfolioData } from "@/lib/portfolio";
import { useMediaUrl } from "@/lib/media";

const NAV = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#leadership", label: "Leadership" },
  { href: "#projects", label: "Projects" },
  { href: "#education", label: "Education" },
  { href: "#contact", label: "Contact" },
];

export function Nav({ data }: { data: PortfolioData }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const resumeUrl = useMediaUrl(data.resume?.file_path ?? null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const named = (platform: string) => data.socials.find((s) => s.platform === platform && s.is_active);
  const github = named("github");
  const linkedin = named("linkedin");

  const initials = (data.profile?.full_name ?? "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-hairline bg-background/85 backdrop-blur-md" : "border-b border-transparent"
      } ${mounted ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}`}
    >
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex items-baseline gap-3">
          <span className="font-mono text-sm tracking-[0.2em] text-foreground">{initials || "RS"}</span>
          <span className="hidden text-sm text-muted-foreground sm:inline">{data.profile?.full_name}</span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="label-xs text-foreground transition-colors duration-200 hover:text-accent"
            >
              Resume
            </a>
          ) : null}
          {github ? (
            <a
              href={github.url}
              target="_blank"
              rel="noreferrer"
              className="label-xs text-foreground transition-colors duration-200 hover:text-accent"
            >
              GitHub
            </a>
          ) : null}
          {linkedin ? (
            <a
              href={linkedin.url}
              target="_blank"
              rel="noreferrer"
              className="label-xs text-foreground transition-colors duration-200 hover:text-accent"
            >
              LinkedIn
            </a>
          ) : null}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-9 w-9 items-center justify-center border border-hairline text-foreground"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 top-16 z-40 bg-background lg:hidden">
          <nav aria-label="Mobile" className="shell flex flex-col gap-1 pt-8">
            {NAV.map((item, i) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ transitionDelay: `${i * 25}ms` }}
                className="border-b border-hairline py-4 text-2xl tracking-tight text-foreground transition-colors duration-200 hover:text-accent"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-8 flex flex-wrap gap-6">
              {resumeUrl ? (
                <a href={resumeUrl} target="_blank" rel="noreferrer" className="label-xs text-foreground">
                  Resume
                </a>
              ) : null}
              {github ? (
                <a href={github.url} target="_blank" rel="noreferrer" className="label-xs text-foreground">
                  GitHub
                </a>
              ) : null}
              {linkedin ? (
                <a href={linkedin.url} target="_blank" rel="noreferrer" className="label-xs text-foreground">
                  LinkedIn
                </a>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
