import { useCallback } from 'react';
import { useGraphContext } from '../context/GraphContext';
import {
  createUser,
  updateUser,
  deleteUser,
  linkUsers,
  unlinkUsers,
} from '../services/api';
import type { CreateUserPayload, UpdateUserPayload } from '../types';

export function useUsers() {
  const { state, dispatch, refreshAll, addToast } = useGraphContext();

  const create = useCallback(
    async (payload: CreateUserPayload) => {
      try {
        const user = await createUser(payload);
        dispatch({ type: 'UPSERT_USER', payload: user });
        addToast('success', `User "${user.username}" created!`);
        await refreshAll();
        return user;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to create user';
        addToast('error', msg);
        throw err;
      }
    },
    [dispatch, addToast, refreshAll]
  );

  const update = useCallback(
    async (id: string, payload: UpdateUserPayload) => {
      try {
        const user = await updateUser(id, payload);
        dispatch({ type: 'UPSERT_USER', payload: user });
        addToast('success', `User "${user.username}" updated!`);
        await refreshAll();
        return user;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to update user';
        addToast('error', msg);
        throw err;
      }
    },
    [dispatch, addToast, refreshAll]
  );

  const remove = useCallback(
    async (id: string) => {
      try {
        await deleteUser(id);
        dispatch({ type: 'REMOVE_USER', payload: id });
        if (state.selectedUserId === id) {
          dispatch({ type: 'SELECT_USER', payload: null });
        }
        addToast('success', 'User deleted');
        await refreshAll();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete user';
        addToast('error', msg);
        throw err;
      }
    },
    [dispatch, addToast, refreshAll, state.selectedUserId]
  );

  const link = useCallback(
    async (id: string, targetId: string) => {
      try {
        await linkUsers(id, targetId);
        addToast('success', 'Users linked!');
        await refreshAll();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to link users';
        addToast('error', msg);
        throw err;
      }
    },
    [addToast, refreshAll]
  );

  const unlink = useCallback(
    async (id: string, targetId: string) => {
      try {
        await unlinkUsers(id, targetId);
        addToast('success', 'Users unlinked');
        await refreshAll();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to unlink users';
        addToast('error', msg);
        throw err;
      }
    },
    [addToast, refreshAll]
  );

  return { users: state.users, create, update, remove, link, unlink };
}