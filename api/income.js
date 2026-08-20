import express from "express";
import requireUser from "#middleware/requireUser";
import {
  createIncome,
  getIncomeByProperty,
  getIncomeById,
  deleteIncome,
} from "#db/queries/income";
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

    const income = await createIncome(req.body);

    res.status(201).send(income);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    console.log("QUERY:", req.query);

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

    const income = await getIncomeByProperty(propertyId);

    res.send(income);
  } catch (err) {
    next(err);
  }
});

router.get("/:incomeId", async (req, res, next) => {
  try {
    const income = await getIncomeById(req.params.incomeId);

    if (!income) {
      return res.status(404).send("Income not found.");
    }

    const property = await getPropertyById(income.property_id);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    res.send(income);
  } catch (err) {
    next(err);
  }
});

router.delete("/:incomeId", async (req, res, next) => {
  try {
    const income = await getIncomeById(req.params.incomeId);

    if (!income) {
      return res.status(404).send("Income not found.");
    }

    const property = await getPropertyById(income.property_id);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    const deletedIncome = await deleteIncome(req.params.incomeId);

    res.send(deletedIncome);
  } catch (err) {
    next(err);
  }
});

export default router;
