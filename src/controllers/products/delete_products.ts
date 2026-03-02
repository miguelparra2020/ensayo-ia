import { Context } from 'hono/dist/types/context';
import { z } from 'zod';
import { KardexService } from '../../services/products.service';
import { getDb } from '../../config/db';

const IdParamSchema = z.object({
  id: z.string().regex(/^\d+$/),
});

const DeleteKardexBodySchema = z.object({
  updated_by_user_name: z.string().optional(),
  updated_by_user_id: z.string().optional(),
});

export const deleteKardex = async (c: Context) => {
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
  const parsedBody = DeleteKardexBodySchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json(
      { success: false, error: 'Bad Request', message: parsedBody.error.message },
      400
    );
  }

  const id = Number(parsedParams.data.id);
  const data = await KardexService.deactivate(db, id);

  if (!data) {
    return c.json(
      { success: false, error: 'Not Found', message: 'Note not found' },
      404
    );
  }

  return c.json({ success: true, data }, 200);
};