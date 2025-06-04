import { api } from "./api";
import { User as BackendUser } from "./api/userApi";

export async function loginUser(
    email: string,
    password: string
): Promise<BackendUser> {
    const { data } = await api.post<{ message: string; user: BackendUser }>(
        "/auth/login",
        { email, password }, { withCredentials: true }
    );
    return data.user;
}

export async function signUpUser(
    firstName: string,
    lastName: string,
    username: string,
    email: string,
    password: string
): Promise<BackendUser> {
    const { data } = await api.post<{ message: string; user: BackendUser }>(
        "/auth/signUp",
        { firstName, lastName, username, email, password }, { withCredentials: true }
    );
    return data.user;
}

export async function getCurrentUser(): Promise<BackendUser> {
    const { data } = await api.get<{ user: BackendUser }>("/auth/me", { withCredentials: true });
    return data.user;
}

export async function logoutUser(): Promise<void> {
    await api.post("/auth/logout");
}

