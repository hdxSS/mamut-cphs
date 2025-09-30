'use client';

import { useState, useEffect } from 'react';
import { Investigacion } from '@/types/investigacion';
import { storageService } from '@/lib/storage';
import SearchModal from '@/components/SearchModal';

export default function InvestigacionesForm() {
  const [formData, setFormData] = useState<Investigacion>({
    id: '',
    nombre: '',
    edad: '',
    area: '',
    antiguedad: '',
    declaracionAccidente: '',
    fecha: new Date().toISOString().split('T')[0]
  });

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOtroAreaInput, setShowOtroAreaInput] = useState(false);

  useEffect(() => {
    // Generate new ID on component mount
    setFormData(prev => ({ ...prev, id: storageService.generateId() }));
  }, []);

  const areas = [
    'Embalaje A',
    'Vigilancia',
    'Bodega de Despacho',
    'Bodega de Granel',
    'Mantención',
    'Embalaje B',
    'Galvanoplastía',
    'Control de Calidad',
    'Laminado',
    'Cabeceado',
    'RRHH',
    'Reponedores',
    'Vendedores Terreno',
    'Atención clientes',
    'Facturación',
    'Admin 2ndo piso',
    'Informática',
    'Otros'
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'area') {
      setShowOtroAreaInput(value === 'Otros');
      if (value !== 'Otros') {
        setFormData(prev => ({ ...prev, [name]: value }));
      } else {
        setFormData(prev => ({ ...prev, [name]: '' }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to storage
    storageService.save(formData);

    // Download CSV
    storageService.downloadCSV(formData);

    // Show success message
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);

    // Reset form with new ID
    setFormData({
      id: storageService.generateId(),
      nombre: '',
      edad: '',
      area: '',
      antiguedad: '',
      declaracionAccidente: '',
      fecha: new Date().toISOString().split('T')[0]
    });
  };

  const handleLoadInvestigacion = (investigacion: Investigacion) => {
    setFormData(investigacion);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {isSaved && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            ¡Investigación guardada exitosamente!
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Investigación</h2>
            <p className="text-sm text-gray-600">Folio: {formData.id}</p>
          </div>
          <button
            type="button"
            onClick={() => setIsSearchModalOpen(true)}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Consultar Folio
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha *
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Edad *
              </label>
              <input
                type="text"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Área *
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
              >
                <option value="">Seleccione un área...</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Antigüedad *
              </label>
              <input
                type="text"
                name="antiguedad"
                value={formData.antiguedad}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Declaración de Accidente *
            </label>
            <textarea
              name="declaracionAccidente"
              value={formData.declaracionAccidente}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 font-semibold"
          >
            Grabar
          </button>
        </form>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleLoadInvestigacion}
      />
    </div>
  );
}
