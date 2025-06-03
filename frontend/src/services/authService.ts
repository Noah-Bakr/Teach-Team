import { api } from "./api";
import { UserUI } from "../types/userTypes";

export async function signUpUser(firstName: string, lastName: string, username: string, email: string, password: string) : Promise<UserUI> {
    const response = await api.post("/auth/signUp", { firstName, lastName, username, email, password }, { withCredentials: true });
    return response.data;
}

export async function loginUser(email: string, password: string): Promise<UserUI> {
    const response = await api.post("/auth/login", { email, password }, { withCredentials: true });
    return response.data;
}

export async function logoutUser(): Promise<void> {
    await api.post("/auth/logout", {}, { withCredentials: true });
}

export async function getCurrentUser(): Promise<UserUI> {
    const response = await api.get("/auth/me", { withCredentials: true });
    return response.data;
}