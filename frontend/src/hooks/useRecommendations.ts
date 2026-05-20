import { useState } from "react";
import { RecommendationResponse, FeedbackPayload } from "../types";
import { fetchRecommendations, submitFeedback } from "../services/api";
import { useGraphContext } from "../context/GraphContext";

export const useRecommendations = () => {
  const [recommendations, setRecommendations] =
    useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useGraphContext();

  const load = async (userId: string) => {
    setLoading(true);
    try {
      const data = await fetchRecommendations(userId);
      setRecommendations(data);
    } catch {
      addToast("Failed to load recommendations", "error");
    } finally {
      setLoading(false);
    }
  };

  const feedback = async (userId: string, payload: FeedbackPayload) => {
    try {
      await submitFeedback(userId, payload);
      await load(userId);
      addToast("Feedback recorded!", "success");
    } catch {
      addToast("Failed to submit feedback", "error");
    }
  };

  return { recommendations, loading, load, feedback };
};