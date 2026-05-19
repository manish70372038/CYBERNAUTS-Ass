import { useState, useCallback } from 'react';
import { fetchRecommendations, submitFeedback } from '../services/api';
import type { RecommendationResponse, FeedbackPayload } from '../types';
import { useGraphContext } from '../context/GraphContext';
import { debounce } from '../utils/debounce';

export function useRecommendations() {
  const { addToast } = useGraphContext();
  const [data, setData] = useState<RecommendationResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetch = useCallback(
    debounce(async (userId: string) => {
      setLoading(true);
      try {
        const res = await fetchRecommendations(userId);
        setData(res);
      } catch {
        addToast('error', 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    }, 400),
    [addToast]
  );

  const sendFeedback = useCallback(
    async (userId: string, payload: FeedbackPayload) => {
      try {
        await submitFeedback(userId, payload);
        addToast('success', 'Feedback recorded!');
        fetch(userId); // refresh
      } catch {
        addToast('error', 'Failed to submit feedback');
      }
    },
    [addToast, fetch]
  );

  return { recommendations: data, loading, fetch, sendFeedback };
}