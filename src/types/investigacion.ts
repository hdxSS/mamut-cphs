export interface Investigacion {
  id: string;
  nombre: string;
  edad: string;
  area: string;
  antiguedad: string;
  declaracionAccidente: string;
  fecha: string;
}

export interface SearchFilters {
  id?: string;
  nombre?: string;
}
