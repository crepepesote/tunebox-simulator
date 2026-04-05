import React, { useState } from 'react';
import { ARTISTS } from '../types';
import { ChevronRight, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { evaluateAccess } from '../data/accessRules';
import { MiniLog } from '../components/MiniLog';

export const ManagementView = () => {
  const { activeRole, addAuditEntry } = useSession();
  const [expandedArtist, setExpandedArtist] = useState<string | null>(null);
  
  // We mock the currently logged manager to 'manager' which represents Rosalía & Bad Bunny.
  const activeManagerId = 'manager';
  const representedArtists = ARTISTS.filter(a => a.managerId === activeManagerId);

  const handleViewFinancials = (artistName: string) => {
    if (!activeRole) return;
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Ganancias (artistas propios)', 'Leer');
    
    addAuditEntry({
      action: 'Ver finanzas de artista propio',
      resource: `Finanzas / ${artistName}`,
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });

    if (result === 'ALLOWED') {
      setExpandedArtist(prev => prev === artistName ? null : artistName);
    }
  };

  const handleTestBlock = () => {
    if (!activeRole) return;
    // Attempting to see a rival (J Balvin)
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Ganancias (artista rival)', 'Leer');
    
    addAuditEntry({
      action: 'Ver ganancias de artista rival (J Balvin)',
      resource: 'Finanzas / Rival',
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-[#191c1d] mb-2">Artistas Representados</h1>
          <p className="text-slate-500 max-w-md">Gestión segura de derechos de distribución y transparencia financiera para tu catálogo.</p>
        </div>
        <div className="text-right">
          <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 opacity-60">Nivel de Seguridad</span>
          <span className="text-xl font-black text-emerald-700">MAC SECRETO</span>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {representedArtists.map((artist) => (
            <div key={artist.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="group p-6 hover:bg-slate-50 transition-all flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <img 
                    src={artist.image} 
                    alt={artist.name} 
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-[#191c1d] leading-tight">{artist.name}</h3>
                    <p className="text-sm text-slate-500 font-medium">Distribución: {artist.distribution}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">ID Interno: {artist.internalId}</p>
                  <button 
                    onClick={() => handleViewFinancials(artist.name)}
                    className={`inline-flex items-center gap-2 text-sm font-bold transition-transform ${expandedArtist === artist.name ? 'text-slate-800' : 'text-emerald-600 hover:translate-x-1'}`}
                  >
                    {expandedArtist === artist.name ? 'Cerrar Finanzas' : 'Ver Finanzas'}
                    <ChevronRight size={14} className={expandedArtist === artist.name ? 'rotate-90' : ''} />
                  </button>
                </div>
              </div>
              
              {expandedArtist === artist.name && (
                <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-12 animate-in slide-in-from-top-2 duration-300">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Métricas (Streaming)</p>
                    <p className="text-2xl font-black text-[#191c1d]">$8,230.40</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Licencias</p>
                    <p className="text-2xl font-black text-[#191c1d]">$4,220.42</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total (YTD)</p>
                    <p className="text-2xl font-black text-emerald-700">$12,450.82</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-[#191c1d] p-8 rounded-3xl text-white shadow-lg">
            <ShieldCheck className="mb-4 text-emerald-400" size={32} />
            <h3 className="text-lg font-bold mb-2">Protocolos de Privacidad</h3>
            <p className="text-sm opacity-80 leading-relaxed mb-6">
              Bajo la política MAC Secreto, la visibilidad de finanzas cruzada entre artistas competidores está estrictamente prohibida para prevenir manipulación del mercado.
            </p>
            
            <div className="pt-6 border-t border-white/10 mt-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Simulación de Infracción</h4>
              <button 
                onClick={handleTestBlock}
                className="w-full bg-red-900/40 text-red-100 hover:bg-red-900/60 transition-colors py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-red-500/30"
              >
                <ShieldAlert size={14} />
                Prueba: Ver Artista Rival (J Balvin)
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <MiniLog />
    </div>
  );
};
