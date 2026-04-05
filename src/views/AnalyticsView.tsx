import React, { useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { TrendingUp, Globe, Activity, ShieldAlert } from 'lucide-react';
import { evaluateAccess } from '../data/accessRules';
import { MiniLog } from '../components/MiniLog';

export const AnalyticsView = () => {
  const { activeRole, addAuditEntry } = useSession();

  // Log that they accessed the Analytics Hub
  useEffect(() => {
    if (activeRole) {
      const { result, model, reason } = evaluateAccess(activeRole.id, 'Métricas agregadas plataforma', 'Leer');
      addAuditEntry({
        action: 'Visualizar Dashboard de Analítica',
        resource: 'Analítica / Aggregated',
        result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
        model,
        reason
      });
    }
  }, []);

  const handleDrillDown = () => {
    if (!activeRole) return;
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Ganancias (artista rival)', 'Leer');
    
    addAuditEntry({
      action: 'Intentar ver detalle por artista',
      resource: 'Analítica / Individual',
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-[#191c1d] mb-2">Analítica de Plataforma</h1>
        <p className="text-slate-500">Métricas agregadas globales. Identidad (PII) enmascarada.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Reproducciones Totales', value: '1.4B', sub: '+24.8% vs AA', icon: TrendingUp, color: 'text-emerald-700 bg-emerald-100' },
          { label: 'Región Top', value: 'LATAM', sub: '45% del volúmen', icon: Globe, color: 'text-blue-700 bg-blue-100' },
          { label: 'Usuarios Activos', value: '45.2M', sub: 'Récord histórico', icon: Activity, color: 'text-purple-700 bg-purple-100' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl flex items-center gap-6 shadow-sm border border-slate-100">
            <div className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-[#191c1d]">{stat.value}</p>
              <p className="text-xs text-slate-500 font-medium mt-1">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-[#191c1d]">Géneros de Mayor Rendimiento</h2>
          <button 
            onClick={handleDrillDown}
            className="text-[10px] font-bold uppercase tracking-widest bg-red-50 text-red-700 hover:bg-red-100 transition-colors px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <ShieldAlert size={14} /> Ver Detalle por Artista (Drill Down)
          </button>
        </div>
        
        <div className="space-y-4">
          {[
            { genre: 'Reggaeton / Urbano', pct: 60, color: 'bg-emerald-500' },
            { genre: 'Pop', pct: 25, color: 'bg-blue-400' },
            { genre: 'Electrónica', pct: 15, color: 'bg-orange-400' }
          ].map(g => (
            <div key={g.genre} className="flex items-center gap-4 text-sm font-medium">
              <span className="w-40 text-slate-600">{g.genre}</span>
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${g.color}`} style={{ width: `${g.pct}%` }} />
              </div>
              <span className="w-10 text-right">{g.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      <MiniLog />
    </div>
  );
};
