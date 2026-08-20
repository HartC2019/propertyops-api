import db from "#db/client";

export async function createIncome(income) {
  const { property_id, amount, category, payment_date, note } = income;

  const sql = `
    INSERT INTO income (
      property_id,
      amount,
      category,
      payment_date,
      note
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const {
    rows: [createdIncome],
  } = await db.query(sql, [property_id, amount, category, payment_date, note]);

  return createdIncome;
}

export async function getIncomeByProperty(propertyId) {
  const sql = `
    SELECT *
    FROM income
    WHERE property_id = $1
    ORDER BY payment_date DESC;
  `;

  const { rows: income } = await db.query(sql, [propertyId]);

  return income;
}

export async function getIncomeById(incomeId) {
  const sql = `
    SELECT *
    FROM income
    WHERE id = $1;
  `;

  const {
    rows: [income],
  } = await db.query(sql, [incomeId]);

  return income;
}

export async function deleteIncome(incomeId) {
  const sql = `
    DELETE FROM income
    WHERE id = $1
    RETURNING *;
  `;

  const {
    rows: [deletedIncome],
  } = await db.query(sql, [incomeId]);

  return deletedIncome;
}
