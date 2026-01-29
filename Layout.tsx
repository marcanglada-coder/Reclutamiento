
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: 'candidate' | 'operator';
  onViewChange: (view: 'candidate' | 'operator') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden font-['Plus_Jakarta_Sans']">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b z-50 px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-xl">F</div>
          <span className="text-xl font-extrabold tracking-tight">FarmaRoutes<span className="text-blue-500">.</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-4 font-semibold text-sm">
            <button 
              onClick={() => onViewChange('candidate')}
              className={`hover:text-black transition ${activeView === 'candidate' ? 'text-black border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Candidatos
            </button>
            <button 
              onClick={() => onViewChange('operator')}
              className={`hover:text-black transition ${activeView === 'operator' ? 'text-black border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              Operador
            </button>
          </div>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:bg-blue-700 transition">
            🚜 Vehículo Refrigerado
          </button>
        </div>
      </nav>
      <main className="pt-24 pb-12">
        {children}
      </main>
    </div>
  );
};
