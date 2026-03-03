import { Context } from 'hono/dist/types/context';
import { KardexService } from '../../services/products.service';
import { getDb } from '../../config/db';

export const getProductsQuantityByMonth = async (c: Context) => {
  const ref = c.req.query('ref')?.trim();
  if (ref && process.env.NODE_ENV === 'production' && process.env.ENABLE_DB_REF !== 'true') {
    return c.json({ success: false, error: 'Not Found' }, 404);
  }
  const db = getDb(ref);

  const itemId = c.req.query('item_id');
  if (!itemId) {
    return c.json({ success: false, error: 'item_id is required' }, 400);
  }

  const { rows } = await db.query(
    `
    SELECT 
      TO_CHAR(invoice_date, 'Mon YYYY') as month,
      SUM(quantity) as quantity
    FROM kardex
    WHERE item_id = $1
      AND invoice_date >= (CURRENT_DATE - INTERVAL '12 months')
      AND deleted_at IS NULL
    GROUP BY TO_CHAR(invoice_date, 'Mon YYYY')
    ORDER BY invoice_date DESC
    `,
    [itemId]
  );

  return c.json({
    success: true,
    data: rows
  }, 200);
};