import type { Context } from 'hono';
import { GetKardexProductsBuyedQuantityByMonthQuerySchema } from '../../schemas/products.schemas';
import { resolveDb } from '../../utils/request.utils';

export const getKardexProductsBuyedQuantityByMonth = async (c: Context) => {
  const resolved = resolveDb(c);
  if (resolved.kind === 'error') return c.json(resolved.body, resolved.status);
  const { db } = resolved;

  const parsed = GetKardexProductsBuyedQuantityByMonthQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsed.error.message },
      400
    );
  }

  const { item_id } = parsed.data;

  try {
    const { rows } = await db.query(
      `
      WITH months AS (
        SELECT
          generate_series(
            '2024-12-01'::date,
            DATE_TRUNC('month', CURRENT_DATE),
            INTERVAL '1 month'
          )::date AS month_start
      ),
      monthly_data AS (
        SELECT
          m.month_start,
          (ARRAY['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'])[EXTRACT(MONTH FROM m.month_start)::int]
            || ' ' || EXTRACT(YEAR FROM m.month_start)::text AS month,
          COALESCE(SUM(k.quantity), 0)::bigint AS quantity
        FROM months m
        LEFT JOIN kardex_products_buyed k
          ON DATE_TRUNC('month', k.invoice_date) = m.month_start
          AND k.item_id = $1
          AND k.deleted_at IS NULL
        GROUP BY m.month_start
        ORDER BY m.month_start DESC
      )
      SELECT month, quantity FROM monthly_data
      `,
      [item_id]
    );

    return c.json({ success: true, data: rows }, 200);
  } catch (err) {
    console.error('getKardexProductsBuyedQuantityByMonth error:', err);
    return c.json({ success: false, error: 'Internal Server Error' }, 500);
  }
};
