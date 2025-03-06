
import { create } from "zustand";
import axios from "axios";

export interface Comment {
    id: number;
    postId: number;
    body: string;
}

interface CommentStore {
    comments: Record<number, Comment[]>;
    fetchComments: (postId: number) => Promise<void>;
    addComment: (postId: number, body: string) => Promise<void>;
}

export const useCommentsStore = create<CommentStore>((set, get) => ({
    comments: {},

    fetchComments: async (postId) => {
        try {
            const { data } = await axios.get(`https://dummyjson.com/comments/post/${postId}`);
            set((state) => ({ comments: { ...state.comments, [postId]: data.comments } }));
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    },

    addComment: async (postId, body) => {
        try {
            const { data } = await axios.post("https://dummyjson.com/comments/add", {
                postId,
                body,
                userId: 1,
            });
            set((state) => ({
                comments: {
                    ...state.comments,
                    [postId]: [...(state.comments[postId] || []), data],
                },
            }));
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    },
}));
