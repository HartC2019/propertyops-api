import express from "express";
import requireUser from "#middleware/requireUser";
import {
  createProperty,
  getPropertiesByUser,
  getPropertyById,
  updateProperty,
  deleteProperty,
} from "#db/queries/properties";

const router = express.Router();

router.use(requireUser);

function makeIssue(path, message) {
  return { path, message };
}

function toNumberMaybe(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

export function validateCreateProperty(body) {
  const issues = [];
  const data = {};

  if (
    !body.title ||
    typeof body.title !== "string" ||
    body.title.trim().length === 0
  ) {
    issues.push(makeIssue("title", "Title is required."));
  } else if (body.title.length > 200) {
    issues.push(makeIssue("title", "Title must be at most 200 characters."));
  } else {
    data.title = body.title.trim();
  }

  if (
    !body.address ||
    typeof body.address !== "string" ||
    body.address.trim().length === 0
  ) {
    issues.push(makeIssue("address", "Address is required."));
  } else {
    data.address = body.address.trim();
  }

  const priceVal = toNumberMaybe(body.price);
  if (priceVal === null || priceVal <= 0) {
    issues.push(makeIssue("price", "Price must be a positive number."));
  } else {
    data.price = priceVal;
  }

  if (body.bedrooms !== undefined) {
    const v = toNumberMaybe(body.bedrooms);
    if (v === null || !Number.isInteger(v) || v < 0) {
      issues.push(
        makeIssue("bedrooms", "Bedrooms must be a non-negative integer."),
      );
    } else {
      data.bedrooms = v;
    }
  }

  if (body.bathrooms !== undefined) {
    const v = toNumberMaybe(body.bathrooms);
    if (v === null || !Number.isInteger(v) || v < 0) {
      issues.push(
        makeIssue("bathrooms", "Bathrooms must be a non-negative integer."),
      );
    } else {
      data.bathrooms = v;
    }
  }

  if (body.propertyType !== undefined) {
    const allowedPropertyTypes = ["house", "apartment", "condo", "land"];
    if (
      typeof body.propertyType !== "string" ||
      !allowedPropertyTypes.includes(body.propertyType)
    ) {
      issues.push(
        makeIssue(
          "propertyType",
          `propertyType must be one of: ${allowedPropertyTypes.join(", ")}`,
        ),
      );
    } else {
      data.propertyType = body.propertyType;
    }
  }

  if (body.status !== undefined) {
    const allowedStatus = ["available", "pending", "sold"];
    if (
      typeof body.status !== "string" ||
      !allowedStatus.includes(body.status)
    ) {
      issues.push(
        makeIssue(
          "status",
          `status must be one of: ${allowedStatus.join(", ")}`,
        ),
      );
    } else {
      data.status = body.status;
    }
  }

  return { success: issues.length === 0, data, issues };
}

export function validateUpdateProperty(body) {
  const issues = [];
  const data = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || body.title.trim().length === 0) {
      issues.push(makeIssue("title", "Title must be a non-empty string."));
    } else if (body.title.length > 200) {
      issues.push(makeIssue("title", "Title must be at most 200 characters."));
    } else {
      data.title = body.title.trim();
    }
  }

  if (body.address !== undefined) {
    if (typeof body.address !== "string" || body.address.trim().length === 0) {
      issues.push(makeIssue("address", "Address must be a non-empty string."));
    } else {
      data.address = body.address.trim();
    }
  }

  if (body.price !== undefined) {
    const priceVal = toNumberMaybe(body.price);
    if (priceVal === null || priceVal <= 0) {
      issues.push(makeIssue("price", "Price must be a positive number."));
    } else {
      data.price = priceVal;
    }
  }

  if (body.bedrooms !== undefined) {
    const v = toNumberMaybe(body.bedrooms);
    if (v === null || !Number.isInteger(v) || v < 0) {
      issues.push(
        makeIssue("bedrooms", "Bedrooms must be a non-negative integer."),
      );
    } else {
      data.bedrooms = v;
    }
  }

  if (body.bathrooms !== undefined) {
    const v = toNumberMaybe(body.bathrooms);
    if (v === null || !Number.isInteger(v) || v < 0) {
      issues.push(
        makeIssue("bathrooms", "Bathrooms must be a non-negative integer."),
      );
    } else {
      data.bathrooms = v;
    }
  }

  if (body.propertyType !== undefined) {
    const allowedPropertyTypes = ["house", "apartment", "condo", "land"];
    if (
      typeof body.propertyType !== "string" ||
      !allowedPropertyTypes.includes(body.propertyType)
    ) {
      issues.push(
        makeIssue(
          "propertyType",
          `propertyType must be one of: ${allowedPropertyTypes.join(", ")}`,
        ),
      );
    } else {
      data.propertyType = body.propertyType;
    }
  }

  if (body.status !== undefined) {
    const allowedStatus = ["available", "pending", "sold"];
    if (
      typeof body.status !== "string" ||
      !allowedStatus.includes(body.status)
    ) {
      issues.push(
        makeIssue(
          "status",
          `status must be one of: ${allowedStatus.join(", ")}`,
        ),
      );
    } else {
      data.status = body.status;
    }
  }

  return { success: issues.length === 0, data, issues };
}

router.post("/", async (req, res, next) => {
  try {
    const validation = validateCreateProperty(req.body ?? {});
    if (!validation.success)
      return res
        .status(400)
        .json({ error: "validation", issues: validation.issues });

    const property = await createProperty({
      ...validation.data,
      user_id: req.user.id,
    });

    res.status(201).send(property);
  } catch (err) {
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const properties = await getPropertiesByUser(req.user.id);

    res.send(properties);
  } catch (err) {
    next(err);
  }
});

router.get("/:propertyId", async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.propertyId);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    res.send(property);
  } catch (err) {
    next(err);
  }
});

router.put("/:propertyId", async (req, res, next) => {
  try {
    const existingProperty = await getPropertyById(req.params.propertyId);

    if (!existingProperty) {
      return res.status(404).send("Property not found.");
    }

    if (existingProperty.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    const validation = validateUpdateProperty(req.body ?? {});
    if (!validation.success)
      return res
        .status(400)
        .json({ error: "validation", issues: validation.issues });

    const updatedProperty = await updateProperty(req.params.propertyId, {
      ...validation.data,
      user_id: existingProperty.user_id,
    });

    res.send(updatedProperty);
  } catch (err) {
    next(err);
  }
});

router.delete("/:propertyId", async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.propertyId);

    if (!property) {
      return res.status(404).send("Property not found.");
    }

    if (property.user_id !== req.user.id) {
      return res.status(403).send("Forbidden.");
    }

    const deletedProperty = await deleteProperty(req.params.propertyId);

    res.send(deletedProperty);
  } catch (err) {
    next(err);
  }
});

export default router;
