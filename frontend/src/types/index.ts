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

export interface GraphData {
  nodes: {
    id: string;
    username: string;
    age: number;
    hobbies: string[];
    popularityScore: number;
  }[];
  edges: {
    source: string;
    target: string;
  }[];
}

export interface FeedbackPayload {
  type: "friend" | "hobby";
  value: string;
  action: "accept" | "reject";
}

export interface Recommendation {
  userId?: string;
  username?: string;
  hobby?: string;
  score: number;
  reason: string;
  sourceSignals: string[];
}