import express from "express";
import { authenticateToken } from "../../middleware/auth.ts";
import {
  updateUser,
  userLogin,
  userLogout,
  getUsers,
  getUserById,
  createUser,
  deleteUser,
} from "./user.controller.ts";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../../middleware/validation.ts";
import {
  generalLimiter,
  authLimiter,
  createUserLimiter,
} from "../../middleware/ratelimit.ts";

const userRouter = express.Router();

//APLICAR RATE LIMIT GENERAL A TODAS LAS RUTAS
userRouter.use(generalLimiter);

// === GET /api/users ===
userRouter.get("/", authenticateToken, getUsers);

// === GET /api/users/:id ===
userRouter.get("/:id", authenticateToken, getUserById);

// === POST /api/users/login ===
userRouter.post("/login", authLimiter, userLogin);

// === POST /api/users/logout ===
userRouter.post("/logout", userLogout);

// === GET /api/users/me ===
userRouter.get("/me", authenticateToken, (req, res) =>
  res.status(200).json({ user: (req as any).user })
);

// === POST /api/users ===
// Crear nuevo usuario con limitador
userRouter.post("/signup", createUserLimiter, validateCreateUser, createUser);

// === PUT /api/users/:id ===
userRouter.put("/:id", authenticateToken, validateUpdateUser, updateUser);

//PATCH /api/users/:id
userRouter.patch("/:id", authenticateToken, validateUpdateUser, updateUser);

// === DELETE /api/users/:id ===
userRouter.delete("/:id", authenticateToken, deleteUser);

export default userRouter;
