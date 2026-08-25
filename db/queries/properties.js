import db from "#db/client";

export async function createProperty(property) {
  const {
    user_id,
    nickname,
    street,
    city,
    state,
    zip_code,
    property_type,
    year_built,
    bedrooms,
    bathrooms,
    square_feet,
    purchase_price,
    purchase_date,
    monthly_rent,
    cover_image_url,
    electric_paid_by,
    water_paid_by,
    gas_paid_by,
    trash_paid_by,
    notes,
  } = property;

  const sql = `
    INSERT INTO properties (
      user_id,
      nickname,
      street,
      city,
      state,
      zip_code,
      property_type,
      year_built,
      bedrooms,
      bathrooms,
      square_feet,
      purchase_price,
      purchase_date,
      monthly_rent,
      cover_image_url,
      electric_paid_by,
      water_paid_by,
      gas_paid_by,
      trash_paid_by,
      notes
    )
    VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20
    )
    RETURNING *;
  `;

  const {
    rows: [createdProperty],
  } = await db.query(sql, [
    user_id,
    nickname,
    street,
    city,
    state,
    zip_code,
    property_type,
    year_built,
    bedrooms,
    bathrooms,
    square_feet,
    purchase_price,
    purchase_date,
    monthly_rent,
    cover_image_url,
    electric_paid_by,
    water_paid_by,
    gas_paid_by,
    trash_paid_by,
    notes,
  ]);

  return createdProperty;
}

export async function getPropertiesByUser(userId) {
  const sql = `
    SELECT *
    FROM properties
    WHERE user_id = $1
    ORDER BY nickname;
  `;
  const { rows: properties } = await db.query(sql, [userId]);
  return properties;
}

export async function getPropertyById(propertyId) {
  const sql = `
    SELECT *
    FROM properties
    WHERE id = $1;
  `;
  const {
    rows: [property],
  } = await db.query(sql, [propertyId]);
  return property;
}

export async function updateProperty(propertyId, property) {
  const {
    user_id,
    nickname,
    street,
    city,
    state,
    zip_code,
    property_type,
    year_built,
    bedrooms,
    bathrooms,
    square_feet,
    purchase_price,
    purchase_date,
    monthly_rent,
    cover_image_url,
    electric_paid_by,
    water_paid_by,
    gas_paid_by,
    trash_paid_by,
    notes,
  } = property;

  const sql = `
    UPDATE properties
    SET
      user_id = $1,
      nickname = $2,
      street = $3,
      city = $4,
      state = $5,
      zip_code = $6,
      property_type = $7,
      year_built = $8,
      bedrooms = $9,
      bathrooms = $10,
      square_feet = $11,
      purchase_price = $12,
      purchase_date = $13,
      monthly_rent = $14,
      cover_image_url = $15,
      electric_paid_by = $16,
      water_paid_by = $17,
      gas_paid_by = $18,
      trash_paid_by = $19,
      notes = $20
    WHERE id = $21
    RETURNING *;
  `;

  const {
    rows: [updatedProperty],
  } = await db.query(sql, [
    user_id,
    nickname,
    street,
    city,
    state,
    zip_code,
    property_type,
    year_built,
    bedrooms,
    bathrooms,
    square_feet,
    purchase_price,
    purchase_date,
    monthly_rent,
    cover_image_url,
    electric_paid_by,
    water_paid_by,
    gas_paid_by,
    trash_paid_by,
    notes,
    propertyId,
  ]);

  return updatedProperty;
}

export async function deleteProperty(propertyId) {
  const sql = `
    DELETE FROM properties
    WHERE id = $1
    RETURNING *;
  `;
  const {
    rows: [deletedProperty],
  } = await db.query(sql, [propertyId]);
  return deletedProperty;
}

export async function getRecentProperties(userId, limit = 6) {
  const sql = `
    SELECT
      id,
      nickname,
      street,
      city,
      state,
      zip_code,
      cover_image_url,
      property_type,
      monthly_rent
    FROM properties
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2;
  `;

  const { rows } = await db.query(sql, [userId, limit]);

  return rows;
}
