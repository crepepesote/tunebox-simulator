import React from 'react';
import { View } from '../types';
import { Disc, Settings, Moon, Sun } from 'lucide-react';
import { useSession } from '../context/SessionContext';

export const TopNav = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => {
  const { activeRole, setActiveRole } = useSession();
  const [isDark, setIsDark] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleDark = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        * { transition: background-color 0.5s ease, border-color 0.5s ease, color 0.5s ease; }
        html.dark body { background-color: #0f172a !important; color: #f1f5f9 !important; }
        html.dark .bg-white { background-color: #1e293b !important; border-color: #334155 !important; color: #f1f5f9 !important; }
        html.dark .text-\\[\\#191c1d\\] { color: #f8fafc !important; }
        html.dark .bg-\\[\\#191c1d\\] { background-color: #f8fafc !important; color: #0f172a !important; }
        html.dark .bg-\\[\\#f8f9fa\\] { background-color: #0f172a !important; border-color: #334155 !important; }
        html.dark .bg-slate-50 { background-color: #1e293b !important; }
        html.dark .hover\\:bg-slate-50:hover, html.dark tr:hover { background-color: #334155 !important; }
        html.dark .hover\\:bg-slate-100:hover { background-color: #475569 !important; }
        html.dark .text-slate-500 { color: #94a3b8 !important; }
        html.dark .text-slate-600 { color: #cbd5e1 !important; }
        html.dark .border-slate-100, html.dark .border-slate-50 { border-color: #334155 !important; }
        html.dark .glass-nav { background-color: rgba(15, 23, 42, 0.8) !important; border-color: #334155 !important; }
        html.dark input, html.dark select, html.dark table { background-color: transparent !important; color: #f1f5f9 !important; }
        html.dark th { color: #94a3b8 !important; border-color: #334155 !important; }
        html.dark td { color: #f1f5f9 !important; }
      `}} />
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-8 h-16 glass-nav z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex items-center gap-8">
        <button 
          onClick={() => setActiveRole(null)}
          className="text-xl font-black tracking-tighter text-emerald-900 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all outline-none"
        >
          <Disc className="text-emerald-600" />
          TuneBox
        </button>
        <div className="hidden md:flex gap-6">
          <span className="text-sm font-medium text-emerald-700 font-bold border-b-2 border-emerald-600 py-5">
            {activeRole?.label} Panel
          </span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 px-3 py-1 bg-emerald-100 rounded-full">
          {activeRole?.label || 'Invitado'}
        </span>
        <div className="flex items-center gap-4">
          <button onClick={toggleDark} className="text-slate-500 hover:text-emerald-600 transition-all flex items-center justify-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <div className="relative">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-400 bg-slate-200 focus:outline-none hover:ring-2 hover:ring-emerald-200 transition-all">
               <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-emerald-700">
                  {activeRole?.id.substring(0,2).toUpperCase()}
               </div>
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200">
                <div className="px-5 py-4 border-b border-slate-100">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Sesión iniciada como</p>
                  <p className="text-xs font-bold text-[#191c1d] truncate">{activeRole?.label}</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveRole(null);
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-red-600 hover:bg-slate-50 text-xs font-bold transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
    </>
  );
};
