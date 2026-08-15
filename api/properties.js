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

router.post("/", async (req, res, next) => {
  try {
    const property = await createProperty({
      ...req.body,
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

    const updatedProperty = await updateProperty(req.params.propertyId, {
      ...req.body,
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
