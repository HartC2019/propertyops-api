import express from "express";
const router = express.Router();
export default router;

import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";

function makeIssue(path, message) {
  return { path, message };
}

export function validateRegister(body) {
  const issues = [];
  const data = {};

  if (typeof body.username !== "string" || body.username.trim().length < 3) {
    issues.push(
      makeIssue("username", "Username must be at least 3 characters."),
    );
  } else if (body.username.length > 150) {
    issues.push(
      makeIssue("username", "Username must be at most 150 characters."),
    );
  } else {
    data.username = body.username.trim();
  }

  if (typeof body.password !== "string" || body.password.length < 8) {
    issues.push(
      makeIssue("password", "Password must be at least 8 characters."),
    );
  }

  return { success: issues.length === 0, data, issues };
}

export function validateLogin(body) {
  const issues = [];
  const data = {};

  if (!body.username || typeof body.username !== "string") {
    issues.push(makeIssue("username", "Username is required."));
  } else {
    data.username = body.username;
  }

  if (!body.password || typeof body.password !== "string") {
    issues.push(makeIssue("password", "Password is required."));
  }

  return { success: issues.length === 0, data, issues };
}

router.route("/register").post(async (req, res) => {
  const validation = validateRegister(req.body ?? {});
  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "validation", issues: validation.issues });
  }

  const { username, password } = validation.data;
  const user = await createUser(username, password);

  const token = await createToken({ id: user.id });
  res.status(201).send(token);
});

router.route("/login").post(async (req, res) => {
  const validation = validateLogin(req.body ?? {});
  if (!validation.success) {
    return res
      .status(400)
      .json({ error: "validation", issues: validation.issues });
  }

  const { username, password } = validation.data;
  const user = await getUserByUsernameAndPassword(username, password);
  if (!user) return res.status(401).send("Invalid username or password.");

  const token = await createToken({ id: user.id });
  res.send(token);
});
