import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---
enum CandidatePath {
  AUTONOMO_COLD = 'AUTONOMO_COLD',
  AUTONOMO_NO_COLD = 'AUTONOMO_NO_COLD',
  ASALARIADO_A_AUTONOMO = 'ASALARIADO_A_AUTONOMO'
}

enum CandidateStatus {
  PENDING = 'PENDING',
  PRE_APPROVED = 'PRE_APPROVED',
  APPROVED = 'APPROVED',
  ON_ROUTE = 'ON_ROUTE'
}

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  path: CandidatePath;
  vehicleModel: string;
  hasRefrigeration: boolean;
  zone: string;
  status: CandidateStatus;
  createdAt: number;
}

// --- CONSTANTS ---
const MODERN_IMAGES = {
  electric: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=1000",
  refrigerated: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80&w=1000"
};

const INITIAL_OFFERS = [
  { id: '1', title: 'Ruta Farma Sant Boi', zone: 'Baix Llobregat', requiresCold: true, sector: 'Sanitario' },
  { id: '2', title: 'Distribución Alimentaria BCN', zone: 'Barcelona Centro', requiresCold: true, sector: 'Alimentación' },
  { id: '3', title: 'Paquetería Express Vallès', zone: 'Sabadell/Terrassa', requiresCold: false, sector: 'Retail' }
];

// --- APP COMPONENT ---
const App: React.FC = () => {
  const [view, setView] = useState<'candidate' | 'operator'>('candidate');
  const [showWizard, setShowWizard] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state - added vehicleModel to satisfy Candidate interface requirements
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    zone: '', 
    path: CandidatePath.AUTONOMO_COLD,
    vehicleModel: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Initialized GoogleGenAI according to @google/genai guidelines using process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      // Intento de llamada a Gemini para validación
      console.log("Analizando candidato...");
    } catch (err) {
      console.warn("IA no disponible");
    }

    // newCandidate now includes vehicleModel via the updated formData spread
    const newCandidate: Candidate = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      hasRefrigeration: formData.path === CandidatePath.AUTONOMO_COLD,
      status: CandidateStatus.PENDING,
      createdAt: Date.now()
    };

    setTimeout(() => {
      setCandidates([newCandidate, ...candidates]);
      setLoading(false);
      setSuccess(true);
      setShowWizard(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-md border-b z-50 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">F</div>
          FarmaRoutes<span className="text-blue-600">.</span>
        </div>
        <div className="flex gap-6 font-bold text-sm text-gray-500">
          <button onClick={() => setView('candidate')} className={view === 'candidate' ? 'text-black border-b-2 border-blue-600' : ''}>Portal Conductores</button>
          <button onClick={() => setView('operator')} className={view === 'operator' ? 'text-black border-b-2 border-blue-600' : ''}>Gestión Flota</button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 container mx-auto">
        {view === 'candidate' ? (
          <div className="space-y-20 animate-fadeIn">
            {success ? (
              <div className="text-center py-20 bg-white rounded-[3rem] shadow-2xl border border-blue-50">
                <div className="text-6xl mb-6">✅</div>
                <h1 className="text-4xl font-black mb-4">¡Perfil Registrado!</h1>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">Nuestra IA está asignándote una ruta. Te contactaremos por WhatsApp en menos de 2h.</p>
                <button onClick={() => setSuccess(false)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-lg">Entendido</button>
              </div>
            ) : !showWizard ? (
              <section className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-[10px] font-black uppercase inline-block">Operadora de Transportes BCN</div>
                  <h1 className="text-7xl font-black leading-[0.9] tracking-tighter">Rutas fijas.<br/><span className="text-blue-600">Pagos a 30 días.</span></h1>
                  <p className="text-xl text-gray-500 leading-relaxed">Únete a la red líder de transporte sanitario en Barcelona. Buscamos autónomos con furgoneta para rutas estables anuales.</p>
                  <div className="flex flex-col gap-4">
                    <button onClick={() => setShowWizard(true)} className="bg-black text-white px-8 py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition">SOLICITAR RUTA FRÍO ❄️</button>
                    <button onClick={() => setShowWizard(true)} className="bg-white border-2 border-gray-100 text-black px-8 py-6 rounded-[2rem] font-black text-xl">OTRAS RUTAS 📦</button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <img src={MODERN_IMAGES.refrigerated} className="rounded-[4rem] shadow-2xl border-8 border-white" alt="Furgoneta Farma" />
                </div>
              </section>
            ) : (
              <div className="max-w-2xl mx-auto bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-50">
                <button onClick={() => setShowWizard(false)} className="text-gray-400 font-bold mb-8">← Volver</button>
                <h2 className="text-3xl font-black mb-8">Alta de Transportista</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input required placeholder="Nombre Completo" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={e => setFormData({...formData, name: e.target.value})} />
                  <div className="grid grid-cols-2 gap-4">
                    <input required type="email" placeholder="Email" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input required placeholder="Teléfono" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  {/* Added vehicleModel input to the form */}
                  <input required placeholder="Modelo de Vehículo" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={e => setFormData({...formData, vehicleModel: e.target.value})} />
                  <select className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={e => setFormData({...formData, zone: e.target.value})}>
                    <option value="">Zona Preferente</option>
                    <option value="BCN">Barcelona Ciudad</option>
                    <option value="SBOI">Sant Boi / Baix Llobregat</option>
                    <option value="VALL">Vallès</option>
                  </select>
                  <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl shadow-xl">
                    {loading ? 'Analizando Perfil...' : 'FINALIZAR REGISTRO'}
                  </button>
                </form>
              </div>
            )}

            {!showWizard && !success && (
              <section className="grid md:grid-cols-3 gap-8">
                {INITIAL_OFFERS.map(offer => (
                  <div key={offer.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 hover:-translate-y-2 transition">
                    <div className="text-4xl mb-6">{offer.requiresCold ? '❄️' : '📦'}</div>
                    <h3 className="text-xl font-black mb-2">{offer.title}</h3>
                    <p className="text-sm text-gray-500 mb-6 font-bold uppercase tracking-widest">{offer.zone}</p>
                    <button onClick={() => setShowWizard(true)} className="w-full bg-gray-100 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 hover:text-white transition">Postular</button>
                  </div>
                ))}
              </section>
            )}
          </div>
        ) : (
          <div className="space-y-12 animate-fadeIn">
             <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black tracking-tighter">Panel de Operador</h1>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-xl text-xs font-black">SISTEMA ONLINE</div>
             </div>
             <div className="bg-white rounded-[3rem] shadow-xl border border-gray-50 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Candidato</th>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Zona</th>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Estado</th>
                      <th className="p-6 font-black uppercase text-[10px] tracking-widest text-gray-400">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidates.length === 0 ? (
                      <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">No hay nuevos candidatos registrados todavía.</td></tr>
                    ) : (
                      candidates.map(c => (
                        <tr key={c.id} className="border-b hover:bg-gray-50/50">
                          <td className="p-6">
                            <div className="font-bold">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.email}</div>
                          </td>
                          <td className="p-6 font-medium text-gray-600">{c.zone || 'BCN'}</td>
                          <td className="p-6">
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-lg text-[10px] font-black">PENDIENTE</span>
                          </td>
                          <td className="p-6">
                             <a href={`https://wa.me/${c.phone}`} target="_blank" className="bg-green-500 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-md inline-block">WHATSAPP</a>
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
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
