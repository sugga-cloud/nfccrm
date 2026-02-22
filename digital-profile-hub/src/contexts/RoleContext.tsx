import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Role = "guest" | "customer" | "admin";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  logout: () => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRoleState] = useState<Role>("guest");

  useEffect(() => {
    const initAuth = () => {
      const savedToken = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role") as Role;

      // With Sanctum, if we have a token string, we assume it's valid 
      // until the server tells us otherwise (401 error)
      if (savedToken && savedRole) {
        setRoleState(savedRole);
      } else {
        setRoleState("guest");
      }
      setIsLoading(false);
    };

    initAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" && !e.newValue) {
        setRoleState("guest");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const setRole = (newRole: Role) => {
    localStorage.setItem("role", newRole);
    setRoleState(newRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setRoleState("guest");
    // Redirecting here is cleaner than inside useEffect
    window.location.href = "/login";
  };

  return (
    <RoleContext.Provider value={{ role, setRole, logout, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};