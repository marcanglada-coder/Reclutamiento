
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Wizard } from './components/Wizard';
import { OperatorPanel } from './components/OperatorPanel';
import { GrowthKit } from './components/GrowthKit';
import { Candidate, CandidateStatus, CandidatePath } from './types';
import { INITIAL_OFFERS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'operator'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPath, setSelectedPath] = useState<CandidatePath | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: 'c1',
        name: 'Carlos Rodríguez',
        email: 'carlos@transporte.es',
        phone: '611223344',
        path: CandidatePath.AUTONOMO_COLD,
        vehicleModel: 'Iveco Daily Frío',
        hasRefrigeration: true,
        documentsUploaded: [],
        status: CandidateStatus.PENDING,
        zone: 'Barcelona Ciudad',
        createdAt: Date.now() - 86400000
      }
    ];
    setCandidates(mockCandidates);
  }, []);

  const handleWizardComplete = (data: Partial<Candidate>) => {
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      documentsUploaded: [],
    } as Candidate;

    setCandidates([newCandidate, ...candidates]);
    setIsSuccess(true);
    setShowWizard(false);
  };

  const updateCandidateStatus = (id: string, status: CandidateStatus) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  if (isSuccess) {
    return (
      <Layout activeView={view} onViewChange={setView}>
        <div className="container mx-auto px-4 text-center py-20 animate-fadeIn">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8">✓</div>
          <h1 className="text-4xl font-extrabold mb-4">¡Registro Recibido!</h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto mb-10">Tu solicitud está en nuestro departamento de tráfico. Te contactaremos vía WhatsApp para la entrevista.</p>
          <button onClick={() => setIsSuccess(false)} className="bg-black text-white px-10 py-4 rounded-2xl font-bold">Volver</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeView={view} onViewChange={setView}>
      {view === 'candidate' ? (
        <div className="space-y-24">
          {!showWizard && (
            <section className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center animate-fadeIn">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  📍 Nodos Logísticos en Sant Boi, Barberà y BCN
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight">
                  Rutas fijas y <span className="relative text-blue-600">estabilidad<span className="absolute -bottom-1 left-0 w-full h-3 bg-blue-400/20 -z-10"></span></span> mensual.
                </h1>
                <p className="text-xl text-gray-500 max-w-lg leading-relaxed">
                  Logística sanitaria, alimentaria y general. Pago mensual por factura. Rutas locales y peninsulares según tu vehículo.
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setShowWizard(true); setSelectedPath(CandidatePath.AUTONOMO_COLD); }}
                      className="bg-black text-white px-6 py-5 rounded-2xl font-bold text-base hover:scale-[1.02] transition shadow-lg flex items-center justify-center gap-3"
                    >
                      <span>Vehículo Refrigerado</span>
                      <span className="bg-blue-500 text-[10px] px-2 py-0.5 rounded-full">Farma/Clínico</span>
                    </button>
                    <button 
                      onClick={() => { setShowWizard(true); setSelectedPath(CandidatePath.AUTONOMO_NO_COLD); }}
                      className="bg-white border-2 border-black text-black px-6 py-5 rounded-2xl font-bold text-base hover:bg-gray-50 transition"
                    >
                      Vehículo Sin Frío
                    </button>
                  </div>
                  <button 
                    onClick={() => { setShowWizard(true); setSelectedPath(CandidatePath.ASALARIADO_A_AUTONOMO); }}
                    className="w-full bg-yellow-400 text-black px-6 py-4 rounded-2xl font-extrabold text-base hover:bg-yellow-300 transition"
                  >
                    Soy asalariado y quiero ser autónomo 🚀
                  </button>
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="hexagon w-64 h-72 bg-blue-50 absolute -top-12 -left-12 -z-10"></div>
                <div className="relative flex flex-col gap-4 items-center">
                  <div className="hexagon w-56 h-64 bg-gray-200 overflow-hidden shadow-2xl rotate-3">
                    <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="logistica barcelona" />
                  </div>
                  <div className="hexagon w-48 h-56 bg-blue-900 flex flex-col items-center justify-center p-6 text-center text-white -mt-20 ml-40 shadow-2xl">
                    <div className="text-3xl mb-2">💊</div>
                    <div className="text-sm font-bold uppercase">Rutas Farma</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {showWizard && (
            <div className="animate-slideUp">
               <div className="max-w-4xl mx-auto px-4 mb-12 flex items-center justify-between">
                 <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-black font-bold flex items-center gap-2">← Volver</button>
                 <h2 className="text-xl font-extrabold">Formulario de Captación</h2>
                 <div className="w-24"></div>
               </div>
               <Wizard onComplete={handleWizardComplete} initialPath={selectedPath} />
            </div>
          )}

          {!showWizard && (
            <section className="bg-gray-50 py-16 border-y">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">PAGO</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Mensual por factura</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">365d</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Rutas Estables</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-black mb-2">BCN</div>
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400">Sant Boi / Barberà / AMB</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!showWizard && (
            <section className="container mx-auto px-4 md:px-8 pb-20">
              <h2 className="text-4xl font-extrabold tracking-tight mb-12">Rutas Disponibles</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {INITIAL_OFFERS.map(offer => (
                  <div key={offer.id} className="group p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl hover:-translate-y-2 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">
                        {offer.requiresCold ? '❄️' : '📦'}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                        {offer.sector}
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold mb-3">{offer.title}</h3>
                    <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">📍 {offer.zone}</div>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {offer.requirements.map(req => (
                        <span key={req} className="bg-gray-50 px-3 py-1 rounded-lg text-xs font-bold text-gray-400">{req}</span>
                      ))}
                    </div>
                    <button onClick={() => setShowWizard(true)} className="w-full bg-black text-white py-4 rounded-2xl font-bold group-hover:bg-blue-600 transition">Solicitar Ruta</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-12 pb-24">
          <OperatorPanel candidates={candidates} onUpdateStatus={updateCandidateStatus} />
          <div className="container mx-auto px-4 md:px-8">
            <GrowthKit />
          </div>
        </div>
      )}

      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <span className="font-extrabold tracking-tight">FarmaRoutes.</span>
          <div className="flex gap-8 text-sm font-bold text-gray-400">
            <a href="#">Privacidad</a>
            <a href="#">Sedes Barcelona</a>
            <a href="#">Facturación Mensual</a>
          </div>
          <div className="text-xs text-gray-400">© 2024 Logística Farma BCN.</div>
        </div>
      </footer>
    </Layout>
  );
};

export default App;
