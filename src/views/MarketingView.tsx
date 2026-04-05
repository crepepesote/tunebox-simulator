import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RELEASES } from '../types';
import { Download, AlertCircle, Lock } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { evaluateAccess } from '../data/accessRules';
import { MiniLog } from '../components/MiniLog';

export const MarketingView = () => {
  const { activeRole, addAuditEntry } = useSession();
  const [showEmbargoAlert, setShowEmbargoAlert] = useState(false);

  const handleExport = (release: any) => {
    if (!activeRole) return;
    
    if (release.status === 'EMBARGOED') {
      const { result, model, reason } = evaluateAccess(activeRole.id, 'Datos lanzamientos futuros', 'Exportar');
      
      addAuditEntry({
        action: `Intento de exportar release embargado: ${release.title}`,
        resource: `Lanzamiento / ${release.title}`,
        result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
        model,
        reason
      });
      
      setShowEmbargoAlert(true);
      setTimeout(() => setShowEmbargoAlert(false), 3000);
    } else {
      const { result, model, reason } = evaluateAccess(activeRole.id, 'Lanzamiento liberado (Pre-cleared)', 'Exportar');
      addAuditEntry({
        action: `Exportar metadata y assets de release: ${release.title}`,
        resource: `Lanzamiento / ${release.title}`,
        result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
        model,
        reason
      });
    }
  };

  return (
    <div className="animate-in zoom-in-95 duration-500">
      <header className="mb-12 flex justify-between items-end">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">Panel Operativo</span>
            <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase flex items-center gap-1">
              <Lock size={12} /> MAC Confidencial
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-[#191c1d] mb-4">Calendario de Lanzamientos y Campañas</h1>
          <p className="text-slate-500 text-lg">Orquesta lanzamientos de alto impacto manteniendo un estricto cumplimiento del marco de seguridad MAC.</p>
        </div>
      </header>

      <div className="fixed top-20 right-8 z-[60] flex flex-col gap-3 max-w-sm">
        <AnimatePresence>
          {showEmbargoAlert && (
            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-orange-50 text-orange-900 p-4 rounded-2xl shadow-xl flex items-start gap-4 border border-orange-200"
            >
              <AlertCircle className="mt-0.5 text-orange-600" size={20} />
              <div>
                <p className="font-bold text-sm">Acción Bloqueada: Embargo Activo</p>
                <p className="text-xs opacity-90 leading-relaxed mt-1">La política MAC Confidencial impide exportar activos antes de la sincronización global del lanzamiento. ID de acceso registrado.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 flex flex-col gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-8 py-6 flex justify-between items-center border-b border-slate-50">
              <h2 className="font-bold text-lg text-[#191c1d]">Futuros Lanzamientos</h2>
            </div>
            
            <div className="divide-y divide-slate-50">
              {RELEASES.map((release, i) => (
                <div key={i} className="px-8 py-6 flex flex-col md:flex-row md:items-center gap-6 group hover:bg-slate-50 transition-colors">
                  <img 
                    src={release.img} 
                    alt={release.title} 
                    className={`w-16 h-16 rounded-2xl object-cover ${release.status === 'EMBARGOED' ? 'grayscale opacity-70' : ''}`}
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-bold text-lg tracking-tight ${release.status === 'EMBARGOED' ? 'text-slate-500 line-through' : 'text-[#191c1d]'}`}>
                        {release.title}
                      </h3>
                      <span className={`${release.color} px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter`}>{release.status}</span>
                    </div>
                    <p className="text-slate-500 text-sm">Artista: {release.artist} • Programado: {release.date}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                    <button 
                      onClick={() => handleExport(release)}
                      className={`px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
                        release.status === 'PRE-CLEARED' 
                          ? 'bg-[#191c1d] text-white shadow-md active:scale-95 hover:bg-emerald-900' 
                          : 'bg-slate-100 text-slate-400 opacity-50 cursor-not-allowed hover:bg-red-50 hover:text-red-400'
                      }`}
                    >
                      <Download size={14} />
                      {release.status === 'PRE-CLEARED' ? 'Exportar Audio Master' : 'Bloqueado por Embargo'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <MiniLog />
    </div>
  );
};
