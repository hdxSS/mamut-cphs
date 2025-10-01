'use client';

import { AccionCorrectiva } from '@/types/investigacion';
import DateInput from '@/components/DateInput';
import { useRef, useState } from 'react';

interface AccionesCorrectivasProps {
  acciones: AccionCorrectiva[];
  onChange: (acciones: AccionCorrectiva[]) => void;
}

export default function AccionesCorrectivas({ acciones, onChange }: AccionesCorrectivasProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const [viewingImage, setViewingImage] = useState<string | null>(null);

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
          <div key={accion.id} className="flex items-end gap-2 p-3 border border-gray-200 rounded bg-gray-50">
            <div className="flex items-center pb-2">
              <input
                type="checkbox"
                checked={accion.completada}
                onChange={(e) => handleUpdateAccion(accion.id, 'completada', e.target.checked)}
                className="w-5 h-5 text-blue-600"
              />
            </div>

            {/* Attachment button with paperclip icon */}
            <div className="flex flex-col items-center gap-1 pb-2">
              <input
                ref={(el) => (fileInputRefs.current[accion.id] = el)}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(accion.id, e)}
                className="hidden"
                id={`file-${accion.id}`}
              />
              <label
                htmlFor={`file-${accion.id}`}
                className={`cursor-pointer p-2 rounded transition-colors ${
                  accion.adjunto
                    ? 'bg-green-100 hover:bg-green-200 text-green-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title={accion.adjunto ? 'Cambiar adjunto' : 'Adjuntar imagen'}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </label>
              {accion.adjunto && (
                <button
                  type="button"
                  onClick={() => setViewingImage(accion.adjunto || null)}
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                  title="Ver imagen adjunta"
                >
                  Ver
                </button>
              )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
              <label className="text-xs text-transparent font-medium mb-1 select-none">
                Placeholder
              </label>
              <input
                type="text"
                value={accion.descripcion}
                onChange={(e) => handleUpdateAccion(accion.id, 'descripcion', e.target.value)}
                placeholder="Descripción de la acción correctiva..."
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <div className="flex-shrink-0 flex flex-col">
              <label className="text-xs text-blue-600 font-medium mb-1 text-center">
                Fecha de revisión
              </label>
              <DateInput
                value={accion.fechaRecordatorio}
                onChange={(value) => handleUpdateAccion(accion.id, 'fechaRecordatorio', value)}
                className="border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={() => handleRemoveAccion(accion.id)}
              className="text-red-600 hover:text-red-800 font-bold text-xl px-2 flex-shrink-0 pb-2"
              title="Eliminar acción"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Image Viewer Modal */}
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingImage(null)}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 text-xl font-bold"
              title="Cerrar"
            >
              ×
            </button>
            <img
              src={viewingImage}
              alt="Adjunto"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
