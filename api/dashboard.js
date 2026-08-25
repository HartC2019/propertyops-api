import express from "express";

import requireUser from "#middleware/requireUser";
import { getDashboardSummary } from "#db/queries/dashboard";

const router = express.Router();

router.use(requireUser);

router.get("/", async (req, res, next) => {
  try {
    const summary = await getDashboardSummary(req.user.id);

    res.send(summary);
  } catch (err) {
    next(err);
  }
});

export default router;
