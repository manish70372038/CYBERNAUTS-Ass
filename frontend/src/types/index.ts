export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  popularityScore: number;
  createdAt: string;
  feedbackData: {
    accepted: string[];
    rejected: string[];
  };
}

export interface GraphNode {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  popularityScore: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Recommendation {
  userId?: string;
  username?: string;
  hobby?: string;
  score: number;
  reason: string;
  sourceSignals: string[];
}

export interface HobbyRecommendation extends Recommendation {
  hobby: string;
}

export interface RecommendationResponse {
  friendRecommendations: Recommendation[];
  hobbyRecommendations: HobbyRecommendation[];
}

export interface FeedbackPayload {
  type: "friend" | "hobby";
  value: string;
  action: "accept" | "reject";
}

export interface CreateUserPayload {
  username: string;
  age: number;
  hobbies: string[];
}

export interface UpdateUserPayload {
  username?: string;
  age?: number;
  hobbies?: string[];
}

export interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
}