import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- TIPOS Y CONSTANTES ---
enum View { CANDIDATE = 'CANDIDATE', OPERATOR = 'OPERATOR' }
enum Step { INTRO = 0, FORM = 1, SUCCESS = 2 }

interface Lead {
  id: string;
  name: string;
  phone: string;
  zone: string;
  vehicle: string;
  hasCold: boolean;
  aiAnalysis?: string;
  createdAt: number;
}

const ZONES = ['Barcelona Ciudad', 'Sant Boi / Baix Llobregat', 'Barberà / Vallès', 'Maresme'];

// --- COMPONENTES DE UI ---

const Badge = ({ children, variant = 'blue' }: { children: React.ReactNode, variant?: string }) => {
  const styles: any = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    purple: 'bg-purple-50 text-purple-700 border-purple-100',
  };
  return (
    <span className={`${styles[variant]} px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border`}>
      {children}
    </span>
  );
};

// --- APLICACIÓN PRINCIPAL ---
const App = () => {
  const [activeView, setActiveView] = useState<View>(View.CANDIDATE);
  const [step, setStep] = useState<Step>(Step.INTRO);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', zone: '', vehicle: '', hasCold: false });

  // IA: Análisis de perfil con Gemini
  const runAIAnalysis = async (data: any) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Eres un gestor de flota logística en BCN. Analiza este candidato para rutas de farmacia: ${JSON.stringify(data)}. Responde en 2 frases: ¿Por qué es buen perfil? ¿Qué ruta le asignarías?`
      });
      return response.text;
    } catch (e) {
      return "Pendiente de validación manual por el jefe de tráfico.";
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const analysis = await runAIAnalysis(formData);
    const newLead: Lead = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      aiAnalysis: analysis,
      createdAt: Date.now()
    };

    setTimeout(() => {
      setLeads(prev => [newLead, ...prev]);
      setLoading(false);
      setStep(Step.SUCCESS);
    }, 1500);
  };

  // Componente de Growth para el operador
  const GrowthKit = () => {
    const link = window.location.origin;
    const msg = `🚀 FarmaRoutes BCN busca autónomos con furgón propio. Rutas fijas, pago garantizado a 30 días. Regístrate aquí: ${link}`;
    
    return (
      <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl -mr-40 -mt-40"></div>
        <div className="relative z-10 grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-3xl font-black mb-4 tracking-tighter">Motor de Captación</h3>
            <p className="text-slate-400 mb-8 text-sm leading-relaxed">Envía este enlace a tus grupos de transportistas o pega el QR en tus furgonetas actuales para atraer a nuevos autónomos.</p>
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-4">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Kit de WhatsApp</p>
              <p className="text-sm italic text-slate-300">"{msg}"</p>
              <button onClick={() => { navigator.clipboard.writeText(msg); alert('Copiado'); }} className="bg-white text-black py-3 rounded-xl font-black text-xs uppercase hover:bg-slate-200 transition">Copiar Mensaje</button>
            </div>
          </div>
          <div className="bg-blue-600 p-8 rounded-[2.5rem] shadow-xl flex flex-col items-center justify-center text-center">
             <div className="w-24 h-24 bg-white rounded-2xl mb-4 flex items-center justify-center text-4xl">📱</div>
             <p className="font-black text-xl mb-2 tracking-tight">QR de Reclutamiento</p>
             <p className="text-xs font-bold opacity-80 mb-6">Generado automáticamente para tu portal</p>
             <button onClick={() => window.print()} className="bg-black text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition">Imprimir Pegatinas</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full glass-nav z-50 h-20 flex items-center justify-between px-8 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveView(View.CANDIDATE); setStep(Step.INTRO); }}>
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">F</div>
          <span className="text-xl font-black tracking-tighter">FarmaRoutes<span className="text-blue-600">.</span></span>
        </div>
        <div className="flex gap-8">
          <button onClick={() => setActiveView(View.CANDIDATE)} className={`text-sm font-bold tracking-tight transition ${activeView === View.CANDIDATE ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>Portal Conductor</button>
          <button onClick={() => setActiveView(View.OPERATOR)} className={`text-sm font-bold tracking-tight transition ${activeView === View.OPERATOR ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'}`}>Panel Operador</button>
        </div>
      </nav>

      <main className="flex-grow pt-32 pb-20 container mx-auto px-6 max-w-6xl">
        {activeView === View.CANDIDATE ? (
          <div className="animate-slideUp space-y-20">
            {step === Step.INTRO && (
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <Badge variant="blue">Logística de Alta Precisión BCN</Badge>
                  <h1 className="text-7xl font-black leading-[0.9] tracking-tighter text-slate-900">
                    Rutas fijas.<br/><span className="text-blue-600">Trabajo estable.</span>
                  </h1>
                  <p className="text-xl text-slate-500 font-medium leading-relaxed">
                    Únete a la operadora líder en transporte sanitario. Buscamos autónomos comprometidos para rutas de larga duración en toda Barcelona.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={() => setStep(Step.FORM)} className="bg-slate-900 text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl hover:scale-105 transition active:scale-95">SOLICITAR ALTA</button>
                    <div className="bg-white border p-4 rounded-3xl flex items-center gap-4 shadow-sm">
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>)}
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase">+120 Activos</span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block relative">
                   <div className="absolute -inset-4 bg-blue-100 rounded-[4rem] blur-3xl opacity-50"></div>
                   <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000" className="relative rounded-[4rem] shadow-2xl border-8 border-white object-cover aspect-[4/5]" alt="Furgoneta" />
                </div>
              </div>
            )}

            {step === Step.FORM && (
              <div className="max-w-xl mx-auto bento-card p-12 shadow-2xl border-blue-50">
                <h2 className="text-3xl font-black mb-2 tracking-tight">Formulario de Flota</h2>
                <p className="text-slate-400 mb-8 font-medium">Nuestra IA analizará tu vehículo y zona al instante.</p>
                <form onSubmit={handleRegister} className="space-y-4">
                  <input required placeholder="Nombre completo" className="w-full p-5 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-blue-500 font-medium" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="tel" placeholder="WhatsApp" className="w-full p-5 bg-slate-50 border-none rounded-2xl" onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <select required className="w-full p-5 bg-slate-50 border-none rounded-2xl font-medium" onChange={e => setFormData({...formData, zone: e.target.value})}>
                      <option value="">Zona Preferente</option>
                      {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <input required placeholder="Modelo de Vehículo" className="w-full p-5 bg-slate-50 border-none rounded-2xl" onChange={e => setFormData({...formData, vehicle: e.target.value})} />
                  <label className="flex items-center gap-4 p-5 bg-blue-50 rounded-2xl cursor-pointer hover:bg-blue-100 transition">
                    <input type="checkbox" className="w-6 h-6 rounded border-none text-blue-600 focus:ring-blue-500" onChange={e => setFormData({...formData, hasCold: e.target.checked})} />
                    <span className="text-sm font-bold text-blue-900">Mi vehículo tiene equipo de frío (ATP)</span>
                  </label>
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition disabled:opacity-50">
                    {loading ? 'Validando perfil...' : 'ENVIAR SOLICITUD'}
                  </button>
                </form>
              </div>
            )}

            {step === Step.SUCCESS && (
              <div className="text-center py-20 animate-slideUp">
                <div className="text-9xl mb-8">🚛</div>
                <h2 className="text-5xl font-black mb-4 tracking-tighter text-slate-900">¡Ya estás dentro!</h2>
                <p className="text-xl text-slate-500 max-w-lg mx-auto font-medium">Hemos analizado tu perfil con IA. El gestor de zona {formData.zone} te contactará por WhatsApp en menos de 2 horas.</p>
                <button onClick={() => setStep(Step.INTRO)} className="mt-12 bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Cerrar</button>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-slideUp space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div>
                <h1 className="text-5xl font-black tracking-tighter text-slate-900">Control de Tráfico</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Sistema en Tiempo Real
                </p>
              </div>
              <div className="flex gap-4">
                <div className="bg-white px-6 py-4 rounded-3xl border shadow-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Leads Hoy</p>
                   <p className="text-3xl font-black text-slate-900">{leads.length}</p>
                </div>
              </div>
            </div>

            <GrowthKit />

            <div className="bento-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b">
                  <tr>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Transportista</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Vehículo / Zona</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Análisis Inteligente (IA)</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {leads.length === 0 ? (
                    <tr><td colSpan={4} className="p-20 text-center text-slate-400 italic font-medium">Esperando nuevos registros...</td></tr>
                  ) : (
                    leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-slate-50/50 transition group">
                        <td className="p-6">
                          <p className="font-black text-lg text-slate-900">{lead.name}</p>
                          <p className="text-xs font-bold text-slate-400">{lead.phone}</p>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-slate-700">{lead.zone}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={lead.hasCold ? 'blue' : 'purple'}>{lead.vehicle}</Badge>
                            {lead.hasCold && <span className="text-lg">❄️</span>}
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-xs text-slate-600 leading-relaxed font-medium italic">
                            "{lead.aiAnalysis}"
                          </div>
                        </td>
                        <td className="p-6">
                          <a href={`https://wa.me/${lead.phone}`} target="_blank" className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-emerald-100 hover:scale-105 transition inline-block">WhatsApp</a>
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
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">© 2024 FarmaRoutes Barcelona S.L. • Gestión de Flota</p>
      </footer>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
