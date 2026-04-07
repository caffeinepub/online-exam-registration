import { type ReactNode, createContext, useContext, useState } from "react";

export interface AuthProfile {
  fullName: string;
  email: string;
  mobile: string;
}

interface AuthState {
  user: AuthProfile | null;
  isAuthenticated: boolean;
  login: (profile: AuthProfile) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthProfile | null>(() => {
    try {
      const stored = localStorage.getItem("examportal_user");
      return stored ? (JSON.parse(stored) as AuthProfile) : null;
    } catch {
      return null;
    }
  });

  const login = (profile: AuthProfile) => {
    const authUser: AuthProfile = {
      fullName: profile.fullName,
      email: profile.email,
      mobile: profile.mobile,
    };
    setUser(authUser);
    localStorage.setItem("examportal_user", JSON.stringify(authUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("examportal_user");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
