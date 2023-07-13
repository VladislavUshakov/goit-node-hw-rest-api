const request = require("supertest");
const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const { DB_HOST } = process.env;

describe("Test auth path", () => {
  beforeAll(() => {
    mongoose.connect(DB_HOST);
  });

  test("'/api/auth/login' POST", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "user2@email.com",
      password: "user2",
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("user.email");
    expect(response.body).toHaveProperty("user.subscription");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
