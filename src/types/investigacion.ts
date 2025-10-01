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
  firmaAccidentado?: string;
  firmaMiembroCPHS?: string;
  firmaDeptoSSOMA?: string;
  firmaEncargadoArea?: string;
  firmaGerenteArea?: string;
}

export interface SearchFilters {
  id?: string;
  nombre?: string;
}
