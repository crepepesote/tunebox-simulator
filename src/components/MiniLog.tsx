import React from 'react';
import { useSession } from '../context/SessionContext';

export const MiniLog = () => {
  const { auditLog, activeRole } = useSession();

  if (!activeRole) return null;

  // Filter logs for the active user, unless the role is 'legal' (they see everything)
  const isLegal = activeRole.id === 'legal';
  const relevantLogs = isLegal 
    ? auditLog 
    : auditLog.filter(log => log.roleId === activeRole.id);

  // Take the last 5 entries (assuming auditLog is prepend-only, so the first 5 elements are the latest)
  const recentLogs = relevantLogs.slice(0, 5);

  return (
    <div className="mt-16 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
      <h3 className="font-bold text-lg mb-4 text-[#191c1d]">Mis acciones en esta sesión</h3>
      
      {recentLogs.length === 0 ? (
        <p className="text-sm text-slate-500 italic">Ninguna acción registrada todavía.</p>
      ) : (
        <div className="space-y-3">
          {recentLogs.map((log) => (
            <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0 gap-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
                <span className="text-[10px] font-mono text-slate-400 min-w-[80px]">{log.timestamp}</span>
                {isLegal && (
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase">
                    {log.roleLabel}
                  </span>
                )}
                <span className="font-medium text-slate-700">{log.action}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400 font-mono hidden md:inline-block max-w-[150px] truncate" title={log.resource}>
                  {log.resource}
                </span>
                <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${log.result === 'DENIED' || log.result === 'EMBARGOED' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {log.result}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
