export interface MachineryType {
  id?: number;
  name: string;
  type: string;
  brand: string;
  model: string;
  patent?: string;
  status: "En Uso" | "Mantenimiento" | "Disponible" | "Fuera de Servicio";
}

export interface MachineryDetailType {
  id?: number;
  workOrderId: number;
  machineryId: number;

  // Campo opcional que se cargará cuando uses include
  Machinery?: {
    id: number;
    name: string;
    type: string;
    brand: string;
    model: string;
    patent: string;
    status: string;
  };
}

export interface MachineryDetailWithObj extends MachineryDetailType {
  Machinery: {
    id: number;
    name: string;
    type: string;
    brand: string;
    model: string;
    patent: string;
    status: string;
  };
}
