import React, { useEffect } from 'react';
import { useSession } from '../context/SessionContext';
import { EMPLOYEES } from '../types';
import { Users, Lock, ShieldAlert } from 'lucide-react';
import { evaluateAccess } from '../data/accessRules';
import { MiniLog } from '../components/MiniLog';

export const AdminView = () => {
  const { activeRole, addAuditEntry } = useSession();

  useEffect(() => {
    if (activeRole) {
      const { result, model, reason } = evaluateAccess(activeRole.id, 'Nómina interna empresa', 'Leer');
      addAuditEntry({
        action: 'Acceder a nómina interna',
        resource: 'Administrativo / Payroll',
        result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
        model,
        reason
      });
    }
  }, []);

  const handleTestBlock = () => {
    if (!activeRole) return;
    const { result, model, reason } = evaluateAccess(activeRole.id, 'Ganancias (artistas propios)', 'Leer');
    
    addAuditEntry({
      action: 'Intentar acceder a ganancias de artista',
      resource: 'Administrativo -> Artist Finances',
      result: result as 'ALLOWED' | 'DENIED' | 'EMBARGOED',
      model,
      reason
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#191c1d] mb-2">Operaciones Back-Office</h1>
          <p className="text-slate-500">Nómina interna y gestión de empleados.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest">
          <Lock size={14} /> RRHH Restringido
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-[#191c1d] mb-6 flex items-center gap-2">
            <Users className="text-emerald-600" />
            Directorio de Empleados
          </h2>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b border-slate-100">
                <th className="pb-4">Nombre</th>
                <th className="pb-4">Cargo</th>
                <th className="pb-4 text-right">Salario Base</th>
              </tr>
            </thead>
            <tbody>
              {EMPLOYEES.map((emp) => (
                <tr key={emp.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50">
                  <td className="py-4 font-semibold text-slate-800">{emp.name}</td>
                  <td className="py-4 text-sm text-slate-500">{emp.role}</td>
                  <td className="py-4 text-right font-mono text-emerald-700">{emp.salary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
             <h3 className="text-sm font-bold text-slate-700 mb-2">Operaciones bloqueadas</h3>
             <p className="text-xs text-slate-500 mb-6">Como administrativo, no deberías tener acceso a información de los artistas debido a la política RBAC estricta.</p>

             <button 
                onClick={handleTestBlock}
                className="w-full bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
              >
                <ShieldAlert size={14} />
                Test: Ver financiero de artista
              </button>
          </div>
        </div>
      </div>

      <MiniLog />
    </div>
  );
};
