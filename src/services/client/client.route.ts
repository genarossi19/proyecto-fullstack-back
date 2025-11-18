// routes/clientRoutes.ts
import { Router } from "express";
import clientController from "../client/client.controller.js";
import { authenticateToken } from "../../middleware/auth.js";

const router = Router();

// CRUD básico apuntando a controller
router.get("/", authenticateToken, clientController.getAllClients); // Obtener todos
router.get("/:id", authenticateToken, clientController.getClientWithFields); // Obtener por ID con el objeto de field
router.post("/", authenticateToken, clientController.createClient); // Crear
router.put("/:id", authenticateToken, clientController.updateClient); // Actualizar
router.delete("/:id", authenticateToken, clientController.deleteClient); // Eliminar

export default router;
