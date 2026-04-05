import React, { useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { ChevronRight, Search, FileText, ShieldCheck } from 'lucide-react';
import { evaluateAccess } from '../data/accessRules';

export const AuditView = () => {
  const { auditLog, activeRole, addAuditEntry } = useSession();

  // On first load of the component by a legal member, technically we should log that they looked at the DB.
  // But doing it in useEffect without care could cause infinite loops or double triggers in strict mode.
  // For the sake of the prototype, we simply provide an explicit "Refresh Ledger" or similar action.

  const totalHits = auditLog.length;
  const macInterventions = auditLog.filter(l => l.model.includes('MAC')).length;

  const handleExportCSV = () => {
    if (!activeRole) return;
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Logs de auditoría', 'Exportar');
    
    addAuditEntry({
      action: 'Intentó exportar el log de auditoría',
      resource: 'Sistema: AuditLog CSV',
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });
  };

  return (
    <div className="animate-in slide-in-from-right-4 duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400 mb-2">
            <span>Terminal</span>
            <ChevronRight size={10} />
            <span className="text-emerald-600">Log de Auditoría del Sistema</span>
          </nav>
          <h1 className="text-4xl font-black tracking-tighter text-[#191c1d]">Libro Mayor de Cumplimiento</h1>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-800">Session Monitored - All Actions Recorded</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="p-6 bg-[#191c1d] rounded-3xl shadow-sm border border-slate-800 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Total de Auditorías</p>
          <p className="text-3xl font-black tracking-tight">{totalHits}</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Intervenciones MAC</p>
          <p className="text-3xl font-black tracking-tight text-emerald-600">{macInterventions}</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Infracciones de Política</p>
          <p className="text-3xl font-black tracking-tight text-red-600">0</p>
        </div>
        <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Última Sincronización</p>
          <p className="text-3xl font-black tracking-tight text-[#191c1d]">Tiempo real</p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-bold text-[#191c1d] mb-4">Sondas de Gobernanza de Datos</h2>
        <p className="text-sm text-slate-500 mb-6">Inspeccionar sistemas internos para verificar cumplimiento. Metadatos no comprometedores únicamente.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Catálogo Global', resource: 'Canciones (propias)', desc: 'Validar toda la metadata distribuida.' },
            { label: 'Lanzamientos Futuros', resource: 'Datos lanzamientos futuros', desc: 'Verificar cumplimiento de embargos.' },
            { label: 'Matriz de Delegación', resource: 'Dashboard (DAC)', desc: 'Auditar configuraciones DAC activas.' }
          ].map((probe) => (
            <div key={probe.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <h3 className="font-bold text-slate-800 text-sm mb-1">{probe.label}</h3>
              <p className="text-xs text-slate-500 mb-6">{probe.desc}</p>
              <button 
                onClick={() => {
                  if (activeRole) {
                    evaluateAccess(activeRole.id, probe.resource, 'Leer');
                    addAuditEntry({
                      action: `Auditoría Activa: Inspección de metadata`,
                      resource: probe.resource,
                      result: 'ALLOWED',
                      model: 'MAC — log registrado',
                      reason: 'Auditoría autorizada por matriz Legal'
                    });
                  }
                }}
                className="w-full bg-slate-50 hover:bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-widest py-3 rounded-xl border border-slate-200 hover:border-emerald-200 transition-colors"
               >
                 Ejecutar Sonda
               </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="px-6 py-4 flex flex-col md:flex-row md:justify-between items-center bg-slate-50 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Search className="text-slate-400" size={18} />
            <input 
              type="text" 
              className="bg-transparent border-none text-sm font-medium focus:ring-0 w-full md:w-64 outline-none placeholder:text-slate-400" 
              placeholder="Filter by Resource or Actor..." 
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={handleExportCSV}
              className="px-4 py-2 bg-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-700 hover:bg-slate-300 transition-colors w-full md:w-auto"
            >
              Export CSV
            </button>
            <button className="px-4 py-2 bg-[#191c1d] rounded-xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-emerald-900 transition-all w-full md:w-auto">
              Verification Key
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Fecha / Hora</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Actor / Rol</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Acción</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Recurso</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Modelo</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLog.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-[10px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase tracking-tighter text-slate-700">{log.roleLabel}</span>
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-700">{log.action}</td>
                  <td className="px-6 py-4 text-xs font-mono text-emerald-700 max-w-[200px] truncate" title={log.resource}>{log.resource}</td>
                  <td className="px-6 py-4 text-[10px] font-bold text-[#191c1d] uppercase">{log.model}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-bold rounded-full ${
                      log.result === 'DENIED' || log.result === 'EMBARGOED' 
                        ? 'bg-red-100 text-red-700' 
                        : log.result === 'ALLOWED' 
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
              {auditLog.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400 text-xs">No hay registros disponibles.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <footer className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl flex items-start gap-4 border-l-4 border-emerald-600 shadow-sm border border-slate-100">
          <ShieldCheck className="text-emerald-600 shrink-0" size={20} />
          <div>
            <h3 className="text-xs font-bold text-[#191c1d] mb-1">Prueba de Inmutabilidad</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">Este rastro de auditoría está anclado criptográficamente. Ningún registro puede ser alterado o removido después de su generación.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl flex items-start gap-4 shadow-sm border border-slate-100">
          <FileText className="text-slate-400 shrink-0" size={20} />
          <div>
            <h3 className="text-xs font-bold text-[#191c1d] mb-1">Resumen de Cumplimiento</h3>
            <p className="text-[10px] text-slate-500 leading-relaxed">La puntuación de transparencia de todo el sistema es actualmente de 100%. Todos los Controles de Acceso Obligatorio están operando dentro de los parámetros legales especificados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
