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

import type { ClassistaUser } from "@/api/auth/auth.types";
import { supabase } from "@/auth/supabase-client";
import { useMeQuery } from "@/api/auth/auth.api";
import { queryClient } from "@/lib/network/query-client";

type AuthContextValue = {
  user: User | null;
  classistaUser: ClassistaUser | null;
  classistaUserLoading: boolean;
  classistaUserError: Error | null;
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

      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Cached per user id, so token refreshes don't refetch. The cache is
  // cleared in onAuthStateChange when the authenticated identity changes.
  const {
    data: classistaUser = null,
    isLoading: classistaUserLoading,
    error: classistaUserError,
  } = useMeQuery(session?.user.id);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      classistaUser,
      classistaUserLoading,
      classistaUserError,
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
    [session, classistaUser, classistaUserLoading, classistaUserError, loading],
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
