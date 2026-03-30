import { describe, expect, it } from "vitest";
import { signToken, verifyToken } from "../src/lib/jwt.js";

describe("jwt helpers", () => {
  it("signs and verifies a token", () => {
    const token = signToken(42);
    const payload = verifyToken(token);

    expect(payload.userId).toBe(42);
  });
});
