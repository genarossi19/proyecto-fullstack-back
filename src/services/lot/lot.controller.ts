import type { Request, Response } from "express";
import Lot from "./lot.model.ts";
import Field from "../field/field.model.ts";
import Client from "../client/client.model.ts";

// Crear un nuevo lote
export const createLot = async (req: Request, res: Response) => {
  try {
    const { name, area, lat, long, active, fieldId } = req.body;

    const newLot = await Lot.create({
      name,
      area,
      lat,
      long,
      active,
      fieldId,
    });

    res.status(201).json(newLot);
  } catch (error) {
    console.error("Error al crear el lote:", error);
    res.status(500).json({ error: "Error al crear el lote" });
  }
};

// Obtener todos los lotes
export const getAllLots = async (req: Request, res: Response) => {
  try {
    const lots = await Lot.findAll({
      attributes: ["id", "name", "area", "lat", "long"], // solo atributos de lot
      include: [
        {
          model: Field,
          as: "field",
          attributes: ["id", "name"], // solo atributos de field
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "name"], // solo atributos de client
            },
          ],
        },
      ],
    });

    res.status(200).json(lots);
  } catch (error) {
    console.error("Error al obtener los lotes:", error);
    res.status(500).json({ error: "Error al obtener los lotes" });
  }
};

export const getLotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lot = await Lot.findByPk(id, {
      attributes: ["id", "name", "area", "lat", "long"], // solo atributos de lot
      include: [
        {
          model: Field,
          as: "field",
          attributes: ["id", "name"], // solo atributos de field
          include: [
            {
              model: Client,
              as: "client",
              attributes: ["id", "name"], // solo atributos de client
            },
          ],
        },
      ],
    });

    if (!lot) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }

    res.status(200).json(lot);
  } catch (error) {
    console.error("Error al obtener el lote:", error);
    res.status(500).json({ error: "Error al obtener el lote" });
  }
};

// Actualizar un lote
export const updateLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, area, lat, long, active, fieldId } = req.body;

    const lot = await Lot.findByPk(id);
    if (!lot) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }

    await lot.update({ name, area, lat, long, active, fieldId });

    res.status(200).json(lot);
  } catch (error) {
    console.error("Error al actualizar el lote:", error);
    res.status(500).json({ error: "Error al actualizar el lote" });
  }
};

// Eliminar un lote
export const deleteLot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const lot = await Lot.findByPk(id);
    if (!lot) {
      return res.status(404).json({ error: "Lote no encontrado" });
    }

    await lot.destroy();

    res.status(200).json({ message: "Lote eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el lote:", error);
    res.status(500).json({ error: "Error al eliminar el lote" });
  }
};

export default {
  createLot,
  getAllLots,
  getLotById,
  updateLot,
  deleteLot,
};
