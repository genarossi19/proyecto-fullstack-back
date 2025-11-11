// controllers/clientController.ts
import type { Request, Response } from "express";
import Client from "./client.model.ts";
import Field from "../field/field.model.ts";

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
    const client = await Client.findByPk(clientId, {
      include: [
        { model: Field, as: "fields", attributes: { exclude: ["clientId"] } },
      ],
    });

    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json(client);
  } catch (error) {
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
    const id = parseInt(req.params.id, 10);
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
    const id = parseInt(req.params.id, 10);
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
