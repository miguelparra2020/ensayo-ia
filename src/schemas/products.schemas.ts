import { z } from 'zod';

/**
 * ============================
 * CREATE
 * ============================
 */
export const CreateProductsSchema = z.object({
  invoice_id: z.string().optional(),
  item_id: z.string().optional(),
  invoice_date: z.string().optional(),
  person_id: z.string().optional(),
  person_identification: z.string().optional().nullable(),
  person_name: z.string().optional().nullable(),  
  item_code: z.string().optional().nullable(),
  item_name: z.string().optional().nullable(),
  quantity: z.number().optional(),
  unit_value: z.number().optional(),
  subtotal_amount: z.number().optional(),
});

/**
 * ============================
 * UPDATE
 * ============================
 */
export const UpdateProductsSchema = z.object({
  invoice_id: z.string().optional(),
  invoice_date: z.string().optional(),
  person_id: z.string().optional(),
  person_identification: z.string().optional().nullable(),
  person_name: z.string().optional().nullable(),
  item_id: z.string().optional(),
  item_code: z.string().optional().nullable(),
  item_name: z.string().optional().nullable(),
  quantity: z.number().optional(),
  unit_value: z.number().optional(),
  subtotal_amount: z.number().optional(),
});

/**
 * ============================
 * QUERY PARAMS
 * ============================
 */
export const GetProductsQuerySchema = z.object({
  ref: z.string().min(1, 'ref is required'),
  page: z.union([z.string(), z.number()]).optional(),
  limit: z.union([z.string(), z.number()]).optional().refine(
    (val) => {
      if (val === undefined) return true;
      const num = typeof val === 'string' ? parseInt(val, 10) : val;
      return num >= 1 && num <= 1000;
    },
    { message: 'Limit must be between 1 and 1000' }
  ),
  item_id: z.string().optional(),
  date_start: z.string().optional(),
  date_end: z.string().optional(), 
});

export const GetProductsNamesQuerySchema = z.object({
  ref: z.string().min(1, 'ref is required'),
});

export const GetProductsQuantityByMonthQuerySchema = z.object({
  ref: z.string().min(1, 'ref is required'),
  item_id: z.string().min(1, 'item_id is required'),
});
/**
 * ============================
 * RESPONSE
 * ============================
 */
export const PaginatedProductsResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(z.any()),
  data_items: z.number(),
  page_current: z.number(),
  page_total: z.number(),
  have_next_page: z.boolean(),
  have_previus_page: z.boolean(),
});