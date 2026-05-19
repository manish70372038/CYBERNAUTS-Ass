import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { generateId } from "../utils/helpers";
import {
  recomputePopularity,
  recomputeAllFriendsPopularity,
} from "../services/popularityService";

// GET /api/users
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find();
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// POST /api/users
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { username, age, hobbies } = req.body;

    const existing = await User.findOne({ username });
    if (existing) {
      res.status(409).json({ success: false, message: "Username already exists" });
      return;
    }

    const user = new User({
      id: generateId(),
      username,
      age,
      hobbies: hobbies || [],
      friends: [],
      popularityScore: 0,
    });

    await user.save();
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, age, hobbies } = req.body;

    const user = await User.findOne({ id });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (username) user.username = username;
    if (age) user.age = age;
    if (hobbies) user.hobbies = hobbies;

    await user.save();
    await recomputePopularity(id);
    await recomputeAllFriendsPopularity(user.friends);

    const updated = await User.findOne({ id });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ id });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (user.friends.length > 0) {
      res.status(409).json({
        success: false,
        message: "Cannot delete user with active friendships. Unlink first.",
      });
      return;
    }

    await User.deleteOne({ id });
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/:id/link
export const linkUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (id === friendId) {
      res.status(400).json({ success: false, message: "Cannot link user to themselves" });
      return;
    }

    const user = await User.findOne({ id });
    const friend = await User.findOne({ id: friendId });

    if (!user || !friend) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (user.friends.includes(friendId)) {
      res.status(409).json({ success: false, message: "Friendship already exists" });
      return;
    }

    // Mutual friendship — store both sides
    user.friends.push(friendId);
    friend.friends.push(id);

    await user.save();
    await friend.save();

    await recomputePopularity(id);
    await recomputePopularity(friendId);

    res.json({ success: true, message: "Friendship created", data: { user, friend } });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id/unlink
export const unlinkUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findOne({ id });
    const friend = await User.findOne({ id: friendId });

    if (!user || !friend) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    if (!user.friends.includes(friendId)) {
      res.status(409).json({ success: false, message: "Friendship does not exist" });
      return;
    }

    user.friends = user.friends.filter((fid) => fid !== friendId);
    friend.friends = friend.friends.filter((fid) => fid !== id);

    await user.save();
    await friend.save();

    await recomputePopularity(id);
    await recomputePopularity(friendId);

    res.json({ success: true, message: "Friendship removed" });
  } catch (err) {
    next(err);
  }
};