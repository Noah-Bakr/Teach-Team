import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_USERS, User  } from "../testData/user";

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
