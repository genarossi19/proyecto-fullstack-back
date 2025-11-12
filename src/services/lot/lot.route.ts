import { Router } from "express";
import lotController from "./lot.controller.ts";

const router = Router();

// CRUD básico apuntando a controller
router.get("/", lotController.getAllLots); // Obtener todos
router.get("/:id", lotController.getLotById); // Obtener por ID
router.post("/", lotController.createLot); // Crear un nuevo campo
router.delete("/:id", lotController.deleteLot); // Eliminar un campo
router.put("/:id", lotController.updateLot); // Actualizar un campo
export default router;
