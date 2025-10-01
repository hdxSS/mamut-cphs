'use client';

import { useState } from 'react';
import { Investigacion } from '@/types/investigacion';
import { storageService } from '@/lib/storageAPI';
import { formatDateToDDMMYYYY } from '@/lib/dateUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (investigacion: Investigacion) => void;
}

export default function SearchModal({ isOpen, onClose, onSelect }: SearchModalProps) {
  const [searchBy, setSearchBy] = useState<'id' | 'nombre'>('nombre');
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Investigacion[]>([]);

  if (!isOpen) return null;

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      const found = await storageService.search(searchTerm, searchBy);
      setResults(found);
    }
  };

  const handleSelect = (investigacion: Investigacion) => {
    onSelect(investigacion);
    onClose();
    setSearchTerm('');
    setResults([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Consultar Folio</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar por:</label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="nombre"
                  checked={searchBy === 'nombre'}
                  onChange={(e) => setSearchBy(e.target.value as 'nombre')}
                  className="mr-2"
                />
                Nombre
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="id"
                  checked={searchBy === 'id'}
                  onChange={(e) => setSearchBy(e.target.value as 'id')}
                  className="mr-2"
                />
                ID
              </label>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={`Buscar por ${searchBy}...`}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Buscar
          </button>

          {results.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Resultados ({results.length}):</h3>
              <div className="space-y-2">
                {results.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="p-3 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="font-semibold">{item.nombre}</div>
                    <div className="text-sm text-gray-600">ID: {item.id}</div>
                    <div className="text-sm text-gray-600">Fecha: {formatDateToDDMMYYYY(item.fecha)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchTerm && results.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No se encontraron resultados
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
