'use client';

import { AccionCorrectiva } from '@/types/investigacion';
import DateInput from '@/components/DateInput';
import { useRef } from 'react';

interface AccionesCorrectivasProps {
  acciones: AccionCorrectiva[];
  onChange: (acciones: AccionCorrectiva[]) => void;
}

export default function AccionesCorrectivas({ acciones, onChange }: AccionesCorrectivasProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleAddAccion = () => {
    const newAccion: AccionCorrectiva = {
      id: `accion-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      descripcion: '',
      fechaRecordatorio: '',
      completada: false,
      adjunto: ''
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

  const handleFileChange = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Por favor seleccione solo archivos de imagen');
      return;
    }

    // Compress the image
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas for compression
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Reduce to max 800px width while maintaining aspect ratio
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        if (ctx) {
          // Fill white background
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          // Draw image
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.6 quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
          handleUpdateAccion(id, 'adjunto', compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (id: string) => {
    handleUpdateAccion(id, 'adjunto', '');
    // Clear the file input
    if (fileInputRefs.current[id]) {
      fileInputRefs.current[id]!.value = '';
    }
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

        {acciones.map((accion) => (
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
              <DateInput
                value={accion.fechaRecordatorio}
                onChange={(value) => handleUpdateAccion(accion.id, 'fechaRecordatorio', value)}
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
