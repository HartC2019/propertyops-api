import express from "express";

import requireUser from "#middleware/requireUser";

import {
  createExpense,
  getExpensesByProperty,
  getExpenseById,
  deleteExpense,
} from "#db/queries/expenses";

import { getPropertyById } from "#db/queries/properties";

const router = express.Router();

router.use(requireUser);

router.post("/", async (req, res, next) => {
  try {
    const property = await getPropertyById(req.body.property_id);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    const expense = await createExpense(req.body);

    res.status(201).send(expense);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const propertyId = req.query.property_id;

    if (!propertyId) {
      return res.status(400).send("property_id is required.");
    }

    const property = await getPropertyById(propertyId);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    const expenses = await getExpensesByProperty(propertyId);

    res.send(expenses);
  } catch (err) {
    next(err);
  }
});

router.get("/:expenseId", async (req, res, next) => {
  try {
    const expense = await getExpenseById(req.params.expenseId);

    if (!expense) {
      return res.status(404).send("Expense not found.");
    }

    const property = await getPropertyById(expense.property_id);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    res.send(expense);
  } catch (err) {
    next(err);
  }
});

router.delete("/:expenseId", async (req, res, next) => {
  try {
    const expense = await getExpenseById(req.params.expenseId);

    if (!expense) {
      return res.status(404).send("Expense not found.");
    }

    const property = await getPropertyById(expense.property_id);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    const deletedExpense = await deleteExpense(req.params.expenseId);

    res.send(deletedExpense);
  } catch (err) {
    next(err);
  }
});

export default router;
