export interface AccionCorrectiva {
  id: string;
  descripcion: string;
  fechaRecordatorio: string;
  completada: boolean;
}

export interface Investigacion {
  id: string;
  nombre: string;
  edad: string;
  area: string;
  antiguedad: string;
  declaracionAccidente: string;
  fecha: string;
  acciones: AccionCorrectiva[];
  firma?: string; // Base64 encoded signature image
}

export interface SearchFilters {
  id?: string;
  nombre?: string;
}
