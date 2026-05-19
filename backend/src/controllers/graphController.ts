import { Request, Response, NextFunction } from "express";
import User from "../models/User";

export const getGraph = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const users = await User.find();

    const nodes = users.map((user) => ({
      id: user.id,
      username: user.username,
      age: user.age,
      hobbies: user.hobbies,
      popularityScore: user.popularityScore,
    }));

    const edgeSet = new Set<string>();
    const edges: { source: string; target: string }[] = [];

    for (const user of users) {
      for (const friendId of user.friends) {
        const edgeKey = [user.id, friendId].sort().join("-");
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({ source: user.id, target: friendId });
        }
      }
    }

    res.json({ success: true, data: { nodes, edges } });
  } catch (err) {
    next(err);
  }
};