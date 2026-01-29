
import React from 'react';
import { MARKETING_KITS } from '../constants';

export const GrowthKit: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('¡Copiado al portapapeles!');
  };

  const referralLink = `${window.location.origin}/#/join?ref=OPERADOR_BCN_01`;

  return (
    <div className="bg-black text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
      
      <div className="relative z-10">
        <h2 className="text-4xl font-extrabold mb-4">Motor de Crecimiento</h2>
        <p className="text-gray-400 max-w-lg mb-8">Utiliza estas herramientas para viralizar nuestras ofertas y atraer a los mejores transportistas de Barcelona.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                🔗 Tu enlace de referido
              </h3>
              <div className="flex gap-2">
                <input 
                  readOnly 
                  value={referralLink}
                  className="flex-1 bg-white/10 border border-white/20 p-3 rounded-xl text-sm"
                />
                <button 
                  onClick={() => copyToClipboard(referralLink)}
                  className="bg-yellow-500 text-black px-6 rounded-xl font-bold hover:bg-yellow-400 transition"
                >
                  Copiar
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 italic">* Enlace con seguimiento UTM automático integrado.</p>
            </div>

            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <h3 className="text-lg font-bold mb-4">Kit WhatsApp (Farma)</h3>
              <p className="text-xs text-gray-400 mb-2">{MARKETING_KITS.farma.whatsapp}</p>
              <button 
                onClick={() => copyToClipboard(MARKETING_KITS.farma.whatsapp)}
                className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm hover:bg-gray-200 transition"
              >
                Copiar mensaje
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10 h-full">
              <h3 className="text-lg font-bold mb-4">Estadísticas de Difusión</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-400">Clics totales</span>
                  <span className="font-bold text-2xl">1,284</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-gray-400">Conversión a Lead</span>
                  <span className="font-bold text-2xl text-yellow-500">8.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Referidos activos</span>
                  <span className="font-bold text-2xl">24</span>
                </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="text-xs font-bold text-gray-500 uppercase mb-4 tracking-widest">Canales Top</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm">Grupos WhatsApp (45%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm">Anuncios LinkedIn (30%)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
