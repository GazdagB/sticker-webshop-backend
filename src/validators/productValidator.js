// src/validators/productValidator.js
import { body, param} from 'express-validator';

export const productValidationRules = [
  body('name')
    .notEmpty().withMessage('Name is required'),

  body('description')
    .optional().isString(),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ gt: 0 }).withMessage('Price must be a number greater than 0'),

  body('image_url')
    .optional()
    .isURL().withMessage('Image URL must be valid'),

  body('category_id')
    .notEmpty().withMessage('Category ID is required')
    .isInt({ gt: 0 }).withMessage('Category ID must be a positive integer')
];

export const validateProductIdParam = [
    param('id').isInt({ gt: 0 }).withMessage('Product ID must be a positive integer')
  ];