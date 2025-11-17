import type { Request, Response, NextFunction } from "express";
import User from "../services/user/user.model.ts";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
} from "../utils/auth.ts";
import type { JwtUserPayload } from "../utils/auth.ts";

// Middleware para verificar token JWT

export const authenticateToken = (
  req: Request & { user?: JwtUserPayload },
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && (authHeader as string).startsWith("Bearer ")
    ? (authHeader as string).split(" ")[1]
    : undefined;

  // cookie-parser añade `req.cookies`
  const tokenFromCookie = (req as any).cookies?.token as string | undefined;

  const token = tokenFromHeader ?? tokenFromCookie;

  if (!token) {
    return res.status(401).json({ error: "Token de acceso requerido" });
  }

  try {
    const user = verifyToken(token); // token → { id, email }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
};

// LOGIN

export const login = async (email: string, password: string) => {
  const user: any = await User.findOne({ where: { email } });

  if (!user) throw new Error("Usuario no encontrado");

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) throw new Error("Contraseña incorrecta");

  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    lastname: user.lastname,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      lastname: user.lastname,
      email: user.email,
    },
    token,
  };
};
