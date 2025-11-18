import { Request, Response } from "express";
import Service from "./service.model.js";

// Crear un nuevo servicio
export const createService = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const newService = await Service.create({ name });
    res.status(201).json(newService);
  } catch (error) {
    console.error("Error al crear el servicio:", error);
    res.status(500).json({ error: "Error al crear el servicio" });
  }
};

// Obtener todos los servicios
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error al obtener los servicios:", error);
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

// Obtener un servicio por ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);

    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error("Error al obtener el servicio:", error);
    res.status(500).json({ error: "Error al obtener el servicio" });
  }
};

// Actualizar un servicio
export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    await service.update({ name });
    res.status(200).json(service);
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    res.status(500).json({ error: "Error al actualizar el servicio" });
  }
};

// Eliminar un servicio
export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await Service.findByPk(id);
    if (!service) {
      return res.status(404).json({ error: "Servicio no encontrado" });
    }

    await service.destroy();
    res.status(200).json({ message: "Servicio eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el servicio:", error);
    res.status(500).json({ error: "Error al eliminar el servicio" });
  }
};

export default {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
};
