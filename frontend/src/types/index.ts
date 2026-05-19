export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: string;
  popularityScore: number;
}

export interface GraphNode {
  id: string;
  position: { x: number; y: number };
  data: {
    user: User;
    label: string;
  };
  type: 'highScore' | 'lowScore';
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  animated?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Recommendation {
  userId: string;
  username: string;
  score: number;
  reason: string;
  sourceSignals: string[];
}

export interface HobbyRecommendation {
  hobby: string;
  score: number;
  reason: string;
  sourceSignals: string[];
}

export interface RecommendationResponse {
  friendRecommendations: Recommendation[];
  hobbyRecommendations: HobbyRecommendation[];
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

export interface LinkPayload {
  targetUserId: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface FeedbackPayload {
  recommendationId: string;
  type: 'friend' | 'hobby';
  accepted: boolean;
}