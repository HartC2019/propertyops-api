import db from "#db/client";

export async function createExpense(expense) {
  const { property_id, amount, category, expense_date, note } = expense;

  const {
    rows: [createdExpense],
  } = await db.query(
    `
      INSERT INTO expense (
        property_id,
        amount,
        category,
        expense_date,
        note
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
    [property_id, amount, category, expense_date, note],
  );

  return createdExpense;
}

export async function getExpensesByProperty(propertyId) {
  const { rows } = await db.query(
    `
      SELECT *
      FROM expense
      WHERE property_id = $1
      ORDER BY expense_date DESC;
    `,
    [propertyId],
  );

  return rows;
}

export async function getExpenseById(expenseId) {
  const {
    rows: [expense],
  } = await db.query(
    `
      SELECT *
      FROM expense
      WHERE id = $1;
    `,
    [expenseId],
  );

  return expense;
}

export async function deleteExpense(expenseId) {
  const {
    rows: [deletedExpense],
  } = await db.query(
    `
      DELETE FROM expense
      WHERE id = $1
      RETURNING *;
    `,
    [expenseId],
  );

  return deletedExpense;
}
