'use client';

import { useState, useEffect } from 'react';
import { storageService } from '@/lib/storageAPI';
import { Investigacion, AccionCorrectiva } from '@/types/investigacion';
import { formatDateToDDMMYYYY } from '@/lib/dateUtils';

interface NotificationBellProps {
  onReminderClick?: (investigacion: Investigacion) => void;
}

export default function NotificationBell({ onReminderClick }: NotificationBellProps) {
  const [reminders, setReminders] = useState<{ investigacion: Investigacion; accion: AccionCorrectiva }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check reminders on mount and every hour
    const checkReminders = async () => {
      const pending = await storageService.getPendingReminders();
      setReminders(pending);
    };

    checkReminders();
    const interval = setInterval(checkReminders, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="relative">
        <button type="button" className="relative p-2 text-white hover:bg-blue-700 rounded">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </button>
      </div>
    );
  }

  const handleReminderClick = (inv: Investigacion) => {
    setIsOpen(false);
    if (onReminderClick) {
      onReminderClick(inv);
    }
  };

  const getDaysUntil = (dateStr: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-blue-700 rounded"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {reminders.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {reminders.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recordatorios Pendientes</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {reminders.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay recordatorios pendientes
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {reminders.map(({ investigacion, accion }) => {
                  const daysUntil = getDaysUntil(accion.fechaRecordatorio);
                  return (
                    <div
                      key={`${investigacion.id}-${accion.id}`}
                      onClick={() => handleReminderClick(investigacion)}
                      className="p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="font-medium text-gray-900">
                          Folio: {investigacion.id}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded ${
                            daysUntil === 0
                              ? 'bg-red-100 text-red-800'
                              : daysUntil === 1
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {daysUntil === 0
                            ? 'Hoy'
                            : daysUntil === 1
                            ? 'Mañana'
                            : `En ${daysUntil} días`}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {investigacion.nombre}
                      </div>
                      <div className="text-sm text-gray-900">
                        📋 {accion.descripcion}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Fecha: {formatDateToDDMMYYYY(accion.fechaRecordatorio)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
