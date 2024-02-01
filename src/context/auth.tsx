import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { ReactNode, createContext, useEffect, useState } from "react";

type AuthContextState = {
    session: Session | null;
    isLoading: boolean;
};

export const AuthContext = createContext<AuthContextState>({
    session: null,
    isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);

            setIsLoading(false);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    return (
        <AuthContext.Provider value={{ session, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
