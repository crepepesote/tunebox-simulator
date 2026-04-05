import React from 'react';
import { motion } from 'motion/react';
import { Disc, Mic2, Users, Megaphone, ShieldCheck, TrendingUp, Lock } from 'lucide-react';
import { useSession } from '../context/SessionContext';
import { RoleId } from '../types';

export const GatewayView = () => {
  const { setActiveRole } = useSession();

  const roles = [
    { 
      id: 'artist' as RoleId, 
      label: 'Artista / Productor', 
      desc: 'Accede a tus tracks, métricas de regalías y delegación de datos.',
      icon: Mic2, 
      color: 'group-hover:text-amber-600', 
      bg: 'group-hover:bg-amber-100',
      ring: 'hover:ring-amber-500/30'
    },
    { 
      id: 'manager' as RoleId, 
      label: 'Manager', 
      desc: 'Gestiona la red de artistas representados con privacidad por diseño.',
      icon: Users,
      color: 'group-hover:text-blue-600', 
      bg: 'group-hover:bg-blue-100',
      ring: 'hover:ring-blue-500/30'
    },
    { 
      id: 'marketing' as RoleId, 
      label: 'Marketing', 
      desc: 'Opera campañas sujetas a embargos y calendarios estrictos.',
      icon: Megaphone,
      color: 'group-hover:text-orange-600', 
      bg: 'group-hover:bg-orange-100',
      ring: 'hover:ring-orange-500/30'
    },
    { 
      id: 'legal' as RoleId, 
      label: 'Legal / Compliance', 
      desc: 'Auditoría total inmutable de accesos y transacciones.',
      icon: ShieldCheck,
      color: 'group-hover:text-emerald-700', 
      bg: 'group-hover:bg-emerald-100',
      ring: 'hover:ring-emerald-500/30'
    },
    { 
      id: 'analytics' as RoleId, 
      label: 'Analítica', 
      desc: 'Métricas agregadas macro sin exposición de PII ni finanzas.',
      icon: TrendingUp,
      color: 'group-hover:text-purple-600', 
      bg: 'group-hover:bg-purple-100',
      ring: 'hover:ring-purple-500/30'
    },
    { 
      id: 'admin' as RoleId, 
      label: 'Administrativos', 
      desc: 'Solo roles de nómina interna limitados a operaciones de back-office.',
      icon: Lock,
      color: 'group-hover:text-rose-600', 
      bg: 'group-hover:bg-rose-100',
      ring: 'hover:ring-rose-500/30'
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 flex flex-col items-center text-center"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#191c1d] to-slate-800 flex items-center justify-center shadow-md">
             <Disc className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-[#191c1d]">TuneBox Simulator</h1>
        </div>
        <p className="text-slate-500 font-medium tracking-tight max-w-md">Selecciona un rol para interactuar con los diferentes modelos (RBAC, DAC, MAC) en tiempo real.</p>
      </motion.div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setActiveRole({ id: role.id, label: role.label })}
            className={`group relative bg-[#f8f9fa] hover:bg-white transition-all duration-300 rounded-3xl p-8 flex flex-col items-start border border-slate-100 ring-1 ring-transparent ${role.ring} hover:shadow-xl active:scale-95 text-left`}
          >
            <div className={`w-14 h-14 rounded-2xl bg-white border border-slate-100 ${role.bg} flex items-center justify-center mb-6 transition-colors duration-300`}>
              <role.icon className={`text-slate-400 ${role.color} transition-colors`} size={28} />
            </div>
            <span className={`text-sm font-bold tracking-tight text-[#191c1d] mb-2`}>{role.label}</span>
            <span className="text-xs text-slate-500 leading-relaxed font-medium">{role.desc}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
