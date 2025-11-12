// routes/clientRoutes.ts
import { Router } from "express";
import clientController from "../client/client.controller.ts";

const router = Router();

// CRUD básico apuntando a controller
router.get("/", clientController.getAllClients); // Obtener todos
router.get("/:id", clientController.getClientWithFields); // Obtener por ID con el objeto de field
router.post("/", clientController.createClient); // Crear
router.put("/:id", clientController.updateClient); // Actualizar
router.delete("/:id", clientController.deleteClient); // Eliminar

export default router;
