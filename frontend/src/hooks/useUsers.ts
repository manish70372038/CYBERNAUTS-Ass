import { useGraphContext } from "../context/GraphContext";
import { createUser, updateUser, deleteUser, linkUsers, unlinkUsers } from "../services/api";
import { CreateUserPayload, UpdateUserPayload } from "../types";

export const useUsers = () => {
  const { users, loading, refreshAll, addToast } = useGraphContext();

  const create = async (payload: CreateUserPayload) => {
    try {
      await createUser(payload);
      await refreshAll();
      addToast(`User "${payload.username}" created!`, "success");
    } catch (e: any) {
      addToast(e?.response?.data?.message || "Failed to create user", "error");
    }
  };

  const update = async (id: string, payload: UpdateUserPayload) => {
    try {
      await updateUser(id, payload);
      await refreshAll();
      addToast("User updated!", "success");
    } catch {
      addToast("Failed to update user", "error");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteUser(id);
      await refreshAll();
      addToast("User deleted!", "success");
    } catch (e: any) {
      addToast(e?.response?.data?.message || "Unlink friends first!", "error");
    }
  };

  const link = async (id: string, friendId: string) => {
    try {
      await linkUsers(id, friendId);
      await refreshAll();
      addToast("Friendship created!", "success");
    } catch (e: any) {
      addToast(e?.response?.data?.message || "Failed to link", "error");
    }
  };

  const unlink = async (id: string, friendId: string) => {
    try {
      await unlinkUsers(id, friendId);
      await refreshAll();
      addToast("Friendship removed!", "success");
    } catch {
      addToast("Failed to unlink", "error");
    }
  };

  return { users, loading, create, update, remove, link, unlink };
};