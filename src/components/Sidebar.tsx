import React from 'react';
import { View } from '../types';
import { Mic2, Users, Megaphone, Terminal, TrendingUp, Lock, HelpCircle, Activity, LogOut, ShieldAlert } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const Sidebar = ({ onToggleSimulator }: { onToggleSimulator: () => void }) => {
  const { activeRole, setActiveRole } = useSession();

  const getNavItems = () => {
    switch (activeRole?.id) {
      case 'artist':
        return [{ id: 'dashboard', label: 'Portal Artista', icon: Mic2 }];
      case 'manager':
        return [{ id: 'management', label: 'Gestión', icon: Users }];
      case 'marketing':
        return [{ id: 'marketing', label: 'Campañas', icon: Megaphone }];
      case 'legal':
        return [{ id: 'audit', label: 'Auditoría', icon: Terminal }];
      case 'analytics':
        return [{ id: 'analytics', label: 'Analítica', icon: TrendingUp }];
      case 'admin':
        return [{ id: 'admin', label: 'Panel Admin', icon: Lock }];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    setActiveRole(null);
  };

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 pt-20 flex flex-col bg-[#f8f9fa] border-r border-slate-100 z-40">
      <div className="px-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Navegación</p>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={'sidebar-link-active w-full flex items-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-800 font-bold border-r-4 border-emerald-600'}
          >
            <item.icon size={16} className="text-emerald-700" />
            <span>{item.label}</span>
          </button>
        ))}
        
        <button
          onClick={onToggleSimulator}
          className="w-full flex items-center gap-3 px-6 py-3 text-slate-600 hover:bg-slate-100 font-medium transition-colors"
        >
          <ShieldAlert size={16} className="text-orange-500" />
          <span>Simulador de Acceso</span>
        </button>
      </nav>
      
      <div className="mt-auto flex flex-col gap-1 pb-8">
        <button 
          onClick={handleLogout}
          className="mx-4 mb-6 py-3 px-4 bg-[#ffdad6] text-[#93000a] flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-all active:scale-95"
        >
          <LogOut size={14} /> Cerrar Sesión
        </button>
        <button 
          onClick={() => alert("Cualquier cosa comunicarse a este correo por problemas o denuncias legales luis.rojas13@uptc.edu.co")}
          className="w-full flex items-center gap-3 py-2 px-6 text-slate-500 hover:text-emerald-600 text-[10px] font-bold uppercase tracking-widest transition-colors text-left"
        >
          <HelpCircle size={14} /> Soporte
        </button>
      </div>
    </aside>
  );
};
