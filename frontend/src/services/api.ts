import axios from "axios";
import { FeedbackPayload, CreateUserPayload, UpdateUserPayload } from "../types";

const API = axios.create({
  baseURL: (import.meta as unknown as { env: { VITE_API_URL: string } }).env
    .VITE_API_URL || "http://localhost:5000/api",
});

export const fetchUsers = async () => {
  const res = await API.get("/users");
  return res.data.data;
};

export const createUser = async (data: CreateUserPayload) => {
  const res = await API.post("/users", data);
  return res.data.data;
};

export const updateUser = async (id: string, data: UpdateUserPayload) => {
  const res = await API.put(`/users/${id}`, data);
  return res.data.data;
};

export const deleteUser = async (id: string) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

export const linkUsers = async (id: string, friendId: string) => {
  const res = await API.post(`/users/${id}/link`, { friendId });
  return res.data;
};

export const unlinkUsers = async (id: string, friendId: string) => {
  const res = await API.delete(`/users/${id}/unlink`, { data: { friendId } });
  return res.data;
};

export const fetchGraph = async () => {
  const res = await API.get("/graph");
  return res.data.data;
};

export const fetchRecommendations = async (id: string) => {
  const res = await API.get(`/users/${id}/recommendations`);
  return res.data.data;
};

export const submitFeedback = async (id: string, payload: FeedbackPayload) => {
  const res = await API.post(`/users/${id}/recommendations/feedback`, payload);
  return res.data;
};