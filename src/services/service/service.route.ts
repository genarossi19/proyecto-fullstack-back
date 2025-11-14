import express from "express";
import serviceController from "./service.controller.ts";

const serviceRouter = express.Router();

// Crear un nuevo servicio
serviceRouter.post("/", serviceController.createService);

// Obtener todos los servicios
serviceRouter.get("/", serviceController.getAllServices);

// Obtener un servicio por ID
serviceRouter.get("/:id", serviceController.getServiceById);

// Actualizar un servicio
serviceRouter.put("/:id", serviceController.updateService);

// Eliminar un servicio
serviceRouter.delete("/:id", serviceController.deleteService);

export default serviceRouter;
