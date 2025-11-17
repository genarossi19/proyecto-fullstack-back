import type { Request, Response } from "express";

import Field from "./field.model.ts";
import Client from "../client/client.model.ts";
import Lot from "../lot/lot.model.ts";
const getAllFields = async (req: Request, res: Response) => {
  try {
    const fields = await Field.findAll();
    res.json(fields);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener campos" });
  }
};

const getFieldById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    const field = await Field.findByPk(id, {
      attributes: { exclude: ["clientId"] },
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "cuit", "name"],
        },
      ],
    });

    if (!field) return res.status(404).json({ error: "Campo no encontrado" });

    res.json(field);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener campo" });
  }
};

const getFieldWithLots = async (req: Request, res: Response) => {
  const fieldId = req.params.id;

  try {
    const field = await Field.findByPk(fieldId, {
      include: [
        {
          model: Lot,
          as: "lots",
          attributes: { exclude: ["fieldId"] },
        },
      ],
    });

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json(field);
  } catch (error) {
    console.error("Error fetching field with lots:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const createField = async (req: Request, res: Response) => {
  try {
    const { name, area, lat, long, active, clientId } = req.body;
    const newField = await Field.create({
      name,
      area,
      lat,
      long,
      active,
      clientId,
    });

    res.status(201).json(newField);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el campo" });
  }
};
const updateField = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const field = await Field.findByPk(id);
    if (!field)
      return res.status(404).json({ error: "No se encontro el campo" });
    const { name, area, lat, long, active } = req.body;
    await field.update({ name, area, lat, long, active });
  } catch (error) {}
};

const deleteField = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const field = await Field.findByPk(id);
    if (!field) {
      return res.status(404).json({ error: "No se encontro el campo" });
    }

    await field.destroy();

    return res.status(200).json({ message: "Campo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar el campo:", error);
    return res.status(500).json({ error: "Error al eliminar el campo" });
  }
};

export default {
  getAllFields,
  getFieldById,
  createField,
  deleteField,
  updateField,
  getFieldWithLots,
};
