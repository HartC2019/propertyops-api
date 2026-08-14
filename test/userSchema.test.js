import { describe, it, expect } from "vitest";
import {
  validateRegister as registerSchema,
  validateLogin as loginSchema,
} from "#api/users";

describe("userSchema validators", () => {
  it("accepts valid register payload", () => {
    const result = registerSchema({
      username: "alice",
      password: "s3cretPA$$",
    });
    expect(result.success).toBe(true);
    expect(result.data.username).toBe("alice");
  });

  it("rejects short username", () => {
    const result = registerSchema({ username: "ab", password: "longenough" });
    expect(result.success).toBe(false);
    expect(result.issues.some((i) => i.path === "username")).toBe(true);
  });

  it("rejects short password", () => {
    const result = registerSchema({ username: "alice", password: "short" });
    expect(result.success).toBe(false);
    expect(result.issues.some((i) => i.path === "password")).toBe(true);
  });

  it("login requires username and password", () => {
    const ok = loginSchema({ username: "bob", password: "pw" });
    expect(ok.success).toBe(true);

    const bad = loginSchema({ username: "bob" });
    expect(bad.success).toBe(false);
    expect(bad.issues.some((i) => i.path === "password")).toBe(true);
  });
});
