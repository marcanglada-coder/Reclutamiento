import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Wizard } from './components/Wizard';
import { OperatorPanel } from './components/OperatorPanel';
import { GrowthKit } from './components/GrowthKit';
import { Candidate, CandidateStatus, CandidatePath } from './types';
import { INITIAL_OFFERS, MODERN_IMAGES } from './constants';
import { analyzeCandidate } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'operator'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedPath, setSelectedPath] = useState<CandidatePath | undefined>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const mockCandidates: Candidate[] = [
      {
        id: 'c1',
        name: 'Carlos Rodríguez',
        email: 'carlos@transporte.es',
        phone: '611223344',
        path: CandidatePath.AUTONOMO_COLD,
        vehicleModel: 'Mercedes eSprinter EV Frío',
        hasRefrigeration: true,
        documentsUploaded: [],
        status: CandidateStatus.PENDING,
        zone: 'Sant Boi de Llobregat',
        createdAt: Date.now() - 86400000
      }
    ];
    setCandidates(mockCandidates);
  }, []);

  const handleWizardComplete = async (data: Partial<Candidate>) => {
    setIsAnalyzing(true);
    try {
      await analyzeCandidate(data); 
    } catch (e) {
      console.warn("Fallo análisis IA, procediendo manualmente");
    }
    
    const newCandidate: Candidate = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      documentsUploaded: [],
      status: CandidateStatus.PENDING,
    } as Candidate;

    setCandidates([newCandidate, ...candidates]);
    setIsAnalyzing(false);
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
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-inner">✓</div>
          <h1 className="text-4xl font-extrabold mb-4 tracking-tight">¡Registro Completado!</h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto mb-10 leading-relaxed">Nuestra IA ha procesado tu perfil. Un gestor de rutas se pondrá en contacto contigo por WhatsApp hoy mismo.</p>
          <button onClick={() => setIsSuccess(false)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-blue-700 transition transform hover:scale-105">Volver al Inicio</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout activeView={view} onViewChange={setView}>
      {view === 'candidate' ? (
        <div className="space-y-24">
          {!showWizard && (
            <section className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-16 items-center animate-fadeIn pt-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                  🚀 Operadora Logística Barcelona
                </div>
                <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter text-gray-900">
                  Rutas fijas. <br/><span className="text-blue-600">Gana más.</span>
                </h1>
                <p className="text-xl text-gray-500 max-w-lg leading-relaxed font-medium">
                  Buscamos autónomos con furgoneta para logística sanitaria y de alimentación. Pagos mensuales garantizados y rutas estables todo el año en Barcelona y AMB.
                </p>
                <div className="flex flex-col gap-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => { setShowWizard(true); setSelectedPath(CandidatePath.AUTONOMO_COLD); }}
                      className="bg-black text-white px-8 py-7 rounded-[2.5rem] font-black text-xl hover:scale-[1.05] transition shadow-2xl border-b-4 border-blue-600"
                    >
                      FURGÓN FRÍO ❄️
                    </button>
                    <button 
                      onClick={() => { setShowWizard(true); setSelectedPath(CandidatePath.AUTONOMO_NO_COLD); }}
                      className="bg-white border-2 border-gray-100 text-black px-8 py-7 rounded-[2.5rem] font-black text-xl hover:bg-gray-50 transition shadow-lg"
                    >
                      CARGA SECA 🚐
                    </button>
                  </div>
                  <button 
                    onClick={() => { setShowWizard(true); setSelectedPath(CandidatePath.ASALARIADO_A_AUTONOMO); }}
                    className="w-full bg-yellow-400 text-black px-8 py-5 rounded-[2.5rem] font-black text-xl hover:bg-yellow-300 transition shadow-xl flex items-center justify-center gap-3"
                  >
                    🚀 HAZTE AUTÓNOMO CON NOSOTROS
                  </button>
                </div>
              </div>

              <div className="relative group hidden md:block">
                <div className="absolute -top-20 -right-20 w-[120%] h-[120%] bg-blue-600/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  <div className="space-y-6 pt-16">
                    <div className="rounded-[3.5rem] overflow-hidden shadow-2xl h-[400px] border-8 border-white">
                      <img src={MODERN_IMAGES.refrigerated} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" alt="furgoneta frio" />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="rounded-[3.5rem] overflow-hidden shadow-2xl h-[400px] border-8 border-white">
                      <img src={MODERN_IMAGES.electric} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" alt="furgoneta electrica" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {showWizard && (
            <div className="animate-slideUp py-10">
               <div className="max-w-4xl mx-auto px-4 mb-12 flex items-center justify-between">
                 <button onClick={() => setShowWizard(false)} className="text-gray-400 hover:text-black font-bold flex items-center gap-2">← Cancelar Registro</button>
                 <h2 className="text-xl font-black uppercase tracking-tighter text-blue-600">Alta de Transportista</h2>
                 <div className="w-24"></div>
               </div>
               {isAnalyzing ? (
                 <div className="text-center py-20 space-y-6">
                   <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                   <p className="font-black text-2xl text-gray-800">La IA de FarmaRoutes está validando tus datos...</p>
                   <p className="text-gray-400">Analizando idoneidad para rutas sanitarias críticas.</p>
                 </div>
               ) : (
                 <Wizard onComplete={handleWizardComplete} initialPath={selectedPath} />
               )}
            </div>
          )}

          {!showWizard && (
            <section className="bg-white py-24 border-y border-gray-50">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                  <div className="text-center space-y-2">
                    <div className="text-5xl font-black text-gray-900">100%</div>
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Pagos Seguros</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-5xl font-black text-gray-900">365d</div>
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Rutas Estables</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-5xl font-black text-gray-900">BCN</div>
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Centro Logístico</div>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="text-5xl font-black text-gray-900">IA</div>
                    <div className="text-[11px] font-black uppercase tracking-[0.3em] text-blue-600">Gestión Digital</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {!showWizard && (
            <section className="container mx-auto px-4 md:px-8 pb-32">
              <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                <div>
                  <h2 className="text-6xl font-black tracking-tighter">Ofertas Disponibles</h2>
                  <p className="text-gray-500 mt-4 text-xl font-medium">Elige tu ruta y el tipo de servicio. Empezamos en 24h.</p>
                </div>
                <div className="bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl">
                  {INITIAL_OFFERS.length} Rutas Activas
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
                {INITIAL_OFFERS.map(offer => (
                  <div key={offer.id} className="group p-10 bg-white border border-gray-100 rounded-[3.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 border-b-8 border-b-transparent hover:border-b-blue-600">
                    <div className="flex justify-between items-start mb-10">
                      <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-4xl shadow-inner group-hover:bg-blue-50 transition">
                        {offer.requiresCold ? '❄️' : '📦'}
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full bg-blue-50 text-blue-600">
                        {offer.sector}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-4 group-hover:text-blue-600 transition-colors leading-tight">{offer.title}</h3>
                    <div className="text-sm text-gray-500 mb-10 flex items-center gap-2 font-bold uppercase tracking-widest opacity-60">📍 {offer.zone}</div>
                    <div className="flex flex-wrap gap-2 mb-12">
                      {offer.requirements.map(req => (
                        <span key={req} className="bg-gray-50 px-5 py-2.5 rounded-2xl text-[9px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">{req}</span>
                      ))}
                    </div>
                    <button onClick={() => setShowWizard(true)} className="w-full bg-black text-white py-6 rounded-3xl font-black text-lg group-hover:bg-blue-600 transition shadow-xl">Postular Ahora</button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="space-y-12 pb-24">
          <OperatorPanel candidates={candidates} onUpdateStatus={updateCandidateStatus} />
          <div className="container mx-auto px-4 md:px-8 pt-12 border-t">
            <GrowthKit />
          </div>
        </div>
      )}

      <footer className="bg-white border-t py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-4">
             <div className="w-14 h-14 bg-black text-white rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-xl">F</div>
             <div>
               <span className="font-black text-3xl tracking-tighter block">FarmaRoutes.</span>
               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.3em]">Logística Barcelona</span>
             </div>
          </div>
          <div className="flex flex-wrap justify-center gap-12 text-sm font-black uppercase tracking-widest text-gray-400">
            <a href="#" className="hover:text-blue-600 transition">Privacidad</a>
            <a href="#" className="hover:text-blue-600 transition">Sedes BCN</a>
            <a href="#" className="hover:text-blue-600 transition">Portal Pago</a>
            <a href="#" className="hover:text-blue-600 transition">Soporte 24/7</a>
          </div>
          <div className="text-xs text-gray-300 font-bold tracking-widest uppercase text-center md:text-right">
            © 2024 FarmaRoutes Barcelona S.L.<br/>Operadora de Transportes Registrada.
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default App;
