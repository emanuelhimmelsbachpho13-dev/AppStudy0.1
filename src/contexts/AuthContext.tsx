import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  name?: string;
  email: string;
  studentType?: string;
  planType?: 'free' | 'monthly' | 'annual';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  hasProfile: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  saveProfile: (studentType: string) => void;
  upgradePlan: (planType: 'monthly' | 'annual') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
            studentType: session.user.user_metadata?.studentType,
            planType: session.user.user_metadata?.planType || 'free',
          });
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          studentType: session.user.user_metadata?.studentType,
          planType: session.user.user_metadata?.planType || 'free',
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // User state will be updated by onAuthStateChange
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          name,
          planType: 'free',
          // studentType is undefined - will trigger onboarding
        },
      },
    });

    if (error) {
      throw error;
    }

    // User state will be updated by onAuthStateChange
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const saveProfile = async (studentType: string) => {
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: { studentType }
      });
      
      if (error) throw error;
      
      setUser({ ...user, studentType });
    }
  };

  const upgradePlan = async (planType: 'monthly' | 'annual') => {
    if (user) {
      const { error } = await supabase.auth.updateUser({
        data: { planType }
      });
      
      if (error) throw error;
      
      setUser({ ...user, planType });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      hasProfile: !!user?.studentType,
      login, 
      signup, 
      logout,
      saveProfile,
      upgradePlan
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
