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

describe("Conflict Prevention", () => {
  let userAId: string;
  let userBId: string;

  test("Setup users and link them", async () => {
    const a = await request(app).post("/api/users").send({ username: "TestA", age: 22, hobbies: [] });
    const b = await request(app).post("/api/users").send({ username: "TestB", age: 24, hobbies: [] });
    userAId = a.body.data.id;
    userBId = b.body.data.id;
    await request(app).post(`/api/users/${userAId}/link`).send({ friendId: userBId });
    expect(a.status).toBe(201);
  });

  test("Cannot delete user with active friendships", async () => {
    const res = await request(app).delete(`/api/users/${userAId}`);
    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/unlink/i);
  });

  test("Can delete after unlinking", async () => {
    await request(app).delete(`/api/users/${userAId}/unlink`).send({ friendId: userBId });
    const res = await request(app).delete(`/api/users/${userAId}`);
    expect(res.status).toBe(200);
  });
});