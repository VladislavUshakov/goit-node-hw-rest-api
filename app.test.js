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
    await request(app).post("/api/auth/register").send({
      email: "jestTestUser@email.com",
      password: "jestTestUser",
    });

    const loginedUser = await request(app).post("/api/auth/login").send({
      email: "jestTestUser@email.com",
      password: "jestTestUser",
    });

    await request(app)
      .delete("/api/users")
      .set("Authorization", `Bearer ${loginedUser.body.token}`);

    expect(loginedUser.statusCode).toBe(200);
    expect(loginedUser.body).toHaveProperty("token");
    expect(loginedUser.body).toHaveProperty("user.email");
    expect(loginedUser.body).toHaveProperty("user.subscription");
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
});
