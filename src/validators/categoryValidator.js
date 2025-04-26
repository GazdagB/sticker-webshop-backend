import { body } from "express-validator";

export const categoryValidationRules = [
    body('name')
    .notEmpty().withMessage('Name is required'),

    body('name')
    .isString().withMessage('Name has to be a string'),

    body('description')
    .notEmpty().isString().withMessage('Description is required'),
]