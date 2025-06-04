import React, { createContext, useContext, useEffect, useState, ReactNode,} from "react";
import { useRouter } from "next/router";
import { toaster } from "@/components/ui/toaster";
import { UserUI } from "@/types/userTypes";
import { api } from "@/services/api";
import { loginUser, signUpUser, getCurrentUser, logoutUser,} from "@/services/authService";
import { User as BackendUser } from "@/services/api/userApi";
import { mapBackendUserToUI } from "@/services/mappers/authMapper";

interface AuthContextType {
  currentUser: UserUI | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (
      firstName: string,
      lastName: string,
      username: string,
      email: string,
      password: string
  ) => Promise<boolean>;
  updateUserInDatabase: (userToUpdate: UserUI) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// function mapBackendUserToUI(raw: BackendUser): UserUI {
//   return {
//     id: raw.user_id,
//     username: raw.username,
//     firstName: raw.first_name,
//     lastName: raw.last_name,
//     email: raw.email,
//     avatar: raw.avatar || null,
//     role: raw.role.role_name,
//     skills: raw.skills.map((s) => s.skill_name),
//     courses: raw.courses.map((c) => c.course_name),
//     previousRoles: raw.previousRoles.map((r) => r.previous_role),
//     academicCredentials: raw.academicCredentials.map((a) => a.degree_name),
//     reviews:
//         raw.reviews?.map((r) => ({
//           id: r.review_id,
//           rank: r.rank,
//           comment: r.comment,
//           reviewedAt: r.reviewed_at,
//           updatedAt: r.updated_at,
//           lecturerId: r.lecturer_id,
//           applicationId: r.application_id,
//         })) || undefined,
//   };
// }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserUI | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSessionUser = async () => {
      setLoading(true);
      try {
        const rawUser = await getCurrentUser(); // GET /auth/me
        const uiUser: UserUI = mapBackendUserToUI(rawUser);
        setCurrentUser(uiUser);
      } catch (err: any) {
        // If the error is a 401, simply swallow it (no console.log).
        // Otherwise, log unexpected errors:
        const status = err.response?.status;
        if (status && status !== 401) {
          console.error("Unexpected error fetching session user:", err);
        }
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionUser();
  }, []);

  const login = async ( email: string, password: string ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const rawUser = await loginUser(email, password);
      const uiUser = mapBackendUserToUI(rawUser);
      setCurrentUser(uiUser);

      toaster.create({
        title: "Sign in Successful",
        description: `Welcome back, ${uiUser.firstName}!`,
        type: "success",
        duration: 5000,
      });
      return true;
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
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

  const signUp = async (
      firstName: string,
      lastName: string,
      username: string,
      email: string,
      password: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const rawUser = await signUpUser(
          firstName,
          lastName,
          username,
          email,
          password
      );
      const uiUser = mapBackendUserToUI(rawUser);
      setCurrentUser(uiUser);

      toaster.create({
        title: "Sign up Successful",
        description: `Welcome, ${uiUser.firstName}!`,
        type: "success",
        duration: 5000,
      });
      return true;
    } catch (err: any) {
      let errorMessage = "Sign up failed. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toaster.create({
        title: "Sign up Failed",
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
    setLoading(true);
    try {
      await logoutUser(); // POST /auth/logout
      setCurrentUser(null);

      toaster.create({
        title: "Signed out",
        description: "You have been logged out successfully.",
        type: "success",
        duration: 5000,
      });
      router.push("/");
    } catch (err) {
      console.error("Error during logout:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInDatabase = async (userToUpdate: UserUI) => {
    setLoading(true);
    setError(null);

    try {
      const payload = {
        first_name: userToUpdate.firstName,
        last_name: userToUpdate.lastName,
        username: userToUpdate.username,
        email: userToUpdate.email,
        avatar: userToUpdate.avatar,
        role_id:
            userToUpdate.role === "admin"
                ? 1
                : userToUpdate.role === "lecturer"
                    ? 2
                    : 3,
      };

      const { data: updatedRaw } = await api.put<BackendUser>(
          `/users/${userToUpdate.id}`,
          payload
      );
      const updatedUI = mapBackendUserToUI(updatedRaw);
      if (currentUser && currentUser.id === updatedUI.id) {
        setCurrentUser(updatedUI);
      }

      toaster.create({
        title: "Profile Updated",
        description: "Your profile has been updated.",
        type: "success",
        duration: 5000,
      });
    } catch (err: any) {
      let msg = "Failed to update user.";
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      toaster.create({
        title: "Update Failed",
        description: msg,
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <AuthContext.Provider
          value={{
            currentUser,
            loading,
            error,
            login,
            logout,
            signUp,
            updateUserInDatabase,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>");
  }
  return ctx;
}
