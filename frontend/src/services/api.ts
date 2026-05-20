import axios from "axios";
import { FeedbackPayload, CreateUserPayload, UpdateUserPayload } from "../types";

const BASE = (import.meta as any).env?.VITE_API_URL || "http://localhost:5000/api";

const API = axios.create({ baseURL: BASE });

export const fetchUsers = async () => (await API.get("/users")).data.data;
export const createUser = async (d: CreateUserPayload) => (await API.post("/users", d)).data.data;
export const updateUser = async (id: string, d: UpdateUserPayload) => (await API.put(`/users/${id}`, d)).data.data;
export const deleteUser = async (id: string) => (await API.delete(`/users/${id}`)).data;
export const linkUsers = async (id: string, friendId: string) => (await API.post(`/users/${id}/link`, { friendId })).data;
export const unlinkUsers = async (id: string, friendId: string) => (await API.delete(`/users/${id}/unlink`, { data: { friendId } })).data;
export const fetchGraph = async () => (await API.get("/graph")).data.data;
export const fetchAllUsers = async () => (await API.get("/users")).data.data;
export const fetchRecommendations = async (id: string) => (await API.get(`/users/${id}/recommendations`)).data.data;
export const submitFeedback = async (id: string, payload: FeedbackPayload) => (await API.post(`/users/${id}/recommendations/feedback`, payload)).data;