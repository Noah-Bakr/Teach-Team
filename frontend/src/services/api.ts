import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3001/api",
    withCredentials: true
});

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
}

export const authApi = {
    createUser: async (firstName: string, lastName: string, username: string, email: string, password: string) => {
        const response = await api.post("/auth/signUp", { firstName, lastName, username, email, password }, { withCredentials: true });
        return response.data;
    },
    loginUser: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password }, { withCredentials: true });
        return response.data;
    },
    logout: async () => {
        await api.post("/auth/logout", {}, { withCredentials: true });
    },
    getAllUsers: async () => {
        const response = await api.get("/auth/me", { withCredentials: true });
        return response.data;
    },
    getUserById: async (id: string) => {
        const response = await api.get(`/users/user/${id}`);
        return response.data;
    },
    getCurrentUser: async () => {
        const response = await api.get("/auth/me", { withCredentials: true });
        return response.data;
    }

};
