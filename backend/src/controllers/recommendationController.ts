import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import {
  getFriendRecommendations,
  getHobbyRecommendations,
} from "../services/recommendationService";

// GET /api/users/:id/recommendations
export const getRecommendations = async (
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

    const [friends, hobbies] = await Promise.all([
      getFriendRecommendations(id),
      getHobbyRecommendations(id),
    ]);

    res.json({
      success: true,
      data: {
        friendRecommendations: friends,
        hobbyRecommendations: hobbies,
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/users/:id/recommendations/feedback
export const submitFeedback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { type, value, action } = req.body;

    // 1. यूजर ढूंढो
    const user = await User.findOne({ id });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    // 2. सेफ्टी चेक: सुनिश्चित करो कि feedbackData ऑब्जेक्ट मौजूद हो
    if (!user.feedbackData) {
      user.feedbackData = { accepted: [], rejected: [] };
    }
    if (!user.feedbackData.accepted) user.feedbackData.accepted = [];
    if (!user.feedbackData.rejected) user.feedbackData.rejected = [];

    // 3. एक्शन को क्लीन करो (लोअरकेस और ट्रिम ताकि फ्रंटएंड की कोई गलती न पकड़े)
    const cleanAction = String(action).toLowerCase().trim();

    if (cleanAction === "accept") {
      if (!user.feedbackData.accepted.includes(value)) {
        user.feedbackData.accepted.push(value);
      }
      user.feedbackData.rejected = user.feedbackData.rejected.filter(
        (v) => v !== value
      );
    } else if (cleanAction === "reject") {
      if (!user.feedbackData.rejected.includes(value)) {
        user.feedbackData.rejected.push(value);
      }
      user.feedbackData.accepted = user.feedbackData.accepted.filter(
        (v) => v !== value
      );
    } else {
      
      res.status(400).json({ 
        success: false, 
        message: `Invalid action '${action}'. Use 'accept' or 'reject'` 
      });
      return;
    }

    
    user.markModified('feedbackData');
    
    await user.save();
    res.json({ success: true, message: "Feedback recorded" });
  } catch (err) {
    next(err);
  }
};