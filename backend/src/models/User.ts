import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
  friends: string[];
  createdAt: Date;
  popularityScore: number;
  feedbackData: {
    accepted: string[];
    rejected: string[];
  };
}

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    age: { type: Number, required: true, min: 1 },
    hobbies: { type: [String], default: [] },
    friends: { type: [String], default: [] },
    popularityScore: { type: Number, default: 0 },
    feedbackData: {
      accepted: { type: [String], default: [] },
      rejected: { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);