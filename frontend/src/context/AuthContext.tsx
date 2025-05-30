import React, { createContext, useContext, useEffect, useState } from "react";
import { User  } from "@/types/types";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import { authApi } from "@/services/api";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserInDatabase: (userToUpdate: User) => Promise<void>;
  signUp: (firstName: string, lastName: string, username: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | (null)>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const router = useRouter();

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.loginUser(email, password);

      const user = {
        id: response.user.user_id,
        username: response.user.username,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        avatar: response.user.avatar,
        password: '',
        role: [],
      };
      setCurrentUser(user);

      toaster.create({
        title: "Sign in Successful",
        description: `Welcome back, ${user.firstName || "User"}!`,
        type: "success",
        duration: 5000,
      });

      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      return false;
    } finally {
        setLoading(false);
    }
  };

    const logout = () => {
      setCurrentUser(null);
      toaster.create({ title: "Sign out Successful", description: `We hope to see you back soon, ${currentUser?.firstName}!`, type: "success", duration: 5000 });
      router.push("/");
  };

  const updateUserInDatabase = async (userToUpdate: User) => {
    try {
      const response = await fetch(`/auth/users/${userToUpdate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to update user in database.");
      }

      const data = await response.json();

      // Update the current user state with the updated user data
      if (currentUser?.id === userToUpdate.id) {
        setCurrentUser(data);
      }

      const updatedUser = users.map(user =>
          user.id === userToUpdate.id ? userToUpdate : user
      );
      setUsers(updatedUser);

      toaster.create({
        title: "User Updated",
        description: "User details have been updated successfully.",
        type: "success",
        duration: 5000,
      });
    } catch (err: any) {
      setError(err.message);
      toaster.create({
        title: "Update Failed",
        description: "Failed to update user details. Please try again.",
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (firstName: string, lastName: string, username: string, email: string, password: string ): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    try {
      const data = await authApi.createUser(firstName, lastName, username, email, password);
  
      const user = {
        id: data.user.user_id,
        username: data.user.username,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        email: data.user.email,
        avatar: data.user.avatar,
        password: '',
        role: [],
      };
  
      setCurrentUser(user);
  
      toaster.create({
        title: "Sign up Successful",
        description: `Welcome, ${user.firstName || "User"}!`,
        type: "success",
        duration: 5000,
      });
  
      return true;
    } catch (err: any) {
      const errorMessage = err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <AuthContext.Provider value={{ currentUser, loading, error, login, logout, updateUserInDatabase, signUp }}>
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
