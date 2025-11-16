import type { Request, Response } from "express";
import Machinery from "./machinery.model.ts";

// Función para normalizar el campo "type"
const normalizeType = (type: string) => type.trim().toUpperCase();

export const createMachinery = async (req: Request, res: Response) => {
  try {
    const { name, type, brand, model, patent } = req.body;

    if (!name || !type || !brand || !model) {
      return res.status(400).json({ error: "Todos los campos son requeridos" });
    }

    const newMachinery = await Machinery.create({
      name,
      type: normalizeType(type),
      brand,
      model,
      status: "Disponible",
      patent,
    });

    res.status(201).json(newMachinery);
  } catch (error) {
    console.error("Error al crear la maquinaria:", error);
    res.status(500).json({ error: "Error al crear la maquinaria" });
  }
};

export const getAllMachinery = async (_req: Request, res: Response) => {
  try {
    const machinery = await Machinery.findAll();
    res.status(200).json(machinery);
  } catch (error) {
    console.error("Error al obtener las maquinarias:", error);
    res.status(500).json({ error: "Error al obtener las maquinarias" });
  }
};

export const getMachineryById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const machinery = await Machinery.findByPk(id);

    if (!machinery) {
      return res.status(404).json({ error: "Maquinaria no encontrada" });
    }

    res.status(200).json(machinery);
  } catch (error) {
    console.error("Error al obtener la maquinaria:", error);
    res.status(500).json({ error: "Error al obtener la maquinaria" });
  }
};

export const updateMachinery = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, type, brand, model } = req.body;

    const machinery = await Machinery.findByPk(id);
    if (!machinery) {
      return res.status(404).json({ error: "Maquinaria no encontrada" });
    }

    // Obtener valores actuales tipados como string
    const currentType = machinery.get("type") as string;
    const currentName = machinery.get("name") as string;
    const currentBrand = machinery.get("brand") as string;
    const currentModel = machinery.get("model") as string;

    await machinery.update({
      name: name ?? currentName,
      type: type ? normalizeType(type) : currentType,
      brand: brand ?? currentBrand,
      model: model ?? currentModel,
    });

    res.status(200).json(machinery);
  } catch (error) {
    console.error("Error al actualizar la maquinaria:", error);
    res.status(500).json({ error: "Error al actualizar la maquinaria" });
  }
};

export const deleteMachinery = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const machinery = await Machinery.findByPk(id);

    if (!machinery) {
      return res.status(404).json({ error: "Maquinaria no encontrada" });
    }

    await machinery.destroy();
    res.status(200).json({ message: "Maquinaria eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la maquinaria:", error);
    res.status(500).json({ error: "Error al eliminar la maquinaria" });
  }
};

// Export default para usar en router
export default {
  createMachinery,
  getAllMachinery,
  getMachineryById,
  updateMachinery,
  deleteMachinery,
};
