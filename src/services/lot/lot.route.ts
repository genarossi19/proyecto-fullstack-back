import { Router } from "express";
import lotController from "./lot.controller.js";
import { authenticateToken } from "../../middleware/auth.js";
const router = Router();

// CRUD básico apuntando a controller
router.get("/", authenticateToken, lotController.getAllLots); // Obtener todos
router.get("/:id", authenticateToken, lotController.getLotById); // Obtener por ID
router.post("/", authenticateToken, lotController.createLot); // Crear un nuevo campo
router.delete("/:id", authenticateToken, lotController.deleteLot); // Eliminar un campo
router.put("/:id", authenticateToken, lotController.updateLot); // Actualizar un campo
export default router;
