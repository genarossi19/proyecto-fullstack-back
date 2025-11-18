// controllers/clientController.ts
import type { Request, Response } from "express";
import Client from "./client.model.js";
import Field from "../field/field.model.js";
import Lot from "../lot/lot.model.js";
import sequelize from "../../db/sequelize.js";
// GET todos los clientes
const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

//GET Clientes individuales con objeto Field
const getClientWithFields = async (req: Request, res: Response) => {
  const clientId = req.params.id;

  try {
    // 1) Obtener cliente con fields
    const client = await Client.findByPk(clientId, {
      attributes: ["id", "name", "email"],
      include: [
        {
          model: Field,
          as: "fields",
          attributes: ["id", "name", "area", "lat", "long", "active"],
        },
      ],
    });

    if (!client) return res.status(404).json({ message: "Client not found" });

    const clientPlain = client.get({ plain: true });

    const fieldIds = clientPlain.fields.map((f: any) => f.id);

    if (fieldIds.length === 0) {
      return res.json({ ...clientPlain, fields: [] });
    }

    // 2) Query optimizada para contar lots por cada field
    const lotCountsRaw = await Lot.findAll({
      attributes: [
        "fieldId",
        [sequelize.fn("COUNT", sequelize.col("id")), "lotsCount"],
      ],
      where: { fieldId: fieldIds },
      group: ["fieldId"],
      raw: true,
    });

    // 3) Mapeo fieldId -> lotsCount
    const lotCountsMap = lotCountsRaw.reduce((acc: any, row: any) => {
      acc[row.fieldId] = Number(row.lotsCount);
      return acc;
    }, {});

    // 4) Agregar lots a cada campo
    const optimizedFields = clientPlain.fields.map((field: any) => ({
      ...field,
      lots: lotCountsMap[field.id] || 0,
    }));

    // 5) Respuesta final
    res.json({
      ...clientPlain,
      fields: optimizedFields,
    });
  } catch (error) {
    console.error("Error optimizado getClientWithFields:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// GET cliente por  (sin objeto field)
const getClientById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const client = await Client.findByPk(id);
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });

    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
};

// POST Crear nuevo cliente
const createClient = async (req: Request, res: Response) => {
  try {
    const { cuit, name, email, phone, address, active } = req.body;
    const newClient = await Client.create({
      cuit,
      name,
      email,
      phone,
      address,
      active,
    });
    res.status(201).json(newClient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

// PUT/PATCH Actualizar cliente
const updateClient = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const client = await Client.findByPk(id);
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });

    const { cuit, name, email, phone, address, active } = req.body;
    await client.update({ cuit, name, email, phone, address, active });

    res.json(client);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

// DELETE Eliminar cliente
const deleteClient = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const client = await Client.findByPk(id);
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });

    await client.destroy();
    res.json({ message: "Cliente eliminado", client });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

export default {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getClientWithFields,
};
