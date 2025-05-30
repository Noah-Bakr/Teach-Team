import { api } from './api';

export interface Comment {
    comment_id: number;
    comment:     string;
    created_at:  string;
    updated_at:  string;
    application: { application_id: number };
    lecturer:    { user_id: number };
}

export interface NewComment {
    comment:        string;
    application_id: number;
    lecturer_id:    number;
}

export interface UpdateComment {
    comment?: string;
}

export const commentApi = {
    async listAll(): Promise<Comment[]> {
        const resp = await api.get<Comment[]>('/comments');
        return resp.data;
    },

    // get one by id
    async getOne(id: number): Promise<Comment> {
        const resp = await api.get<Comment>(`/comments/${id}`);
        return resp.data;
    },

    // create
    async create(data: NewComment): Promise<Comment> {
        const resp = await api.post<Comment>('/comments', data);
        return resp.data;
    },

    // update partial
    async update(id: number, data: UpdateComment): Promise<Comment> {
        const resp = await api.put<Comment>(`/comments/${id}`, data);
        return resp.data;
    },

    // delete
    async remove(id: number): Promise<void> {
        await api.delete(`/comments/${id}`);
    },
};
