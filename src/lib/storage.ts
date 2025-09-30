import { Investigacion } from '@/types/investigacion';

const STORAGE_KEY = 'mamut_cphs_investigaciones';

export const storageService = {
  // Generate unique ID
  generateId: (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `INV-${timestamp}-${random}`;
  },

  // Save investigacion
  save: (investigacion: Investigacion): void => {
    const existing = storageService.getAll();
    existing.push(investigacion);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  },

  // Get all investigaciones
  getAll: (): Investigacion[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  // Search investigaciones
  search: (searchTerm: string, searchBy: 'id' | 'nombre'): Investigacion[] => {
    const all = storageService.getAll();
    const term = searchTerm.toLowerCase().trim();

    return all.filter((item) => {
      const value = item[searchBy].toLowerCase();
      return value.includes(term);
    });
  },

  // Get by ID
  getById: (id: string): Investigacion | undefined => {
    const all = storageService.getAll();
    return all.find((item) => item.id === id);
  },

  // Export to CSV
  exportToCSV: (investigacion: Investigacion): string => {
    const headers = ['ID', 'Nombre', 'Edad', 'Área', 'Antigüedad', 'Fecha', 'Declaración de Accidente'];
    const values = [
      investigacion.id,
      investigacion.nombre,
      investigacion.edad,
      investigacion.area,
      investigacion.antiguedad,
      investigacion.fecha,
      `"${investigacion.declaracionAccidente.replace(/"/g, '""')}"` // Escape quotes
    ];

    return `${headers.join(',')}\n${values.join(',')}`;
  },

  // Download CSV file
  downloadCSV: (investigacion: Investigacion): void => {
    const csv = storageService.exportToCSV(investigacion);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `investigacion_${investigacion.id}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
