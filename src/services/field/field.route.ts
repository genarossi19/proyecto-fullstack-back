import { Router } from "express";
import fieldController from "./field.controller.ts";

const router = Router();

// CRUD básico apuntando a controller
router.get("/", fieldController.getAllFields); // Obtener todos
router.get("/:id", fieldController.getFieldWithLots); // Obtener por ID
router.post("/", fieldController.createField); // Crear un nuevo campo
router.delete("/:id", fieldController.deleteField); // Eliminar un campo
router.put("/:id", fieldController.updateField); // Actualizar un campo
export default router;
