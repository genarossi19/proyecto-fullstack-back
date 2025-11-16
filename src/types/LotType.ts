export interface LotType {
  id: number;
  name: string;
  area: number;
  lat: number;
  long: number;
  active: boolean;
  fieldId: number;
}

export interface LotDetailType {
  id?: number;
  workOrderId: number;
  lotId: number;
  area: number;
  lat: number;
  long: number;

  // Campo opcional que se cargará cuando uses include
  Lot?: {
    id: number;
    name: string;
    area: number;
    lat: number;
    long: number;
  };
}

export interface LotDetailWithObj extends LotDetailType {
  Lot: {
    id: number;
    name: string;
    area: number;
    lat: number;
    long: number;
  };
}
