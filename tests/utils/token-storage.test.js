import { expect, test } from "vitest";
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken
} from "@/auth/token-storage.js";

test("stores and clears token", () => {
  clearStoredToken();
  expect(getStoredToken()).toBeNull();

  setStoredToken("abc123");
  expect(getStoredToken()).toBe("abc123");

  clearStoredToken();
  expect(getStoredToken()).toBeNull();
});
