import React, { createContext, useContext, useEffect, useState } from "react";
import { User  } from "../types/types";
import { DEFAULT_USERS } from "../types/testData";
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
    // Initialize users from localStorage or use defaults
    const storedUsers = localStorage.getItem("users");
    if (!storedUsers) {
      localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
      setUsers(DEFAULT_USERS);
    } else {
      setUsers(JSON.parse(storedUsers));
    }

    // Check for existing login
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

  // Function to update user in localStorage (Users) and state (Current User)
  const updateUserInLocalStorage = (updatedUser: User) => {
    localStorage.setItem("currentUser", JSON.stringify(updatedUser)); //Ensure currentUser is updated
    setCurrentUser(updatedUser);
  
    // Find the index of the user to update (where user.id === updatedUser.id)
    const userIndex = users.findIndex((user: User) => user.id === updatedUser.id);
  
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem("users", JSON.stringify(users));
      setUsers(users);
      toaster.create({title: "User Updated", description: "User details have been updated successfully.", type: "success", duration: 5000,});
    } // User not found, no action taken (user must be logged in to update)
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
