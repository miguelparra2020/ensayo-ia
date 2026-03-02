import { Context } from 'hono/dist/types/context';
import { CreateProductsSchema } from '../../schemas/products.schemas';
import { KardexService } from '../../services/products.service';
import { getDb } from '../../config/db';

export const createKardex = async (c: Context) => {
  const ref = c.req.query('ref')?.trim();
  if (ref && process.env.NODE_ENV === 'production' && process.env.ENABLE_DB_REF !== 'true') {
    return c.json({ success: false, error: 'Not Found' }, 404);
  }
  const db = getDb(ref);

  const body = await c.req.json().catch(() => null);
  const parsed = CreateProductsSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsed.error.message },
      400
    );
  }

  try {
    const data = await KardexService.create(db, parsed.data);
    return c.json({ success: true, data }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === 'Ya existe un registro con este invoice_id e item_id') {
      return c.json(
        { success: false, error: 'Conflict', message: error.message },
        409
      );
    }
    throw error;
  }
};