import { Router } from "express";
import fieldController from "./field.controller.ts";
import { authenticateToken } from "../../middleware/auth.ts";
const router = Router();

// CRUD básico apuntando a controller
router.get("/", authenticateToken, fieldController.getAllFields); // Obtener todos
router.get("/:id", authenticateToken, fieldController.getFieldWithLots); // Obtener por ID
router.post("/", authenticateToken, fieldController.createField); // Crear un nuevo campo
router.delete("/:id", authenticateToken, fieldController.deleteField); // Eliminar un campo
router.put("/:id", authenticateToken, fieldController.updateField); // Actualizar un campo
export default router;
