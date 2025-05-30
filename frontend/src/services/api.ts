import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api", // Adjust this to match your backend URL
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
        const response = await api.post("/auth/signUp", {firstName, lastName, username, email, password});
        return response.data;
    },
    loginUser: async (email: string, password: string) => {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    },
    getAllUsers: async () => {
        const response = await api.get("/users");
        return response.data;
    }
};
