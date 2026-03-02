import { Context } from 'hono/dist/types/context';
import { UpdateProductsSchema } from '../../schemas/products.schemas';
import { KardexService } from '../../services/products.service';
import { getDb } from '../../config/db';
import { z } from 'zod';

const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const updateKardex = async (c: Context) => {
  const ref = c.req.query('ref')?.trim();
  if (ref && process.env.NODE_ENV === 'production' && process.env.ENABLE_DB_REF !== 'true') {
    return c.json({ success: false, error: 'Not Found' }, 404);
  }
  const db = getDb(ref);

  const params = c.req.param();
  const parsedParams = IdParamSchema.safeParse(params);

  if (!parsedParams.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: 'Invalid ID format' },
      400
    );
  }

  const body = await c.req.json().catch(() => null);
  const parsedBody = UpdateProductsSchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsedBody.error.message },
      400
    );
  }

  const id = Number(parsedParams.data.id);
  const data = await KardexService.update(db, id, parsedBody.data);

  if (!data) {
    return c.json(
      { success: false, error: 'Not Found', message: 'Note not found' },
      404
    );
  }

  return c.json({ success: true, data }, 200);
};