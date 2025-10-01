import { Investigacion, AccionCorrectiva } from '@/types/investigacion';
import { formatDateToDDMMYYYY } from './dateUtils';

export const storageService = {
  // Get next ID without incrementing counter
  getNextId: async (): Promise<string> => {
    try {
      const response = await fetch('/api/counter');
      const data = await response.json();
      return data.nextId || '000001';
    } catch (error) {
      console.error('Error getting next ID:', error);
      return '000001';
    }
  },

  // Generate and increment ID (only call when actually saving NEW investigation)
  generateId: async (): Promise<string> => {
    try {
      const response = await fetch('/api/counter', { method: 'POST' });
      const data = await response.json();
      return data.id || '000001';
    } catch (error) {
      console.error('Error generating ID:', error);
      return '000001';
    }
  },

  // Save investigacion (new or update)
  save: async (investigacion: Investigacion, isUpdate: boolean = false): Promise<void> => {
    try {
      const response = await fetch('/api/investigaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ investigacion, isUpdate })
      });

      if (!response.ok) {
        throw new Error('Failed to save investigacion');
      }
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    }
  },

  // Get all investigaciones
  getAll: async (): Promise<Investigacion[]> => {
    try {
      const response = await fetch('/api/investigaciones');
      const data = await response.json();

      // Transform database format to app format
      return data.map((item: any) => ({
        id: item.folio_id,
        nombre: item.nombre,
        edad: item.edad,
        area: item.area,
        antiguedad: item.antiguedad,
        declaracionAccidente: item.declaracion_accidente,
        fecha: item.fecha,
        acciones: item.acciones || [],
        firmaAccidentado: item.firma_accidentado || '',
        firmaMiembroCPHS: item.firma_miembro_cphs || '',
        firmaDeptoSSOMA: item.firma_depto_ssoma || '',
        firmaEncargadoArea: item.firma_encargado_area || '',
        firmaGerenteArea: item.firma_gerente_area || ''
      }));
    } catch (error) {
      console.error('Error fetching all:', error);
      return [];
    }
  },

  // Search investigaciones
  search: async (searchTerm: string, searchBy: 'id' | 'nombre'): Promise<Investigacion[]> => {
    const all = await storageService.getAll();
    const term = searchTerm.toLowerCase().trim();

    return all.filter((item) => {
      const value = item[searchBy].toLowerCase();
      return value.includes(term);
    });
  },

  // Get by ID
  getById: async (id: string): Promise<Investigacion | undefined> => {
    const all = await storageService.getAll();
    return all.find((item) => item.id === id);
  },

  // Export all to single CSV
  exportAllToCSV: async (): Promise<string> => {
    const all = await storageService.getAll();
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
  downloadCSV: async (): Promise<void> => {
    const csv = await storageService.exportAllToCSV();
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
  getPendingReminders: async (): Promise<{ investigacion: Investigacion; accion: AccionCorrectiva }[]> => {
    const all = await storageService.getAll();
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
