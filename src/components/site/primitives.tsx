import { useEffect, useRef, useState, type ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "li" | "section" | "article" | "span" | "p" | "h2";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Component = Tag as "div";
  return (
    <Component
      ref={ref as never}
      style={{ ["--reveal-delay" as string]: `${delay}ms` }}
      className={`reveal ${shown ? "reveal-in" : ""} ${className}`}
    >
      {children}
    </Component>
  );
}

export function SectionHeader({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-12 md:gap-10">
      <Reveal className="md:col-span-4">
        <p className="label-xs flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-8 bg-hairline" />
          {label}
        </p>
      </Reveal>
      <div className="md:col-span-8">
        <Reveal as="h2" delay={60} className="heading-2 text-balance">
          {title}
        </Reveal>
        {intro ? (
          <Reveal as="p" delay={120} className="measure mt-5 text-base leading-relaxed text-muted-foreground">
            {intro}
          </Reveal>
        ) : null}
      </div>
    </div>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`rule-top py-20 md:py-28 ${className}`}>
      <div className="shell">{children}</div>
    </section>
  );
}
