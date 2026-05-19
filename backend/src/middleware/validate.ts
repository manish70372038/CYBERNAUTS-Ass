import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateUser = [
  body("username").notEmpty().withMessage("Username is required"),
  body("age").isInt({ min: 1 }).withMessage("Age must be a positive number"),
  body("hobbies").isArray().withMessage("Hobbies must be an array"),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }
  next();
};