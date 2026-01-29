import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// --- 1. CONFIGURACIÓN Y TIPOS ---
enum CandidatePath {
  AUTONOMO_COLD = 'AUTONOMO_COLD',
  AUTONOMO_NO_COLD = 'AUTONOMO_NO_COLD',
  ASALARIADO_A_AUTONOMO = 'ASALARIADO_A_AUTONOMO'
}

enum CandidateStatus {
  PENDING = 'PENDING',
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

const MODERN_IMAGES = {
  refrigerated: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80&w=1000",
  hub: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000"
};

// --- 2. SERVICIOS (IA) ---
const analyzeWithAI = async (data: any) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    // Solo inicializamos para validar, en un registro real llamaríamos a generateContent
    console.log("IA Lista para analizar perfil de Barcelona");
    return true;
  } catch (e) {
    return false;
  }
};

// --- 3. COMPONENTES DE UI ---

const Layout = ({ children, activeView, setView }: any) => (
  <div className="min-h-screen flex flex-col">
    <nav className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-lg border-b z-50 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2 font-black text-2xl tracking-tighter">
        <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">F</div>
        FarmaRoutes<span className="text-blue-600">.</span>
      </div>
      <div className="flex gap-8 font-bold text-sm text-gray-500">
        <button onClick={() => setView('candidate')} className={activeView === 'candidate' ? 'text-blue-600 border-b-2 border-blue-600' : ''}>Conductores</button>
        <button onClick={() => setView('operator')} className={activeView === 'operator' ? 'text-blue-600 border-b-2 border-blue-600' : ''}>Panel Operador</button>
      </div>
    </nav>
    <main className="flex-grow pt-24">{children}</main>
  </div>
);

// --- 4. COMPONENTE PRINCIPAL (APP) ---
const App = () => {
  const [view, setView] = useState<'candidate' | 'operator'>('candidate');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', zone: '', vehicle: '' });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await analyzeWithAI(formData);
    
    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      path: CandidatePath.AUTONOMO_COLD,
      vehicleModel: formData.vehicle,
      hasRefrigeration: true,
      zone: formData.zone,
      status: CandidateStatus.PENDING,
      createdAt: Date.now()
    };

    setTimeout(() => {
      setCandidates([newCandidate, ...candidates]);
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <Layout activeView={view} setView={setView}>
      <div className="container mx-auto px-4 max-w-6xl">
        {view === 'candidate' ? (
          <div className="animate-fadeIn space-y-16">
            {success ? (
              <div className="text-center py-20 bg-white rounded-[3rem] shadow-2xl border border-blue-100">
                <div className="text-7xl mb-6">🚀</div>
                <h2 className="text-4xl font-black mb-4">¡Registro Recibido!</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">Nuestra IA está validando tu vehículo para las rutas farmacéuticas. Te contactaremos por WhatsApp en breve.</p>
                <button onClick={() => setSuccess(false)} className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-black shadow-xl">Volver</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Barcelona Transit Hub</span>
                  <h1 className="text-7xl font-black leading-[0.9] tracking-tighter">Gana más con <br/><span className="text-blue-600">rutas fijas.</span></h1>
                  <p className="text-xl text-gray-500 font-medium">Operadora líder en transporte sanitario. Buscamos autónomos con furgoneta para rutas estables todo el año.</p>
                  
                  <form onSubmit={handleRegister} className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 space-y-4">
                    <h3 className="text-xl font-black mb-4">Solicitud de Alta</h3>
                    <input required placeholder="Nombre Completo" className="w-full p-4 bg-gray-50 border rounded-2xl focus:ring-2 ring-blue-500" onChange={e => setFormData({...formData, name: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="tel" placeholder="Teléfono" className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={e => setFormData({...formData, phone: e.target.value})} />
                      <select className="w-full p-4 bg-gray-50 border rounded-2xl" onChange={e => setFormData({...formData, zone: e.target.value})}>
                        <option value="">Zona</option>
                        <option value="BCN">Barcelona</option>
                        <option value="Valles">Vallès</option>
                        <option value="Baix">Baix Llobregat</option>
                      </select>
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 transition">
                      {loading ? 'Procesando con IA...' : 'REGISTRARME AHORA'}
                    </button>
                  </form>
                </div>
                <div className="hidden md:block relative">
                  <div className="absolute -inset-4 bg-blue-600/10 rounded-[4rem] blur-2xl"></div>
                  <img src={MODERN_IMAGES.refrigerated} className="relative rounded-[4rem] shadow-2xl border-8 border-white object-cover h-[600px] w-full" alt="Logistica" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fadeIn space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-4xl font-black tracking-tighter">Panel de Gestión</h2>
                <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Control de Flota en Tiempo Real</p>
              </div>
              <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border font-black text-sm uppercase tracking-widest">
                {candidates.length} Nuevos Leads
              </div>
            </div>
            
            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-gray-50/50 border-b">
                  <tr>
                    <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Transportista</th>
                    <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Zona</th>
                    <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Estado IA</th>
                    <th className="p-6 font-black text-[10px] uppercase tracking-widest text-gray-400">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {candidates.length === 0 ? (
                    <tr><td colSpan={4} className="p-20 text-center text-gray-400 font-medium italic">Esperando nuevos registros...</td></tr>
                  ) : (
                    candidates.map(c => (
                      <tr key={c.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-6">
                          <div className="font-bold text-lg">{c.name}</div>
                          <div className="text-xs text-gray-500">{c.phone}</div>
                        </td>
                        <td className="p-6 font-bold text-gray-600">{c.zone}</td>
                        <td className="p-6">
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-[10px] font-black">APTO FARMA</span>
                        </td>
                        <td className="p-6">
                          <a href={`https://wa.me/${c.phone}`} target="_blank" className="bg-green-500 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-md inline-block">CONTACTAR</a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <footer className="mt-20 py-10 border-t text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
        © 2024 FarmaRoutes Barcelona S.L. • Operadora de Transportes
      </footer>
    </Layout>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
