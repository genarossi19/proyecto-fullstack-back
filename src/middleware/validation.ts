import Joi from "joi";
import type { Request, Response, NextFunction } from "express";

// SCHEMA: Crear usuario

export const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "El nombre es requerido",
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 50 caracteres",
  }),

  lastname: Joi.string().min(2).max(50).required().messages({
    "string.empty": "El apellido es requerido",
    "string.min": "El apellido debe tener al menos 2 caracteres",
    "string.max": "El apellido no puede exceder 50 caracteres",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Debe proporcionar un email válido",
    "string.empty": "El email es requerido",
  }),

  password: Joi.string().min(6).required().messages({
    "string.empty": "La contraseña es requerida",
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
});

// SCHEMA: Actualizar usuario

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no puede exceder 50 caracteres",
  }),

  lastname: Joi.string().min(2).max(50).messages({
    "string.min": "El apellido debe tener al menos 2 caracteres",
    "string.max": "El apellido no puede exceder 50 caracteres",
  }),

  email: Joi.string().email().messages({
    "string.email": "Debe proporcionar un email válido",
  }),

  password: Joi.string().min(6).messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
  }),
}).min(1); // Al menos un campo debe venir

// Middleware: Validar creación

export const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = createUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

// Middleware: Validar actualización

export const validateUpdateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = updateUserSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
