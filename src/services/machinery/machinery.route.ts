import { Router } from "express";
import machineryController from "./machinery.controller.js";
import { authenticateToken } from "../../middleware/auth.js";
const machineryRouter = Router();

// Crear nueva maquinaria
machineryRouter.post(
  "/",
  authenticateToken,
  machineryController.createMachinery
);

// Obtener todas las maquinarias
machineryRouter.get(
  "/",
  authenticateToken,
  machineryController.getAllMachinery
);

// Obtener maquinaria por ID
machineryRouter.get(
  "/:id",
  authenticateToken,
  machineryController.getMachineryById
);

// Actualizar maquinaria
machineryRouter.put(
  "/:id",
  authenticateToken,
  machineryController.updateMachinery
);

// Eliminar maquinaria
machineryRouter.delete(
  "/:id",
  authenticateToken,
  machineryController.deleteMachinery
);

export default machineryRouter;
