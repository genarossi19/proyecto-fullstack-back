// controllers/clientController.ts
import type { Request, Response } from "express";
import Client from "../client/client.model.ts";

// Obtener todos los clientes
const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.findAll();
    res.json(clients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

// Obtener cliente por ID
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

// Crear nuevo cliente
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

// Actualizar cliente
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

// Eliminar cliente
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
};
