import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import User from "../src/models/User";
import connectDB from "../src/config/db";

beforeAll(async () => {
  await connectDB();
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe("Relationship API", () => {
  let userAId: string;
  let userBId: string;

  test("Create two users", async () => {
    const a = await request(app).post("/api/users").send({ username: "Alice", age: 25, hobbies: ["chess"] });
    const b = await request(app).post("/api/users").send({ username: "Bob", age: 28, hobbies: ["chess", "gaming"] });
    userAId = a.body.data.id;
    userBId = b.body.data.id;
    expect(a.status).toBe(201);
    expect(b.status).toBe(201);
  });

  test("Link two users as friends", async () => {
    const res = await request(app).post(`/api/users/${userAId}/link`).send({ friendId: userBId });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test("Prevent duplicate friendship", async () => {
    const res = await request(app).post(`/api/users/${userAId}/link`).send({ friendId: userBId });
    expect(res.status).toBe(409);
  });
});