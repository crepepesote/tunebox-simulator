import React, { useState } from 'react';
import { Wallet, ShieldCheck, TrendingUp, Globe, Mic2 } from 'lucide-react';
import { TRACKS } from '../types';
import { useSession } from '../context/SessionContext';
import { evaluateAccess } from '../data/accessRules';
import { MiniLog } from '../components/MiniLog';

export const DashboardView = () => {
  const { activeRole, addAuditEntry } = useSession();
  const [delegates, setDelegates] = useState<{email: string, role: string}[]>([
    { email: 'j.smith@agency.co', role: 'Finance' }
  ]);
  const [emailInput, setEmailInput] = useState('');

  // Need to get the mocked internal ID. Rosalía is artist-1, Bad Bunny is artist-2.  
  // We'll just hardcode an active internal ID for demo purposes or read it off the role logic.
  // We assumed activeRole 'Artist' maps generically to an artist context.
  const activeArtistId = 'artist-1'; 
  const artistTracks = TRACKS.filter(t => t.artist === activeArtistId);

  const handleExport = () => {
    if (!activeRole) return;
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Métricas (propias)', 'Exportar');
    
    addAuditEntry({
      action: 'Exportar métricas (Export Data)',
      resource: 'Métricas propias',
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });
  };

  const handleDelegate = () => {
    if (!activeRole || !emailInput) return;
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Dashboard (DAC)', 'Compartir');
    
    addAuditEntry({
      action: 'Compartir dashboard vía DAC',
      resource: `Dashboard propio -> ${emailInput}`,
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });

    if (result === 'ALLOWED') {
      setDelegates(prev => [...prev, { email: emailInput, role: 'Finance' }]);
      setEmailInput('');
    }
  };

  const handleRevoke = (email: string) => {
    if (!activeRole) return;
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Dashboard (DAC)', 'Revocar');
    
    addAuditEntry({
      action: 'Revocar acceso DAC',
      resource: `Dashboard propio de ${email}`,
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });

    if (result === 'ALLOWED') {
      setDelegates(prev => prev.filter(d => d.email !== email));
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 mb-2 block">Portal del Artista</span>
          <h1 className="text-4xl font-bold tracking-tight text-[#191c1d]">Mi Portal</h1>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Activo Desde</p>
          <p className="text-lg font-semibold text-[#191c1d]">Oct 2023</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-[#191c1d]">Mis Canciones</h2>
            <button 
              onClick={handleExport}
              className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 hover:underline px-3 py-1 bg-emerald-50 rounded-lg"
            >
              Exportar Datos
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="pb-4">Título</th>
                  <th className="pb-4">Fecha Lanzamiento</th>
                  <th className="pb-4 text-right">Reproducciones</th>
                  <th className="pb-4 text-right">Estado</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {artistTracks.map((track, i) => (
                  <tr key={i} className="group hover:bg-slate-50 border-b border-slate-50 last:border-0">
                    <td className="py-5 font-semibold text-[#191c1d]">{track.title}</td>
                    <td className="py-5 text-slate-500">{track.releaseDate}</td>
                    <td className="py-5 text-right font-mono text-[#191c1d]">{track.plays}</td>
                    <td className="py-5 text-right">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded-full">{track.status}</span>
                    </td>
                  </tr>
                ))}
                {artistTracks.length === 0 && (
                  <tr><td colSpan={4} className="py-5 text-center text-slate-400">No se encontraron canciones.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-12 mb-8 border-t border-slate-100 pt-10">
            <h2 className="text-xl font-bold text-[#191c1d]">Finanzas de Canciones</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-b border-slate-100">
                  <th className="pb-4">Título</th>
                  <th className="pb-4 text-right">Ingresos Streaming</th>
                  <th className="pb-4 text-right">Ingresos Licencias</th>
                  <th className="pb-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {artistTracks.map((track, i) => {
                  const playsNum = parseInt((track.plays || "0").toString().replace(/,/g, ''));
                  const streamingRev = (playsNum * 0.004).toFixed(2);
                  const licensingRev = (playsNum * 0.001).toFixed(2);
                  const totalRev = (parseFloat(streamingRev) + parseFloat(licensingRev)).toFixed(2);
                  
                  return (
                    <tr key={`fin-${i}`} className="group hover:bg-slate-50 border-b border-slate-50 last:border-0">
                      <td className="py-5 font-semibold text-[#191c1d]">{track.title}</td>
                      <td className="py-5 text-right font-mono text-slate-500">${streamingRev}</td>
                      <td className="py-5 text-right font-mono text-slate-500">${licensingRev}</td>
                      <td className="py-5 text-right font-mono text-emerald-700 font-bold">${totalRev}</td>
                    </tr>
                  );
                })}
                {artistTracks.length === 0 && (
                  <tr><td colSpan={4} className="py-5 text-center text-slate-400">No se encontraron canciones.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-400 p-8 rounded-3xl text-white shadow-md">
            <div className="flex justify-between items-start mb-12">
              <Wallet className="p-2 bg-white/20 rounded-xl" size={40} />
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">Ganancias Estimadas</span>
            </div>
            <div className="mb-2">
              <h3 className="text-sm font-medium opacity-80">Regalías Actuales</h3>
              <p className="text-5xl font-black tracking-tight">$12,450.82</p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/20 grid grid-cols-2 gap-4">
              <div>
                 <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Streaming</p>
                 <p className="text-lg font-bold">$8,230.40</p>
              </div>
              <div>
                 <p className="text-[10px] uppercase tracking-widest opacity-70 mb-1">Licencias</p>
                 <p className="text-lg font-bold">$4,220.42</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-[#191c1d] mb-2">Delegar Acceso (DAC)</h3>
            <p className="text-sm text-slate-500 mb-6">Autoriza a un tercero a ver tus reportes financieros.</p>
            <div className="space-y-4">
              <div>
                <input 
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#f3f4f5] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none" 
                  placeholder="finanzas@management.com" 
                />
              </div>
              <button 
                onClick={handleDelegate}
                className="w-full bg-[#191c1d] text-white py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900 transition-colors flex justify-center items-center gap-2"
              >
                <ShieldCheck size={16} />
                Otorgar Acceso
              </button>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Delegados Activos</div>
              {delegates.map((del) => (
                <div key={del.email} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 rounded-lg group">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[8px] font-bold text-emerald-700 capitalize">
                      {del.email[0]}
                    </div>
                    <span className="text-xs font-medium text-[#191c1d] truncate max-w-[120px]">{del.email}</span>
                  </div>
                  <button 
                    onClick={() => handleRevoke(del.email)}
                    className="text-[9px] font-bold bg-white text-red-600 border border-red-200 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    REVOCAR
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      
      <MiniLog />
    </div>
  );
};
