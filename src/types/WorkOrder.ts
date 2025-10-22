import { MachineryType } from "./MachineryType";

export interface WorkOrderType {
  id: number;
  name: string;
  created_at: Date;
  init_date: Date;
  finish_date: Date;
  status: string;
  observation: string;
  clientId: number;
  fieldId: number;
  serviceId: number;
  price: number;
}

export interface MachineryDetailType {
  id: number;
  workOrderId: number;
  machineryId: number;
}

export interface LotDetailType {
  id: number;
  workOrderId: number;
  lotId: number;
  area: number;
  lat: number;
  long: number;
}

export interface WorkOrderResponse {
  id: number;
  name: string;
  created_at: string;
  init_date: Date;
  finish_date: Date;
  status: string;
  observation: string;
  clientId: number;
  fieldId: number;
  serviceId: number;
  price: number;
  machineryDetails: MachineryDetailType[];
  lotDetails: LotDetailType[];
}
