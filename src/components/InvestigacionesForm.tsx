'use client';

import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Investigacion, AccionCorrectiva } from '@/types/investigacion';
import { storageService } from '@/lib/storageAPI';
import SearchModal from '@/components/SearchModal';
import AccionesCorrectivas from '@/components/AccionesCorrectivas';
import DateInput from '@/components/DateInput';
import SignaturePad from '@/components/SignaturePad';

const InvestigacionesForm = forwardRef<any, { onSaved?: () => void }>((props, ref) => {
  const { onSaved } = props;
  const [formData, setFormData] = useState<Investigacion>({
    id: '000001',
    nombre: '',
    edad: '',
    area: '',
    antiguedad: '',
    declaracionAccidente: '',
    fecha: new Date().toISOString().split('T')[0],
    acciones: [],
    firmaAccidentado: '',
    firmaMiembroCPHS: '',
    firmaDeptoSSOMA: '',
    firmaEncargadoArea: '',
    firmaGerenteArea: ''
  });

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOtroAreaInput, setShowOtroAreaInput] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Show next available ID (without incrementing counter)
    const loadNextId = async () => {
      const nextId = await storageService.getNextId();
      setFormData(prev => ({ ...prev, id: nextId }));
    };
    loadNextId();
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
    'Ingeniería',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If new entry, generate and assign the ID now
    let dataToSave = formData;
    if (!isUpdate) {
      const newId = await storageService.generateId();
      dataToSave = { ...formData, id: newId };
    }

    // Save to storage (update if existing, new if not)
    await storageService.save(dataToSave, isUpdate);

    // Notify parent that data was saved
    if (onSaved) {
      onSaved();
    }

    // Show success message
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);

    // Reset form with next available ID (preview only, not incremented yet)
    const nextId = await storageService.getNextId();
    setFormData({
      id: nextId,
      nombre: '',
      edad: '',
      area: '',
      antiguedad: '',
      declaracionAccidente: '',
      fecha: new Date().toISOString().split('T')[0],
      acciones: []
    });
    setShowOtroAreaInput(false);
    setIsUpdate(false);
  };

  const handleLoadInvestigacion = (investigacion: Investigacion) => {
    setFormData(investigacion);
    setIsUpdate(true);
    // Check if loaded area is not in the predefined list (meaning it's a custom "Otros" value)
    const isCustomArea = !areas.filter(a => a !== 'Otros').includes(investigacion.area);
    setShowOtroAreaInput(isCustomArea);
  };

  const handleAccionesChange = (acciones: AccionCorrectiva[]) => {
    setFormData(prev => ({ ...prev, acciones }));
  };

  // Expose method to parent component
  useImperativeHandle(ref, () => ({
    loadInvestigacion: handleLoadInvestigacion
  }));

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
              <DateInput
                name="fecha"
                value={formData.fecha}
                onChange={(value) => setFormData(prev => ({ ...prev, fecha: value }))}
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
                value={showOtroAreaInput ? 'Otros' : formData.area}
                onChange={handleInputChange}
                required={!showOtroAreaInput}
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

            {showOtroAreaInput ? (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Especificar Área (Personal Externo) *
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  placeholder="Ingrese el área o empresa externa..."
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ) : (
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
            )}
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

          <AccionesCorrectivas
            acciones={formData.acciones}
            onChange={handleAccionesChange}
          />

          <div>
            <label className="block text-sm font-medium mb-1">
              Firma *
            </label>
            <SignaturePad
              value={formData.firma}
              onChange={(signature) => setFormData(prev => ({ ...prev, firma: signature }))}
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
});

InvestigacionesForm.displayName = 'InvestigacionesForm';

export default InvestigacionesForm;
