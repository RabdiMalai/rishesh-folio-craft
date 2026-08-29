import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthState = {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
  refreshRole: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadRole(userId: string | undefined) {
    if (!userId) {
      setIsAdmin(false);
      return;
    }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin");
    setIsAdmin(!!data?.length);
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setTimeout(() => {
        void loadRole(next?.user.id).finally(() => setLoading(false));
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      await loadRole(data.session?.user.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthState = {
    session,
    isAdmin,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
      setIsAdmin(false);
    },
    refreshRole: async () => loadRole(session?.user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
