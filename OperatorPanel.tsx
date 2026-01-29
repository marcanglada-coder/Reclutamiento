
import React, { useState } from 'react';
import { Candidate, CandidateStatus, SectorType } from '../types';
import { SECTOR_TEMPLATES } from '../constants';

interface OperatorPanelProps {
  candidates: Candidate[];
  onUpdateStatus: (id: string, status: CandidateStatus) => void;
}

export const OperatorPanel: React.FC<OperatorPanelProps> = ({ candidates, onUpdateStatus }) => {
  const [filter, setFilter] = useState<string>('');

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.zone.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">Panel de Control Operador</h2>
            <p className="text-gray-500">Gestión de flota y candidatos en Barcelona</p>
          </div>
          <div className="flex gap-2">
            <button className="bg-black text-white px-6 py-3 rounded-2xl font-bold text-sm">Nueva Oferta</button>
            <button className="bg-gray-100 text-black px-6 py-3 rounded-2xl font-bold text-sm">Exportar Datos</button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <input 
            type="text" 
            placeholder="Buscar por nombre o zona..." 
            className="flex-1 p-3 bg-gray-50 border rounded-xl text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select className="p-3 bg-gray-50 border rounded-xl text-sm">
            <option>Todos los estados</option>
            <option>Pendiente</option>
            <option>Aprobado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-xs font-bold uppercase text-gray-400 tracking-widest">
                <th className="pb-4 px-4">Candidato</th>
                <th className="pb-4 px-4">Vehículo</th>
                <th className="pb-4 px-4">Zona</th>
                <th className="pb-4 px-4">Estado</th>
                <th className="pb-4 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCandidates.map(candidate => (
                <tr key={candidate.id} className="hover:bg-gray-50 transition">
                  <td className="py-4 px-4">
                    <div className="font-bold">{candidate.name}</div>
                    <div className="text-xs text-gray-500">{candidate.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-semibold">{candidate.vehicleModel || 'N/A'}</div>
                    {candidate.hasRefrigeration ? (
                      <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full mt-1 uppercase">❄️ Frío</span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full mt-1 uppercase">Ambiente</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm font-medium">{candidate.zone}</td>
                  <td className="py-4 px-4">
                    <select 
                      value={candidate.status}
                      onChange={(e) => onUpdateStatus(candidate.id, e.target.value as CandidateStatus)}
                      className={`text-[11px] font-bold px-3 py-1 rounded-full border-2 uppercase tracking-wider ${
                        candidate.status === CandidateStatus.PENDING ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                        candidate.status === CandidateStatus.APPROVED ? 'bg-green-50 border-green-200 text-green-700' :
                        'bg-blue-50 border-blue-200 text-blue-700'
                      }`}
                    >
                      <option value={CandidateStatus.PENDING}>Pendiente</option>
                      <option value={CandidateStatus.PRE_APPROVED}>Preaprobado</option>
                      <option value={CandidateStatus.APPROVED}>Aprobado</option>
                      <option value={CandidateStatus.ON_ROUTE}>En Ruta</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex gap-2">
                      <button className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition" title="Enviar WhatsApp">
                        💬
                      </button>
                      <button className="p-2 bg-gray-100 hover:bg-black hover:text-white rounded-lg transition" title="Ver Documentos">
                        📄
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">No se han encontrado candidatos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">1</span>
            Métricas de Captación
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="text-3xl font-extrabold">{candidates.length}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Registros totales</div>
            </div>
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
              <div className="text-3xl font-extrabold text-green-700">{candidates.filter(c => c.status === CandidateStatus.ON_ROUTE).length}</div>
              <div className="text-xs font-bold text-green-600 uppercase tracking-widest mt-1">En Ruta</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">2</span>
            Filtro Pharma Ready
          </h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-500">Candidatos disponibles de inmediato para rutas de frío.</p>
            {candidates.filter(c => c.hasRefrigeration).map(c => (
              <div key={c.id} className="flex justify-between items-center p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                <div>
                  <div className="font-bold text-blue-900">{c.name}</div>
                  <div className="text-xs text-blue-700">{c.zone} - {c.vehicleModel}</div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold">Asignar Farma</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
