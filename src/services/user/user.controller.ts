import type { Request, Response } from "express";
import User from "./user.model.ts";
import { login } from "../../middleware/auth.ts";
import { hashPassword } from "../../utils/auth.ts";

// GET ALL USERS

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });

    res.json(users);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
};

// GET BY ID

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener usuario" });
  }
};

// LOGIN

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }

    const result = await login(email, password);

    // Set token as httpOnly cookie
    const token = result.token;
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Return user info with token (token for debugging, cookie for storage)
    res.json({ user: result.user, token });
  } catch (error) {
    const message = (error as Error).message ?? String(error);
    res.status(401).json({ error: message });
  }
};

// Logout: clear cookie
export const userLogout = async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ ok: true });
};

// GET current user (from authenticateToken middleware)
export const currentUser = async (
  req: Request & { user?: { id?: number | string } },
  res: Response
) => {
  const user = (req as any).user;
  if (!user) return res.status(401).json({ error: "No autenticado" });
  res.json({ user });
};

// UPDATE USER (solo si es el dueño del token)

export const updateUser = async (
  req: Request & { user?: { id?: number | string } },
  res: Response
) => {
  try {
    if (Number(req.user?.id) !== Number(req.params.id)) {
      return res
        .status(403)
        .json({ error: "No tienes permiso para modificar este usuario" });
    }

    const id = Number(req.params.id);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si se envía password → encriptar
    if (req.body.password) {
      req.body.password = await hashPassword(req.body.password);
    }

    await user.update(req.body);

    const { password, ...userNoPass } = user.toJSON() as Record<
      string,
      unknown
    >;
    res.json(userNoPass);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ error: "Error al actualizar usuario" });
  }
};

// CREATE USER

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, lastname, email, password } = req.body;

    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hashedPassword,
    });

    const { password: pass, ...userNoPass } = newUser.toJSON() as Record<
      string,
      unknown
    >;
    res.status(201).json(userNoPass);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error al crear usuario" });
  }
};

// DELETE USER

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    await user.destroy();

    const { password, ...userNoPass } = user.toJSON();

    res.json({
      message: "Usuario eliminado correctamente",
      usuario: userNoPass,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};
