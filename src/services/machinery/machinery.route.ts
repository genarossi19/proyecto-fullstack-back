import { Router } from "express";
import machineryController from "./machinery.controller.ts";

const machineryRouter = Router();

// Crear nueva maquinaria
machineryRouter.post("/", machineryController.createMachinery);

// Obtener todas las maquinarias
machineryRouter.get("/", machineryController.getAllMachinery);

// Obtener maquinaria por ID
machineryRouter.get("/:id", machineryController.getMachineryById);

// Actualizar maquinaria
machineryRouter.put("/:id", machineryController.updateMachinery);

// Eliminar maquinaria
machineryRouter.delete("/:id", machineryController.deleteMachinery);

export default machineryRouter;
