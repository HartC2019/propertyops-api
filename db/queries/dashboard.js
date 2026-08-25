import db from "#db/client";

export async function getDashboardSummary(userId) {
  const sql = `
    SELECT
      (
        SELECT COUNT(*)
        FROM properties
        WHERE user_id = $1
      )::int AS "propertyCount",

      (
        SELECT COALESCE(SUM(i.amount), 0)
        FROM income i
        JOIN properties p
          ON p.id = i.property_id
        WHERE p.user_id = $1
          AND i.payment_date >= DATE_TRUNC('month', CURRENT_DATE)
          AND i.payment_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      ) AS "monthlyIncome",

      (
        SELECT COALESCE(SUM(e.amount), 0)
        FROM expense e
        JOIN properties p
          ON p.id = e.property_id
        WHERE p.user_id = $1
          AND e.expense_date >= DATE_TRUNC('month', CURRENT_DATE)
          AND e.expense_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
      ) AS "monthlyExpenses";
  `;

  const {
    rows: [summary],
  } = await db.query(sql, [userId]);

  return {
    propertyCount: summary.propertyCount,
    monthlyIncome: Number(summary.monthlyIncome),
    monthlyExpenses: Number(summary.monthlyExpenses),
    monthlyNetIncome:
      Number(summary.monthlyIncome) - Number(summary.monthlyExpenses),
  };
}
