import { z } from 'zod';

// Add Product validation schema
export const addProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim(),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must be 255 characters or less')
    .trim(),
  
  price: z
    .number()
    .min(0.01, 'Price must be at least $0.01')
    .positive('Price must be positive'),
  
  stock: z
    .number()
    .min(0, 'Stock cannot be negative')
    .int('Stock must be a whole number'),
  
  isActive: z.boolean().optional().default(true),
  
  imageId: z.string().optional(),
  
  image: z.instanceof(File).optional()
});

// Update Product validation schema (all fields optional)
export const updateProductSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or less')
    .trim()
    .optional(),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .max(255, 'Description must be 255 characters or less')
    .trim()
    .optional(),
  
  price: z
    .number()
    .min(0.01, 'Price must be at least $0.01')
    .positive('Price must be positive')
    .optional(),
  
  stock: z
    .number()
    .min(0, 'Stock cannot be negative')
    .int('Stock must be a whole number')
    .optional(),
  
  isActive: z.boolean().optional(),
  
  imageId: z.string().optional(),
  
  image: z.instanceof(File).optional()
});

// Type inference from schemas
export type AddProductFormData = z.infer<typeof addProductSchema>;
export type UpdateProductFormData = z.infer<typeof updateProductSchema>;

// Validation helper functions
export const validateAddProduct = (data: unknown) => {
  return addProductSchema.safeParse(data);
};

export const validateUpdateProduct = (data: unknown) => {
  return updateProductSchema.safeParse(data);
};