import type { Request, Response } from "express";

import Field from "./field.model.ts";
import Client from "../client/client.model.ts";
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
      include: [
        {
          model: Client,
          as: "client",
          attributes: ["id", "cuit", "name"], // solo estos campos
        },
      ],
    });

    if (!field) return res.status(404).json({ error: "Campo no encontrado" });

    // opcionalmente eliminar el clientId si no querés enviarlo
    const { clientId, ...rest } = field.toJSON();

    res.json(rest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener campo" });
  }
};

export default { getAllFields, getFieldById };
