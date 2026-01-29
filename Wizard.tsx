
import React, { useState } from 'react';
import { CandidatePath, CandidateStatus, Candidate } from '../types';

interface WizardProps {
  onComplete: (candidate: Partial<Candidate>) => void;
  initialPath?: CandidatePath;
}

export const Wizard: React.FC<WizardProps> = ({ onComplete, initialPath }) => {
  const [step, setStep] = useState(initialPath ? 1 : 0);
  const [path, setPath] = useState<CandidatePath | null>(initialPath || null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleModel: '',
    hasRefrigeration: false,
    zone: ''
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const renderPathSelection = () => (
    <div className="grid md:grid-cols-3 gap-6 animate-fadeIn">
      <button 
        onClick={() => { setPath(CandidatePath.AUTONOMO_COLD); setStep(1); }}
        className="p-8 border-2 border-transparent hover:border-black bg-white rounded-3xl shadow-xl text-left group transition-all"
      >
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl mb-4">❄️</div>
        <h3 className="text-xl font-bold mb-2">Tengo Vehículo Frío</h3>
        <p className="text-gray-500 text-sm">Acceso directo a rutas Farma y Salud en BCN.</p>
        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-600">Prioridad Alta</div>
      </button>

      <button 
        onClick={() => { setPath(CandidatePath.AUTONOMO_NO_COLD); setStep(1); }}
        className="p-8 border-2 border-transparent hover:border-black bg-white rounded-3xl shadow-xl text-left group transition-all"
      >
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-4">🚐</div>
        <h3 className="text-xl font-bold mb-2">Vehículo Sin Frío</h3>
        <p className="text-gray-500 text-sm">Rutas multisector y plan de evolución a Farma.</p>
        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-600">Plan Crecimiento</div>
      </button>

      <button 
        onClick={() => { setPath(CandidatePath.ASALARIADO_A_AUTONOMO); setStep(1); }}
        className="p-8 border-2 border-transparent hover:border-black bg-white rounded-3xl shadow-xl text-left group transition-all"
      >
        <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-3xl mb-4">🚀</div>
        <h3 className="text-xl font-bold mb-2">Quiero ser Autónomo</h3>
        <p className="text-gray-500 text-sm">Te ayudamos a dar el salto con rutas estables desde el día 1.</p>
        <div className="mt-4 text-xs font-bold uppercase tracking-widest text-yellow-600">Nuevo Emprendedor</div>
      </button>
    </div>
  );

  const renderStep1 = () => (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-4">
      <h2 className="text-2xl font-bold">Datos Personales</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Nombre y Apellidos</label>
          <input className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ej. Juan Pérez" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Email</label>
            <input className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="juan@email.com" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Teléfono</label>
            <input className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="600000000" />
          </div>
        </div>
      </div>
      <button onClick={handleNext} className="w-full bg-black text-white py-4 rounded-xl font-bold mt-6">Continuar</button>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-4">
      <h2 className="text-2xl font-bold">Vehículo y Zona</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-1">Modelo de vehículo (si tienes)</label>
          <input className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.vehicleModel} onChange={e => setFormData({...formData, vehicleModel: e.target.value})} placeholder="Ej. Mercedes Sprinter" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1">Zona preferente</label>
          <select className="w-full p-3 bg-gray-50 border rounded-xl" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})}>
            <option value="">Seleccionar zona...</option>
            <option value="Barcelona Ciudad">Barcelona Ciudad</option>
            <option value="Sant Boi / Baix Llobregat">Sant Boi / Baix Llobregat</option>
            <option value="Barberà / Vallès">Barberà / Vallès</option>
            <option value="Maresme">Maresme</option>
          </select>
        </div>
        {path === CandidatePath.AUTONOMO_COLD && (
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-5 h-5" checked={formData.hasRefrigeration} onChange={e => setFormData({...formData, hasRefrigeration: e.target.checked})} />
              <span className="font-semibold text-blue-800 text-sm">Confirmo que el vehículo tiene equipo de frío</span>
            </label>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={handleBack} className="flex-1 border-2 border-black py-4 rounded-xl font-bold">Atrás</button>
        <button onClick={handleNext} className="flex-[2] bg-black text-white py-4 rounded-xl font-bold">Siguiente</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-2xl space-y-4">
      <h2 className="text-2xl font-bold">Adjuntar Documentación</h2>
      <p className="text-sm text-gray-500">Sube una foto de tu Carnet de Conducir o DNI para validar tu perfil rápido.</p>
      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center gap-4 hover:border-black transition-colors bg-gray-50">
        <div className="text-4xl">📸</div>
        <input type="file" className="hidden" id="file-upload" />
        <label htmlFor="file-upload" className="font-bold cursor-pointer">Adjuntar Imagen</label>
      </div>
      <div className="flex gap-4 mt-6">
        <button onClick={handleBack} className="flex-1 border-2 border-black py-4 rounded-xl font-bold">Atrás</button>
        <button onClick={() => onComplete({...formData, path: path!, status: CandidateStatus.PENDING})} className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-bold">Finalizar Registro</button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {step === 0 && renderPathSelection()}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  );
};
