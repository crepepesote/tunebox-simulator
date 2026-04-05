import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from '../context/SessionContext';
import { evaluateAccess } from '../data/accessRules';
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { AccessResult } from '../types';

interface SimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESOURCES = [
  'Canciones (propias)',
  'Canciones (de otro artista)',
  'Métricas (propias)',
  'Métricas (artista no representado)',
  'Métricas agregadas plataforma',
  'Datos lanzamientos futuros',
  'Ganancias (artistas propios)',
  'Ganancias (artista rival)',
  'Nómina interna empresa',
  'Dashboard (DAC)',
  'Logs de auditoría',
  'API externas (métricas)'
];

const ACTIONS = ['Leer', 'Subir', 'Editar', 'Exportar', 'Compartir', 'Revocar'];

export const Simulator = ({ isOpen, onClose }: SimulatorProps) => {
  const { activeRole, addAuditEntry } = useSession();
  const [resource, setResource] = useState(RESOURCES[0]);
  const [action, setAction] = useState(ACTIONS[0]);
  
  const [lastSimulation, setLastSimulation] = useState<{
    result: AccessResult;
    model: string;
    reason?: string;
  } | null>(null);

  if (!activeRole) return null;

  const handleSimulate = () => {
    const resultData = evaluateAccess(activeRole.id, resource, action);
    
    setLastSimulation({
      result: resultData.result as AccessResult,
      model: resultData.model,
      reason: resultData.reason
    });

    addAuditEntry({
      action: `[Simulador] Attempt ${action} on ${resource}`,
      resource: resource,
      result: resultData.result as AccessResult,
      model: resultData.model,
      reason: resultData.reason
    });
  };

  const getResultColor = (res: AccessResult) => {
    switch(res) {
      case 'ALLOWED': return 'bg-emerald-50 border-emerald-200 text-emerald-800';
      case 'DENIED': return 'bg-red-50 border-red-200 text-red-800';
      case 'EMBARGOED': return 'bg-orange-50 border-orange-200 text-orange-800';
    }
  };

  const getResultIcon = (res: AccessResult) => {
    switch(res) {
      case 'ALLOWED': return <CheckCircle2 className="text-emerald-600" size={24} />;
      case 'DENIED': return <ShieldAlert className="text-red-600" size={24} />;
      case 'EMBARGOED': return <AlertTriangle className="text-orange-600" size={24} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col border-l border-slate-100"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h2 className="text-xl font-bold text-[#191c1d] flex items-center gap-2">
                  <ShieldAlert className="text-emerald-600" size={20} />
                  Simulador de Acceso
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Rol activo: <span className="font-bold text-emerald-700 uppercase">{activeRole.label}</span>
                </p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Recurso Objetivo</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700 outline-none"
                    value={resource}
                    onChange={(e) => setResource(e.target.value)}
                  >
                    {RESOURCES.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 block">Acción a realizar</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 transition-all font-medium text-slate-700 outline-none"
                    value={action}
                    onChange={(e) => setAction(e.target.value)}
                  >
                    {ACTIONS.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>

                <button 
                  onClick={handleSimulate}
                  className="w-full bg-[#191c1d] text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-emerald-900 transition-all active:scale-95 flex justify-center items-center gap-2 mt-4"
                >
                  <Play size={16} />
                  Evaluar Acceso
                </button>

                {lastSimulation && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-8 p-5 rounded-2xl border ${getResultColor(lastSimulation.result)}`}
                  >
                    <div className="flex items-start gap-4">
                      {getResultIcon(lastSimulation.result)}
                      <div>
                        <h4 className="font-black text-lg tracking-tight mb-1">{lastSimulation.result}</h4>
                        <div className="space-y-2 mt-3">
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 block">Modelo Aplicado</span>
                            <span className="text-sm font-semibold">{lastSimulation.model}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold tracking-widest opacity-60 block">Razón Técnica</span>
                            <span className="text-xs leading-relaxed opacity-90">{lastSimulation.reason}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
              Todas las simulaciones quedan registradas en el log
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
