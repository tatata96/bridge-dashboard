/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";

import { fetchMe } from "@/auth/auth.api";
import type { ClassistaUser } from "@/auth/auth.types";
import { supabase } from "@/auth/supabase-client";
import { queryClient } from "@/lib/network/query-client";

type AuthContextValue = {
  user: User | null;
  classistaUser: ClassistaUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [classistaUser, setClassistaUser] = useState<ClassistaUser | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const lastUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      lastUserIdRef.current = session?.user.id ?? null;
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const userId = session?.user.id ?? null;

      // undefined means initial restoration hasn't landed yet; skip the
      // clear so this first callback doesn't wipe a cache that was never
      // populated for a previous user.
      if (
        lastUserIdRef.current !== undefined &&
        lastUserIdRef.current !== userId
      ) {
        queryClient.clear();
      }
      lastUserIdRef.current = userId;

      if (!session) {
        setClassistaUser(null);
      }
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Keyed on the user id rather than the session object, so token refreshes
  // (new session object, same user) don't refetch. Covers first login,
  // session restoration and a change of identity. Clearing on logout is
  // handled in onAuthStateChange above.
  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    fetchMe()
      .then((me) => {
        if (!cancelled) setClassistaUser(me);
      })
      .catch((error) => {
        // Supabase auth is valid, so don't block the app; user stays unset.
        console.error("Failed to load Classista user", error);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      classistaUser,
      session,
      loading,
      signIn: async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { error };
      },
      signOut: async () => {
        const { error } = await supabase.auth.signOut();
        return { error };
      },
    }),
    [session, classistaUser, loading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
}
