import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SessionProvider, useSession } from './context/SessionContext';

import { TopNav } from './components/TopNav';
import { Sidebar } from './components/Sidebar';
import { Simulator } from './components/Simulator';

import { GatewayView } from './views/GatewayView';
import { DashboardView } from './views/DashboardView';
import { ManagementView } from './views/ManagementView';
import { MarketingView } from './views/MarketingView';
import { AuditView } from './views/AuditView';
import { AnalyticsView } from './views/AnalyticsView';
import { AdminView } from './views/AdminView';
import { View } from './types';

const AppLayout = () => {
  const { activeRole } = useSession();
  const [isSimulatorOpen, setSimulatorOpen] = useState(false);

  // 1. Control de Acceso Principal (Gateway)
  // Si no hay un rol activo en la memoria (Context), forzamos al usuario a pasar por la pasarela de inicio (Gateway).
  // Esto simula un bloqueo de autenticación: NADIE entra sin un Rol Asignado.
  if (!activeRole) {
    return <GatewayView />;
  }

  // 2. Enrutamiento Basado en Roles (RBAC Básico)
  // Dependiendo del ID del rol seleccionado, la UI carga dinámicamente un dashboard diferente. 
  // Esto garantiza que el "Backend" UI solo entregue las rutas que corresponden al usuario autenticado.
  let view: View = 'gateway';
  switch (activeRole.id) {
    case 'artist': view = 'dashboard'; break;
    case 'manager': view = 'management'; break;
    case 'marketing': view = 'marketing'; break;
    case 'legal': view = 'audit'; break;
    case 'analytics': view = 'analytics'; break;
    case 'admin': view = 'admin'; break;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Barra superior de configuración global */}
      <TopNav currentView={view} setView={() => {}} />
      
      {/* Navegación lateral condicional */}
      <Sidebar onToggleSimulator={() => setSimulatorOpen(true)} />
      
      <main className="ml-64 pt-24 px-8 pb-12">
        {/* AnimatePresence permite hacer difuminados suaves al cambiar entre pantallas */}
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'dashboard' && <DashboardView />}
            {view === 'management' && <ManagementView />}
            {view === 'marketing' && <MarketingView />}
            {view === 'audit' && <AuditView />}
            {view === 'analytics' && <AnalyticsView />}
            {view === 'admin' && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Simulator 
        isOpen={isSimulatorOpen} 
        onClose={() => setSimulatorOpen(false)} 
      />
    </div>
  );
};

export default function App() {
  return (
    <SessionProvider>
      <AppLayout />
    </SessionProvider>
  );
}
