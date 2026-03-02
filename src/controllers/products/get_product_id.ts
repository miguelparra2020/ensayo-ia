import { Context } from 'hono/dist/types/context';
import { z } from 'zod';
import { KardexService } from '../../services/products.service';
import { getDb } from '../../config/db';

const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

export const getKardexById = async (c: Context) => {
  const ref = c.req.query('ref')?.trim();
  if (ref && process.env.NODE_ENV === 'production' && process.env.ENABLE_DB_REF !== 'true') {
    return c.json({ success: false, error: 'Not Found' }, 404);
  }
  const db = getDb(ref);

  const params = c.req.param();
  const parsed = IdParamSchema.safeParse(params);

  if (!parsed.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: 'Invalid ID format' },
      400
    );
  }

  const id = Number(parsed.data.id);
  const data = await KardexService.getById(db, id);

  if (!data) {
    return c.json(
      { success: false, error: 'Not Found', message: 'Note not found' },
      404
    );
  }

  return c.json({ success: true, data }, 200);
};