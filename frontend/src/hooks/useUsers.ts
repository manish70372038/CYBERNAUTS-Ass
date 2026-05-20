import { useState, useEffect } from "react";
import { User, CreateUserPayload, UpdateUserPayload } from "../types";
import {
  fetchUsers, createUser, updateUser,
  deleteUser, linkUsers, unlinkUsers,
} from "../services/api";
import { useGraphContext } from "../context/GraphContext";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { refreshAll, addToast } = useGraphContext();

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      addToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUsers(); }, []);

  const create = async (payload: CreateUserPayload) => {
    try {
      await createUser(payload);
      await loadUsers();
      await refreshAll();
      addToast("User created!", "success");
    } catch {
      addToast("Failed to create user", "error");
    }
  };

  const update = async (id: string, payload: UpdateUserPayload) => {
    try {
      await updateUser(id, payload);
      await loadUsers();
      await refreshAll();
      addToast("User updated!", "success");
    } catch {
      addToast("Failed to update user", "error");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteUser(id);
      await loadUsers();
      await refreshAll();
      addToast("User deleted!", "success");
    } catch {
      addToast("Cannot delete: unlink friends first", "error");
    }
  };

  const link = async (id: string, friendId: string) => {
    try {
      await linkUsers(id, friendId);
      await loadUsers();
      await refreshAll();
      addToast("Friendship created!", "success");
    } catch {
      addToast("Failed to link users", "error");
    }
  };

  const unlink = async (id: string, friendId: string) => {
    try {
      await unlinkUsers(id, friendId);
      await loadUsers();
      await refreshAll();
      addToast("Friendship removed!", "success");
    } catch {
      addToast("Failed to unlink users", "error");
    }
  };

  return { users, loading, loadUsers, create, update, remove, link, unlink };
};