import { describe, it, expect } from "vitest";
import {
  validateCreateProperty as createPropertySchema,
  validateUpdateProperty as updatePropertySchema,
} from "#api/properties";

describe("propertySchema validators", () => {
  it("accepts valid create payload", () => {
    const payload = {
      title: "Nice house",
      address: "123 Main St",
      price: 250000,
    };
    const result = createPropertySchema(payload);
    expect(result.success).toBe(true);
    expect(result.data.title).toBe("Nice house");
  });

  it("rejects missing required fields", () => {
    const result = createPropertySchema({});
    expect(result.success).toBe(false);
    expect(result.issues.some((i) => i.path === "title")).toBe(true);
    expect(result.issues.some((i) => i.path === "address")).toBe(true);
    expect(result.issues.some((i) => i.path === "price")).toBe(true);
  });

  it("accepts partial updates and validates present fields", () => {
    const res = updatePropertySchema({ price: "300000", bedrooms: "3" });
    expect(res.success).toBe(true);
    expect(res.data.price).toBe(300000);
    expect(res.data.bedrooms).toBe(3);
  });

  it("rejects invalid enums", () => {
    const res = createPropertySchema({
      title: "A",
      address: "X",
      price: 1,
      propertyType: "castle",
    });
    expect(res.success).toBe(false);
    expect(res.issues.some((i) => i.path === "propertyType")).toBe(true);
  });
});
