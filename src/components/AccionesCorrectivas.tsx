'use client';

import { AccionCorrectiva } from '@/types/investigacion';

interface AccionesCorrectivasProps {
  acciones: AccionCorrectiva[];
  onChange: (acciones: AccionCorrectiva[]) => void;
}

export default function AccionesCorrectivas({ acciones, onChange }: AccionesCorrectivasProps) {
  const handleAddAccion = () => {
    const newAccion: AccionCorrectiva = {
      id: `accion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      descripcion: '',
      fechaRecordatorio: '',
      completada: false
    };
    onChange([...acciones, newAccion]);
  };

  const handleRemoveAccion = (id: string) => {
    onChange(acciones.filter(acc => acc.id !== id));
  };

  const handleUpdateAccion = (id: string, field: keyof AccionCorrectiva, value: string | boolean) => {
    onChange(
      acciones.map(acc =>
        acc.id === id ? { ...acc, [field]: value } : acc
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Acciones a Tomar</h3>
        <button
          type="button"
          onClick={handleAddAccion}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          Agregar Acción
        </button>
      </div>

      <div className="space-y-3">
        {acciones.length === 0 && (
          <p className="text-gray-500 text-sm italic">No hay acciones correctivas agregadas.</p>
        )}

        {acciones.map((accion, index) => (
          <div key={accion.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded bg-gray-50">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={accion.completada}
                onChange={(e) => handleUpdateAccion(accion.id, 'completada', e.target.checked)}
                className="w-5 h-5 text-blue-600"
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                value={accion.descripcion}
                onChange={(e) => handleUpdateAccion(accion.id, 'descripcion', e.target.value)}
                placeholder="Descripción de la acción correctiva..."
                required={!accion.completada}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <input
                type="date"
                value={accion.fechaRecordatorio}
                onChange={(e) => handleUpdateAccion(accion.id, 'fechaRecordatorio', e.target.value)}
                required={!accion.completada}
                className="border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveAccion(accion.id)}
              className="text-red-600 hover:text-red-800 font-bold text-xl px-2"
              title="Eliminar acción"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
