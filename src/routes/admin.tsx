import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, LogOut, Menu, X } from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { LoginCard } from "@/components/admin/LoginCard";
import { ThemeToggle } from "@/components/theme";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Rishesh Shukla" },
      { name: "description", content: "Private content management for the portfolio." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

const NAV = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/profile", label: "Profile" },
  { to: "/admin/skills", label: "Skills" },
  { to: "/admin/experience", label: "Experience" },
  { to: "/admin/leadership", label: "Leadership" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/education", label: "Education" },
  { to: "/admin/certifications", label: "Certifications" },
  { to: "/admin/achievements", label: "Achievements" },
  { to: "/admin/positions", label: "Positions" },
  { to: "/admin/resume", label: "Resume" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/social", label: "Social Links" },
  { to: "/admin/settings", label: "Site Settings" },
] as const;

function AdminLayout() {
  return (
    <AuthProvider>
      <AdminShell />
    </AuthProvider>
  );
}

function AdminShell() {
  const { loading, session, isAdmin, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!session || !isAdmin) return <LoginCard />;

  return (
    <div className="min-h-screen lg:flex">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar px-5 py-6 transition-transform duration-200 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="label-xs text-foreground">
            ← Portfolio
          </Link>
          <button type="button" className="lg:hidden" onClick={() => setOpen(false)} aria-label="Close menu">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <nav aria-label="Admin" className="mt-8 space-y-0.5">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`block border-l-2 py-2 pl-3 text-sm transition-colors duration-200 ${
                  active
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-10 flex items-center gap-2 border-t border-border pt-6">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4 lg:hidden">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5 text-foreground" />
          </button>
          <span className="label-xs">Admin</span>
        </div>
        <main className="px-5 py-10 md:px-10 md:py-14">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
