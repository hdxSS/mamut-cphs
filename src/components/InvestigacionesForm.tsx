'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Investigacion, AccionCorrectiva } from '@/types/investigacion';
import { storageService } from '@/lib/storageAPI';
import SearchModal from '@/components/SearchModal';
import AccionesCorrectivas from '@/components/AccionesCorrectivas';
import DateInput from '@/components/DateInput';
import SignaturePad from '@/components/SignaturePad';

const InvestigacionesForm = forwardRef<{ loadInvestigacion: (inv: Investigacion) => void }, { onSaved?: () => void }>((props, ref) => {
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
  const [shakeField, setShakeField] = useState<string | null>(null);

  // Refs for scrolling to fields
  const fechaRef = useRef<HTMLDivElement>(null);
  const nombreRef = useRef<HTMLDivElement>(null);
  const edadRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const antiguedadRef = useRef<HTMLDivElement>(null);
  const declaracionRef = useRef<HTMLDivElement>(null);
  const firmaAccidentadoRef = useRef<HTMLDivElement>(null);
  const firmaMiembroCPHSRef = useRef<HTMLDivElement>(null);
  const firmaDeptoSSomaRef = useRef<HTMLDivElement>(null);
  const firmaEncargadoAreaRef = useRef<HTMLDivElement>(null);

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

    // Validation: Check all required fields
    const validationErrors: { field: string; ref: React.RefObject<HTMLDivElement>; message: string }[] = [];

    if (!formData.fecha) {
      validationErrors.push({ field: 'fecha', ref: fechaRef, message: 'Fecha es requerida' });
    }
    if (!formData.nombre.trim()) {
      validationErrors.push({ field: 'nombre', ref: nombreRef, message: 'Nombre es requerido' });
    }
    if (!formData.edad.trim()) {
      validationErrors.push({ field: 'edad', ref: edadRef, message: 'Edad es requerida' });
    }
    if (!formData.area.trim()) {
      validationErrors.push({ field: 'area', ref: areaRef, message: 'Área es requerida' });
    }
    if (!showOtroAreaInput && !formData.antiguedad.trim()) {
      validationErrors.push({ field: 'antiguedad', ref: antiguedadRef, message: 'Antigüedad es requerida' });
    }
    if (!formData.declaracionAccidente.trim()) {
      validationErrors.push({ field: 'declaracionAccidente', ref: declaracionRef, message: 'Declaración de Accidente es requerida' });
    }
    if (!formData.firmaAccidentado || formData.firmaAccidentado === '') {
      validationErrors.push({ field: 'firmaAccidentado', ref: firmaAccidentadoRef, message: 'Firma Accidentado es requerida' });
    }
    if (!formData.firmaMiembroCPHS || formData.firmaMiembroCPHS === '') {
      validationErrors.push({ field: 'firmaMiembroCPHS', ref: firmaMiembroCPHSRef, message: 'Firma Miembro CPHS es requerida' });
    }
    if (!formData.firmaDeptoSSOMA || formData.firmaDeptoSSOMA === '') {
      validationErrors.push({ field: 'firmaDeptoSSoma', ref: firmaDeptoSSomaRef, message: 'Firma Depto SSOMA es requerida' });
    }
    if (!formData.firmaEncargadoArea || formData.firmaEncargadoArea === '') {
      validationErrors.push({ field: 'firmaEncargadoArea', ref: firmaEncargadoAreaRef, message: 'Firma Encargado del Área es requerida' });
    }

    // If there are validation errors, scroll to first one and shake it
    if (validationErrors.length > 0) {
      const firstError = validationErrors[0];

      // Scroll to the field
      if (firstError.ref.current) {
        firstError.ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Shake the field
      setShakeField(firstError.field);
      setTimeout(() => setShakeField(null), 2000);

      return;
    }

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
      acciones: [],
      firmaAccidentado: '',
      firmaMiembroCPHS: '',
      firmaDeptoSSOMA: '',
      firmaEncargadoArea: '',
      firmaGerenteArea: ''
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
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.5s;
          border: 2px solid #ef4444 !important;
          border-radius: 8px;
          padding: 8px;
          background-color: #fee2e2;
        }
      `}} />
      <div className="bg-white rounded-lg shadow-lg p-6">
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
            <div ref={fechaRef} className={shakeField === 'fecha' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Fecha *
              </label>
              <DateInput
                name="fecha"
                value={formData.fecha}
                onChange={(value) => setFormData(prev => ({ ...prev, fecha: value }))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div ref={nombreRef} className={shakeField === 'nombre' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div ref={edadRef} className={shakeField === 'edad' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Edad *
              </label>
              <input
                type="text"
                name="edad"
                value={formData.edad}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div ref={areaRef} className={shakeField === 'area' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Área *
              </label>
              <select
                name="area"
                value={showOtroAreaInput ? 'Otros' : formData.area}
                onChange={handleInputChange}
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
                  placeholder="Ingrese el área o empresa externa..."
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            ) : (
              <div ref={antiguedadRef} className={shakeField === 'antiguedad' ? 'shake' : ''}>
                <label className="block text-sm font-medium mb-1">
                  Antigüedad *
                </label>
                <input
                  type="text"
                  name="antiguedad"
                  value={formData.antiguedad}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            )}
          </div>

          <div ref={declaracionRef} className={shakeField === 'declaracionAccidente' ? 'shake' : ''}>
            <label className="block text-sm font-medium mb-1">
              Declaración de Accidente *
            </label>
            <textarea
              name="declaracionAccidente"
              value={formData.declaracionAccidente}
              onChange={handleInputChange}
              rows={6}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <AccionesCorrectivas
            acciones={formData.acciones}
            onChange={handleAccionesChange}
          />

          <div className="space-y-4 border-t-2 border-gray-300 pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-700">Firmas</h3>

            <div ref={firmaAccidentadoRef} className={shakeField === 'firmaAccidentado' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Firma Accidentado *
              </label>
              <SignaturePad
                value={formData.firmaAccidentado}
                onChange={(signature) => setFormData(prev => ({ ...prev, firmaAccidentado: signature }))}
              />
            </div>

            <div ref={firmaMiembroCPHSRef} className={shakeField === 'firmaMiembroCPHS' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Firma Miembro CPHS *
              </label>
              <SignaturePad
                value={formData.firmaMiembroCPHS}
                onChange={(signature) => setFormData(prev => ({ ...prev, firmaMiembroCPHS: signature }))}
              />
            </div>

            <div ref={firmaDeptoSSomaRef} className={shakeField === 'firmaDeptoSSoma' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Firma Depto SSOMA *
              </label>
              <SignaturePad
                value={formData.firmaDeptoSSOMA}
                onChange={(signature) => setFormData(prev => ({ ...prev, firmaDeptoSSOMA: signature }))}
              />
            </div>

            <div ref={firmaEncargadoAreaRef} className={shakeField === 'firmaEncargadoArea' ? 'shake' : ''}>
              <label className="block text-sm font-medium mb-1">
                Firma Encargado del Área *
              </label>
              <SignaturePad
                value={formData.firmaEncargadoArea}
                onChange={(signature) => setFormData(prev => ({ ...prev, firmaEncargadoArea: signature }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Firma Gerente Área
              </label>
              <SignaturePad
                value={formData.firmaGerenteArea}
                onChange={(signature) => setFormData(prev => ({ ...prev, firmaGerenteArea: signature }))}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded hover:bg-blue-700 font-semibold"
          >
            Grabar
          </button>

          {isSaved && (
            <div className="mt-4 p-3 bg-green-100 text-green-700 rounded flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-semibold">¡Investigación guardada exitosamente!</span>
            </div>
          )}
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
