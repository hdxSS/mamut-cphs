import { Investigacion, AccionCorrectiva } from '@/types/investigacion';

const STORAGE_KEY = 'mamut_cphs_investigaciones';
const COUNTER_KEY = 'mamut_cphs_counter';

export const storageService = {
  // Generate sequential 6-digit ID
  generateId: (): string => {
    if (typeof window === 'undefined') return '000000';

    const currentCounter = localStorage.getItem(COUNTER_KEY);
    const counter = currentCounter ? parseInt(currentCounter, 10) : 0;
    const newCounter = counter + 1;

    localStorage.setItem(COUNTER_KEY, newCounter.toString());
    return newCounter.toString().padStart(6, '0');
  },

  // Save investigacion (new or update)
  save: (investigacion: Investigacion, isUpdate: boolean = false): void => {
    const existing = storageService.getAll();

    if (isUpdate) {
      // Update existing entry
      const index = existing.findIndex(item => item.id === investigacion.id);
      if (index !== -1) {
        existing[index] = investigacion;
      } else {
        existing.push(investigacion);
      }
    } else {
      // New entry
      existing.push(investigacion);
    }

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

  // Export all to single CSV
  exportAllToCSV: (): string => {
    const all = storageService.getAll();
    if (all.length === 0) return '';

    const headers = [
      'ID',
      'Nombre',
      'Edad',
      'Área',
      'Antigüedad',
      'Fecha',
      'Declaración de Accidente',
      'Acciones Correctivas'
    ];

    const rows = all.map(inv => {
      const accionesStr = inv.acciones
        .map(acc => `[${acc.completada ? 'X' : ' '}] ${acc.descripcion} (${acc.fechaRecordatorio})`)
        .join(' | ');

      return [
        inv.id,
        `"${inv.nombre.replace(/"/g, '""')}"`,
        inv.edad,
        `"${inv.area.replace(/"/g, '""')}"`,
        inv.antiguedad,
        inv.fecha,
        `"${inv.declaracionAccidente.replace(/"/g, '""')}"`,
        `"${accionesStr.replace(/"/g, '""')}"`
      ].join(',');
    });

    return `${headers.join(',')}\n${rows.join('\n')}`;
  },

  // Download single CSV with all data
  downloadCSV: (): void => {
    const csv = storageService.exportAllToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `mamut_cphs_database_${fecha}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Get pending reminders (3 days or less until due date)
  getPendingReminders: (): { investigacion: Investigacion; accion: AccionCorrectiva }[] => {
    const all = storageService.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const reminders: { investigacion: Investigacion; accion: AccionCorrectiva }[] = [];

    all.forEach(inv => {
      inv.acciones.forEach(accion => {
        if (!accion.completada) {
          const reminderDate = new Date(accion.fechaRecordatorio);
          reminderDate.setHours(0, 0, 0, 0);

          if (reminderDate <= threeDaysFromNow && reminderDate >= today) {
            reminders.push({ investigacion: inv, accion });
          }
        }
      });
    });

    return reminders;
  }
};

