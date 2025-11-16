export interface MachineryType {
  id?: number;
  name: string;
  type: string;
  brand: string;
  model: string;
  patent?: string;
  status: "En Uso" | "Mantenimiento" | "Disponible" | "Fuera de Servicio";
}
