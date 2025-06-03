import React, { createContext, useContext, useEffect, useState } from "react";
import { UserUI } from "@/types/userTypes";
import { toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import { authApi } from "@/services/api";

interface AuthContextType {
  currentUser: UserUI | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserInDatabase: (userToUpdate: UserUI) => Promise<void>;
  signUp: (firstName: string, lastName: string, username: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserUI | (null)>(null);
  const [users, setUsers] = useState<UserUI[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const router = useRouter();

  useEffect(() => {
    const fetchSessionUser = async () => {
      setLoading(true);
      try {
        const response = await authApi.getCurrentUser();

        // const user = {
        //   id: response.user.user_id,
        //   username: response.user.username,
        //   firstName: response.user.first_name,
        //   lastName: response.user.last_name,
        //   email: response.user.email,
        //   avatar: response.user.avatar,
        //   password: '',
        //   role: response.user.role ? [response.user.role.role_name] : [],
        // };

        const user: UserUI = {
          id: response.user.user_id,
          username: response.user.username,
          firstName: response.user.first_name,
          lastName: response.user.last_name,
          email: response.user.email,
          avatar: response.user.avatar || null,
          role: response.user.role?.role_name || "candidate",
          skills: response.user.skills || [],
          courses: response.user.courses || [],
          previousRoles: response.user.previousRoles?.map((role: { previous_role: string }) => role.previous_role) || [],
          academicCredentials: response.user.academicCredentials?.map((credential: { degree_name: string }) => credential.degree_name) || [],
        };

        setCurrentUser(user);
      } catch (err: any) {
        console.warn("No session found or invalid token.");
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionUser();
  }, []);


  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await authApi.loginUser(email, password);

      // const user = {
      //   id: response.user.user_id,
      //   username: response.user.username,
      //   firstName: response.user.first_name,
      //   lastName: response.user.last_name,
      //   email: response.user.email,
      //   avatar: response.user.avatar,
      //   password: '',
      //   role: [],
      // };

      const user: UserUI = {
        id: response.user.user_id,
        username: response.user.username,
        firstName: response.user.first_name,
        lastName: response.user.last_name,
        email: response.user.email,
        avatar: response.user.avatar || null,
        role: response.user.role?.role_name || "candidate",
        skills: response.user.skills || [],
        courses: response.user.courses || [],
        previousRoles: response.user.previousRoles?.map((role: { previous_role: string }) => role.previous_role) || [],
        academicCredentials: response.user.academicCredentials?.map((credential: { degree_name: string }) => credential.degree_name) || [],
      };

      setCurrentUser(user);

      toaster.create({
        title: "Sign in Successful",
        description: `Welcome back, ${user.firstName || "User"}!`,
        type: "success",
        duration: 5000,
      });

      return true;
    } catch (err) {
      let errorMessage = "Login failed. Please check your credentials.";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as { response?: { status?: number } }).response;
        if (response?.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        }
      }

      setError(errorMessage);

      toaster.create({
        title: "Login Failed",
        description: errorMessage,
        type: "error",
        duration: 5000,
      });

      return false;
    } finally {
        setLoading(false);
    }
  };

  const logout = async () => {
    await authApi.logout();
    setCurrentUser(null);
    toaster.create({
      title: "Sign out Successful",
      description: `We hope to see you back soon, ${currentUser?.firstName}!`,
      type: "success",
      duration: 5000
    });
    router.push("/");
  };


  const updateUserInDatabase = async (userToUpdate: UserUI) => {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
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
  
      // const user = {
      //   id: data.user.user_id,
      //   username: data.user.username,
      //   firstName: data.user.first_name,
      //   lastName: data.user.last_name,
      //   email: data.user.email,
      //   avatar: data.user.avatar,
      //   password: '',
      //   role: ["candidate"], // set role to candidate by default
      // };

      const user: UserUI = {
        id: data.user.user_id,
        username: data.user.username,
        firstName: data.user.first_name,
        lastName: data.user.last_name,
        email: data.user.email,
        avatar: data.user.avatar || null,
        // password: "",
        role: "candidate",
        skills: [],
        courses: [],
        previousRoles: [],
        academicCredentials: [],
      };
  
      setCurrentUser(user);
  
      toaster.create({
        title: "Sign up Successful",
        description: `Welcome, ${user.firstName || "User"}!`,
        type: "success",
        duration: 5000,
      });
  
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred.";
      setError(message);
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
