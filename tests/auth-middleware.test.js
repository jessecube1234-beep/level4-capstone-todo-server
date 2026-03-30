import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";

describe("auth middleware", () => {
  it("returns 401 when header is missing", async () => {
    const app = createApp();
    const response = await request(app).get("/todos");

    expect(response.status).toBe(401);
    expect(response.body.message).toMatch(/authorization/i);
  });
});
