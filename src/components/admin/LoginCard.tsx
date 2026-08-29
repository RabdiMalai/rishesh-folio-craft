import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(8, "Password must be at least 8 characters").max(72),
});

export function LoginCard() {
  const { session, refreshRole, signOut } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  const field =
    "w-full border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors duration-200 focus:border-accent";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    setBusy(true);
    const { error } =
      mode === "signin"
        ? await supabase.auth.signInWithPassword(parsed.data)
        : await supabase.auth.signUp({
            ...parsed.data,
            options: { emailRedirectTo: `${window.location.origin}/admin` },
          });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // First account to sign in becomes the admin; afterwards this is a no-op.
    await supabase.rpc("claim_admin");
    await refreshRole();
  }

  async function claim() {
    setBusy(true);
    const { data } = await supabase.rpc("claim_admin");
    await refreshRole();
    setBusy(false);
    if (!data) toast.error("An admin already exists for this site.");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="label-xs">Rishesh Shukla</p>
        <h1 className="heading-2 mt-3">Admin</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {session ? "This account does not have admin access yet." : "Sign in to manage the portfolio content."}
        </p>

        {session ? (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={claim}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Claim admin access
            </button>
            <button type="button" onClick={() => void signOut()} className="w-full py-2 text-sm text-muted-foreground">
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="admin-email" className="label-xs mb-2 block">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="admin-password" className="label-xs mb-2 block">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signin" ? "Sign in" : "Create admin account"}
            </button>
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="w-full py-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
