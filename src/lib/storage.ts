import { Investigacion, AccionCorrectiva } from '@/types/investigacion';
import { formatDateToDDMMYYYY } from './dateUtils';

const STORAGE_KEY = 'mamut_cphs_investigaciones';
const COUNTER_KEY = 'mamut_cphs_counter';

export const storageService = {
  // Get next ID without incrementing counter
  getNextId: (): string => {
    if (typeof window === 'undefined') return '000001';

    const currentCounter = localStorage.getItem(COUNTER_KEY);
    const counter = currentCounter ? parseInt(currentCounter, 10) : 0;
    const nextCounter = counter + 1;

    return nextCounter.toString().padStart(6, '0');
  },

  // Generate and increment ID (only call when actually saving NEW investigation)
  generateId: (): string => {
    if (typeof window === 'undefined') return '000001';

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
        .map(acc => `[${acc.completada ? 'X' : ' '}] ${acc.descripcion} (${formatDateToDDMMYYYY(acc.fechaRecordatorio)})`)
        .join(' | ');

      return [
        inv.id,
        `"${inv.nombre.replace(/"/g, '""')}"`,
        inv.edad,
        `"${inv.area.replace(/"/g, '""')}"`,
        inv.antiguedad,
        formatDateToDDMMYYYY(inv.fecha),
        `"${inv.declaracionAccidente.replace(/"/g, '""')}"`,
        `"${accionesStr.replace(/"/g, '""')}"`
      ].join(',');
    });

    return `${headers.join(',')}\n${rows.join('\n')}`;
  },

  // Download single CSV with all data (always same filename)
  downloadCSV: (): void => {
    const csv = storageService.exportAllToCSV();
    if (!csv) return;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    // Fixed filename - always the same
    link.setAttribute('href', url);
    link.setAttribute('download', 'mamut_cphs_database.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Get pending reminders (within 3 days of due date or overdue)
  getPendingReminders: (): { investigacion: Investigacion; accion: AccionCorrectiva }[] => {
    const all = storageService.getAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const reminders: { investigacion: Investigacion; accion: AccionCorrectiva }[] = [];

    all.forEach(inv => {
      inv.acciones.forEach(accion => {
        if (!accion.completada && accion.fechaRecordatorio) {
          const reminderDate = new Date(accion.fechaRecordatorio);
          reminderDate.setHours(0, 0, 0, 0);

          // Show if: reminder is today or in the future AND within 3 days
          // OR reminder is overdue (in the past)
          if (reminderDate <= threeDaysFromNow) {
            reminders.push({ investigacion: inv, accion });
          }
        }
      });
    });

    return reminders;
  }
};

