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
