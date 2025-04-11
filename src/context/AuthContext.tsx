import React, { createContext, useContext, useEffect, useState } from "react";
import { User  } from "../types/types";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUserInLocalStorage: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | (null)>(null);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }

    // Also check for existing login:
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

    if (foundUser) {
      toaster.create({ title: "Sign in Successful", description: `Welcome back, ${foundUser.firstName}!`, type: "success", duration: 5000 });
      setCurrentUser(foundUser);
      localStorage.setItem("currentUser", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toaster.create({ title: "Sign out Successful", description: `We hope to see you back soon, ${currentUser?.firstName}!`, type: "success", duration: 5000 });
    router.push("/");
  };

  const updateUserInLocalStorage = (updatedUser: User) => {
    // Update currentUser persistently
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    // Update the users list immutably
    const updatedUsers = users.map(user =>
        user.id === updatedUser.id ? updatedUser : user
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    toaster.create({
      title: "User Updated",
      description: "User details have been updated successfully.",
      type: "success",
      duration: 5000,
    });
  };

  return (
    <AuthContext.Provider value={{ currentUser: currentUser, users, login, logout, updateUserInLocalStorage }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
