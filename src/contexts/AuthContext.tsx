import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  name: string;
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
    // Check for existing session
    const storedUser = localStorage.getItem("jungle_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Try to find existing user in our "database"
    const usersDB = localStorage.getItem("jungle_users_db");
    const users = usersDB ? JSON.parse(usersDB) : {};
    
    const existingUser = users[email];
    
    if (!existingUser) {
      throw new Error("Usuário não encontrado. Por favor, cadastre-se primeiro.");
    }
    
    // Login with existing user data (including studentType if exists)
    setUser(existingUser);
    localStorage.setItem("jungle_user", JSON.stringify(existingUser));
  };

  const signup = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get existing users database
    const usersDB = localStorage.getItem("jungle_users_db");
    const users = usersDB ? JSON.parse(usersDB) : {};
    
    // Check if user already exists
    if (users[email]) {
      throw new Error("Usuário já existe. Por favor, faça login.");
    }
    
    // Create new user WITHOUT studentType (will trigger onboarding) and with 'free' plan
    const mockUser: User = {
      id: Math.random().toString(36),
      name,
      email,
      planType: 'free',
      // studentType is undefined - will show onboarding quiz
    };
    
    // Save to users database
    users[email] = mockUser;
    localStorage.setItem("jungle_users_db", JSON.stringify(users));
    
    // Set as current user
    setUser(mockUser);
    localStorage.setItem("jungle_user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("jungle_user");
  };

  const saveProfile = (studentType: string) => {
    if (user) {
      const updatedUser = { ...user, studentType };
      setUser(updatedUser);
      localStorage.setItem("jungle_user", JSON.stringify(updatedUser));
      
      // Update in users database too
      const usersDB = localStorage.getItem("jungle_users_db");
      const users = usersDB ? JSON.parse(usersDB) : {};
      users[user.email] = updatedUser;
      localStorage.setItem("jungle_users_db", JSON.stringify(users));
    }
  };

  const upgradePlan = async (planType: 'monthly' | 'annual') => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (user) {
      const updatedUser = { ...user, planType };
      setUser(updatedUser);
      localStorage.setItem("jungle_user", JSON.stringify(updatedUser));
      
      // Update in users database too
      const usersDB = localStorage.getItem("jungle_users_db");
      const users = usersDB ? JSON.parse(usersDB) : {};
      users[user.email] = updatedUser;
      localStorage.setItem("jungle_users_db", JSON.stringify(users));
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
