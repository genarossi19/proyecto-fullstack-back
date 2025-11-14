import AdminJS from "adminjs";
import type { ActionRequest, ActionContext } from "adminjs";
import type { Response } from "express";
import AdminJSSequelize from "@adminjs/sequelize";
import sequelize from "../db/sequelize.ts";
import { Parser } from "json2csv";

// Importa tus modelos
import Client from "../services/client/client.model.ts";
import Field from "../services/field/field.model.ts";
import Lot from "../services/lot/lot.model.ts";
import Service from "../services/service/service.model.ts";
import Machinery from "../services/machinery/machinery.model.ts";

// Registra el adaptador Sequelize
AdminJS.registerAdapter(AdminJSSequelize);

// Configuración del panel AdminJS
const adminJs = new AdminJS({
  databases: [sequelize], // conecta tus modelos Sequelize
  rootPath: "/admin",
  resources: [
    {
      resource: Client,
      options: {
        listProperties: ["id", "name", "email"],
        showProperties: ["id", "name", "email", "active"],
        actions: {
          exportFieldsCSV: {
            actionType: "record", // acción por registro
            icon: "Document",
            label: "Export Fields CSV",
            handler: async (
              request: ActionRequest,
              response: Response,
              context: ActionContext
            ) => {
              const client = context.record;
              if (!client) throw new Error("Client no encontrado");

              // Traer todos los Fields asociados
              const fields = await Field.findAll({
                where: { clientId: client.param("id") },
                attributes: ["id", "name", "area", "lat", "long", "active"],
              });

              // Convertir a CSV
              const parser = new Parser();
              const csv = parser.parse(fields.map((f) => f.toJSON()));

              // Devolver CSV como archivo descargable
              response.setHeader("Content-Type", "text/csv");
              response.setHeader(
                "Content-Disposition",
                `attachment; filename=fields_client_${client.param("id")}.csv`
              );
              response.send(csv);

              return {};
            },
          },
        },
      },
    },
    {
      resource: Field,
      options: {
        listProperties: ["id", "name", "area", "clientId"],
        showProperties: [
          "id",
          "name",
          "area",
          "lat",
          "long",
          "clientId",
          "active",
        ],
      },
    },
    {
      resource: Lot,
      options: {
        listProperties: ["id", "name", "area", "fieldId"],
        showProperties: [
          "id",
          "name",
          "area",
          "lat",
          "long",
          "fieldId",
          "active",
        ],
      },
    },
    {
      resource: Service,
      options: {
        listProperties: ["id", "name"],
        showProperties: ["id", "name"],
      },
    },
    {
      resource: Machinery,
      options: {
        listProperties: ["id", "name", "type", "brand", "model"],
        showProperties: ["id", "name", "type", "brand", "model"],
      },
    },
  ],
});

export default adminJs;
