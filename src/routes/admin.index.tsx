import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const TABLES = [
  { table: "projects", label: "Projects", to: "/admin/projects" },
  { table: "skills", label: "Skills", to: "/admin/skills" },
  { table: "experiences", label: "Experience", to: "/admin/experience" },
  { table: "leadership_experiences", label: "Leadership", to: "/admin/leadership" },
  { table: "education", label: "Education", to: "/admin/education" },
  { table: "certifications", label: "Certifications", to: "/admin/certifications" },
  { table: "achievements", label: "Achievements", to: "/admin/achievements" },
  { table: "positions_of_responsibility", label: "Positions", to: "/admin/positions" },
  { table: "resumes", label: "Resumes", to: "/admin/resume" },
  { table: "social_links", label: "Social links", to: "/admin/social" },
] as const;

function Dashboard() {
  const counts = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const entries = await Promise.all(
        TABLES.map(async (t) => {
          const { count } = await db.from(t.table).select("id", { count: "exact", head: true });
          return [t.table, count ?? 0] as const;
        }),
      );
      const { count: unread } = await db
        .from("contact_messages")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false);
      return { counts: Object.fromEntries(entries) as Record<string, number>, unread: unread ?? 0 };
    },
  });

  return (
    <div>
      <h1 className="text-2xl text-foreground">Dashboard</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Everything on the public site is editable here.</p>

      <div className="mt-10 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {TABLES.map((t) => (
          <Link key={t.table} to={t.to} className="group bg-background p-6 transition-colors duration-200 hover:bg-surface">
            <p className="label-xs">{t.label}</p>
            <p className="mt-3 font-serif text-4xl text-foreground">{counts.data?.counts[t.table] ?? "—"}</p>
          </Link>
        ))}
        <Link to="/admin/messages" className="bg-background p-6 transition-colors duration-200 hover:bg-surface">
          <p className="label-xs">Unread messages</p>
          <p className="mt-3 font-serif text-4xl text-accent">{counts.data?.unread ?? "—"}</p>
        </Link>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/admin/profile" className="border border-border px-4 py-2.5 text-sm text-foreground hover:border-accent">
          Edit profile
        </Link>
        <Link to="/admin/settings" className="border border-border px-4 py-2.5 text-sm text-foreground hover:border-accent">
          Site settings
        </Link>
        <Link to="/" className="border border-border px-4 py-2.5 text-sm text-foreground hover:border-accent">
          View site
        </Link>
      </div>
    </div>
  );
}
