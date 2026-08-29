import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { portfolioQuery } from "@/lib/portfolio";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import {
  About,
  Achievements,
  Certifications,
  Contact,
  EducationSection,
  ExperienceSection,
  Footer,
  Leadership,
  Positions,
  Projects,
  ResumeSection,
  Skills,
} from "@/components/site/sections";

const TITLE = "Rishesh Shukla | AI/ML & Data Science";
const DESCRIPTION =
  "Versatile CS undergraduate with expertise in AI/ML, data-driven systems, and event leadership, combining technical excellence with strategic, creative, and collaborative impact.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Rishesh Shukla",
          email: "risheshshukla12@gmail.com",
          telephone: "8931993353",
          jobTitle: "AI/ML • Data Science • Software Engineering • Leadership",
          description: DESCRIPTION,
          alumniOf: ["IIT Madras", "KIET Group of Institutions"],
        }),
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data, isPending, isError } = useQuery(portfolioQuery);

  if (isPending) {
    return (
      <main className="shell flex min-h-screen items-end pb-32">
        <div className="w-full">
          <div className="h-3 w-28 animate-pulse bg-muted" />
          <div className="mt-8 h-24 w-3/4 animate-pulse bg-muted" />
          <div className="mt-6 h-4 w-1/2 animate-pulse bg-muted" />
        </div>
      </main>
    );
  }

  if (isError || !data?.profile) {
    return (
      <main className="shell flex min-h-screen items-center">
        <p className="text-sm text-muted-foreground">Content is temporarily unavailable.</p>
      </main>
    );
  }

  return (
    <>
      <Nav data={data} />
      <main>
        <Hero data={data} />
        <About data={data} />
        <EducationSection data={data} />
        <Skills data={data} />
        <Leadership data={data} />
        <ExperienceSection data={data} />
        <Projects data={data} />
        <Certifications data={data} />
        <Achievements data={data} />
        <Positions data={data} />
        <ResumeSection data={data} />
        <Contact data={data} />
      </main>
      <Footer data={data} />
    </>
  );
}
