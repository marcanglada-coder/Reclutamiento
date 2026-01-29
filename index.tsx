import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- 1. MODELO DE DATOS Y CONSTANTES ---
enum CandidatePath {
  AUTONOMO_COLD = 'AUTONOMO_COLD',
  AUTONOMO_NO_COLD = 'AUTONOMO_NO_COLD',
  EMPRENDEDOR = 'EMPRENDEDOR'
}

enum Status {
  PENDING = 'PENDING',
  AI_APPROVED = 'AI_APPROVED',
  CONTACTED = 'CONTACTED'
}

interface Candidate {
  id: string;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  path: CandidatePath;
  status: Status;
  aiAnalysis?: string;
  createdAt: number;
}

const ZONES = ['Barcelona Ciudad', 'Sant Boi / Baix Llobregat', 'Barberà / Vallès', 'Maresme'];

// --- 2. COMPONENTES DE UI REUTILIZABLES ---

const Badge = ({ children, variant = 'blue' }: { children: React.ReactNode, variant?: string }) => {
  const styles: any = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    orange: 'bg-orange-100 text-orange-700',
  };
  return <span className={`${styles[variant]} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter`}>{children}</span>;
};

// --- 3. SECCIÓN: MOTOR DE CRECIMIENTO (GROWTH) ---
const GrowthTool = () => {
  const [copied, setCopied] = useState(false);
  const link = window.location.origin;
  const waMsg = `🚚 ¿Eres transportista en BCN? FarmaRoutes busca autónomos para rutas fijas. Pago garantizado a 30 días. Regístrate aquí: ${link}`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <h3 className="text-3xl font-black mb-4">Motor de Captación</h3>
      <p className="text-slate-400 mb-8 text-sm">Herramientas para que tus propios conductores atraigan a otros.</p>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <p className="text-xs font-bold text-blue-400 uppercase mb-2">Kit WhatsApp</p>
          <p className="text-sm italic text-slate-300 mb-4 line-clamp-2">"{waMsg}"</p>
          <button onClick={() => copy(waMsg)} className="w-full bg-white text-black py-3 rounded-xl font-black text-xs uppercase hover:bg-slate-200 transition">
            {copied ? '¡Copiado!' : 'Copiar Mensaje'}
          </button>
        </div>
        <div className="bg-blue-600 p-6 rounded-3xl shadow-lg flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white rounded-xl mb-3 flex items-center justify-center text-2xl">📱</div>
          <p className="text-xs font-bold uppercase mb-2">QR para Furgonetas</p>
          <button onClick={() => window.print()} className="bg-black text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition">Imprimir Pegatinas</button>
        </div>
      </div>
    </div>
  );
};

// --- 4. COMPONENTE PRINCIPAL (APP) ---
const App = () => {
  const [view, setView] = useState<'candidate' | 'operator'>('candidate');
  const [step, setStep] = useState(0);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', zone: '', vehicle: '', path: CandidatePath.AUTONOMO_COLD });

  // Simulación de análisis IA con Gemini
  const runAIAnalysis = async (candidate: Candidate) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analiza este transportista para rutas Farma en BCN: ${JSON.stringify(candidate)}. 
        Responde en 2 líneas: ¿Es apto? Puntos fuertes.`
      });
      return response.text;
    } catch (e) {
      return "Perfil pendiente de validación técnica.";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const newCandidate: Candidate = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      status: Status.PENDING,
      createdAt: Date.now()
    };

    const analysis = await runAIAnalysis(newCandidate);
    newCandidate.aiAnalysis = analysis;
    newCandidate.status = Status.AI_APPROVED;

    setTimeout(() => {
      setCandidates(prev => [newCandidate, ...prev]);
      setLoading(false);
      setStep(100); // Éxito
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-md border-b z-50 flex items-center justify-between px-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('candidate'); setStep(0); }}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-200">F</div>
          <span className="text-xl font-black tracking-tighter">FarmaRoutes<span className="text-blue-600">.</span></span>
        </div>
        <div className="flex gap-6 font-bold text-sm text-slate-400">
          <button onClick={() => setView('candidate')} className={view === 'candidate' ? 'text-slate-900 border-b-2 border-blue-600' : ''}>Portal Conductores</button>
          <button onClick={() => setView('operator')} className={view === 'operator' ? 'text-slate-900 border-b-2 border-blue-600' : ''}>Panel Operador</button>
        </div>
      </nav>

      <main className="flex-grow pt-28 pb-12 container mx-auto px-4 max-w-6xl">
        {view === 'candidate' ? (
          <div className="animate-slideUp space-y-16">
            {step === 0 && (
              <section className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <Badge>Operadora de Transportes BCN</Badge>
                  <h1 className="text-7xl font-black leading-[0.9] tracking-tighter">
                    Rutas fijas.<br/>
                    <span className="text-blue-600">Pagos garantizados.</span>
                  </h1>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">
                    Únete a la red líder en logística sanitaria. Buscamos autónomos con ganas de estabilidad y crecimiento profesional.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setStep(1)} className="bg-slate-900 text-white px-10 py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition">ALTA TRANSPORTISTA</button>
                    <div className="flex items-center gap-4 px-6 py-4 bg-white border rounded-[2rem] shadow-sm">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>)}
                      </div>
                      <span className="text-xs font-bold text-slate-500 uppercase">+140 Conductores Activos</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block relative">
                  <div className="absolute -inset-4 bg-blue-600/10 rounded-[4rem] blur-3xl"></div>
                  <img src="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80&w=800" className="relative rounded-[4rem] shadow-2xl border-8 border-white object-cover aspect-[4/5]" alt="Logística" />
                </div>
              </section>
            )}

            {step === 1 && (
              <div className="max-w-xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
                <h2 className="text-3xl font-black mb-2">Únete a la flota</h2>
                <p className="text-slate-400 mb-8 font-medium">Nuestra IA validará tu perfil en segundos.</p>
                <form onSubmit={handleRegister} className="space-y-5">
                  <input required placeholder="Nombre y Apellidos" className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-blue-500" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="tel" placeholder="WhatsApp" className="w-full p-5 bg-slate-50 border-none rounded-2xl" onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <select required className="w-full p-5 bg-slate-50 border-none rounded-2xl" onChange={e => setFormData({...formData, zone: e.target.value})}>
                      <option value="">Zona</option>
                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <input placeholder="Modelo de Vehículo" className="w-full p-5 bg-slate-50 border-none rounded-2xl" onChange={e => setFormData({...formData, vehicle: e.target.value})} />
                  <div className="bg-blue-50 p-6 rounded-2xl flex items-center gap-4">
                    <input type="checkbox" className="w-6 h-6" checked={formData.path === CandidatePath.AUTONOMO_COLD} onChange={() => setFormData({...formData, path: CandidatePath.AUTONOMO_COLD})} />
                    <p className="text-sm font-bold text-blue-900 leading-tight">Mi furgoneta tiene equipo de frío (Rutas FARMA)</p>
                  </div>
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl hover:bg-blue-700 transition disabled:opacity-50">
                    {loading ? 'Validando con IA...' : 'ENVIAR SOLICITUD'}
                  </button>
                </form>
              </div>
            )}

            {step === 100 && (
              <div className="text-center py-20 bg-white rounded-[4rem] shadow-2xl border border-blue-100 max-w-2xl mx-auto">
                <div className="text-8xl mb-6">✨</div>
                <h2 className="text-4xl font-black mb-4 tracking-tighter">¡Ya estás en el radar!</h2>
                <p className="text-slate-500 mb-10 text-lg px-12">Nuestra IA ha pre-aprobado tu perfil. El gestor de zona te escribirá por WhatsApp hoy mismo.</p>
                <button onClick={() => {setStep(0); setFormData({ name: '', phone: '', zone: '', vehicle: '', path: CandidatePath.AUTONOMO_COLD });}} className="bg-slate-900 text-white px-12 py-4 rounded-2xl font-black shadow-lg">Entendido</button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-slideUp space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-5xl font-black tracking-tighter">Gestión de Flota</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sistema en Tiempo Real
                </p>
              </div>
              <div className="flex gap-4">
                 <div className="bg-white px-6 py-4 rounded-3xl border shadow-sm flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Leads Hoy</span>
                    <span className="text-2xl font-black">{candidates.length}</span>
                 </div>
              </div>
            </div>

            <GrowthTool />

            <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b">
                  <tr>
                    <th className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Transportista</th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Zona / Vehículo</th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Análisis IA</th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Estado</th>
                    <th className="p-8 font-black text-[10px] uppercase tracking-widest text-slate-400">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {candidates.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-slate-400 italic font-medium">No hay nuevos candidatos registrados todavía.</td></tr>
                  ) : (
                    candidates.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition">
                        <td className="p-8">
                          <div className="font-black text-lg text-slate-900">{c.name}</div>
                          <div className="text-xs text-slate-400 font-bold">{c.phone}</div>
                        </td>
                        <td className="p-8">
                          <div className="font-bold text-slate-700">{c.zone}</div>
                          <div className="text-[10px] font-black text-blue-600 uppercase">{c.vehicle || 'Sin vehículo'}</div>
                        </td>
                        <td className="p-8">
                          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed max-w-xs">
                            {c.aiAnalysis}
                          </div>
                        </td>
                        <td className="p-8">
                          <Badge variant={c.status === Status.AI_APPROVED ? 'green' : 'orange'}>
                            {c.status === Status.AI_APPROVED ? 'Apto IA' : 'Pendiente'}
                          </Badge>
                        </td>
                        <td className="p-8">
                          <a href={`https://wa.me/${c.phone}`} target="_blank" className="bg-green-500 text-white px-5 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-green-100 hover:scale-105 transition inline-block">WhatsApp</a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t text-center space-y-4">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">© 2024 FarmaRoutes Barcelona S.L. • Operadora de Transportes</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
