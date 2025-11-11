import { Router } from "express";
import fieldController from "./field.controller.ts";

const router = Router();

// CRUD básico apuntando a controller
router.get("/", fieldController.getAllFields); // Obtener todos
router.get("/:id", fieldController.getFieldById); // Obtener por ID

export default router;
