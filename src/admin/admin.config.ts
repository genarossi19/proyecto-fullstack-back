import AdminJS from "adminjs";
import type { ActionRequest, ActionContext } from "adminjs";
import type { Response } from "express";
import AdminJSSequelize from "@adminjs/sequelize";
import sequelize from "../db/sequelize.js";
import { Parser } from "json2csv";

// Importa tus modelos
import Client from "../services/client/client.model.js";
import Field from "../services/field/field.model.js";
import Lot from "../services/lot/lot.model.js";
import Service from "../services/service/service.model.js";
import Machinery from "../services/machinery/machinery.model.js";
import MachineryDetail from "../services/workOrder/details/machineryDetail/machineryDetail.model.js";
import LotDetail from "../services/workOrder/details/lotDetail/lotDetail.model.js";
import WorkOrder from "../services/workOrder/workOrder.model.js";

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
    {
      resource: WorkOrder,
      options: {
        listProperties: [
          "id",
          "name",
          "created_at",
          "init_date",
          "finish_date",
          "status",
          "clientId",
          "fieldId",
          "serviceId",
          "price",
        ],
        showProperties: [
          "id",
          "name",
          "created_at",
          "init_date",
          "finish_date",
          "status",
          "observation",
          "price",
          "clientId",
          "fieldId",
          "serviceId",
        ],
        actions: {
          exportWorkOrderCSV: {
            actionType: "record",
            icon: "Document",
            label: "Export WorkOrder CSV",
            handler: async (
              request: ActionRequest,
              response: Response,
              context: ActionContext
            ) => {
              const workOrder = context.record;
              if (!workOrder) throw new Error("WorkOrder no encontrada");

              // Traer detalles de maquinaria
              const machineryDetails = await MachineryDetail.findAll({
                where: { workOrderId: workOrder.param("id") },
                include: ["machinery"],
              });

              // Traer detalles de lotes
              const lotDetails = await LotDetail.findAll({
                where: { workOrderId: workOrder.param("id") },
                include: ["lot"],
              });

              // Convertir a CSV
              const parser = new Parser();
              const csvMachinery = parser.parse(
                machineryDetails.map((d) => d.toJSON())
              );
              const csvLots = parser.parse(lotDetails.map((d) => d.toJSON()));

              // Aquí podrías devolver ambos CSV separados, o combinarlos
              response.setHeader("Content-Type", "text/csv");
              response.setHeader(
                "Content-Disposition",
                `attachment; filename=workorder_${workOrder.param(
                  "id"
                )}_details.csv`
              );
              response.send(csvMachinery + "\n\n" + csvLots);

              return {};
            },
          },
        },
      },
    },
    {
      resource: MachineryDetail,
      options: {
        listProperties: ["id", "workOrderId", "machineryId"],
        showProperties: ["id", "workOrderId", "machineryId"],
      },
    },
    {
      resource: LotDetail,
      options: {
        listProperties: ["id", "workOrderId", "lotId", "area", "lat", "long"],
        showProperties: ["id", "workOrderId", "lotId", "area", "lat", "long"],
      },
    },
  ],
});

export default adminJs;
