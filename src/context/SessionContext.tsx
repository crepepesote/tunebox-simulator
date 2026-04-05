import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { RoleId, AuditEntry, AUDIT_LOGS } from '../types';

/**
 * GESTOR DE SESIÓN GLOBAL (El "Backend" Mock)
 * 
 * Utilizamos React Context y useReducer para simular las funcionalidades
 * que un backend debería tener, incluyendo la retención del ROL ACTUAL y
 * la base de datos INMUTABLE del registro de auditoría (Audit Log).
 */
interface SessionState {
  activeRole: { id: RoleId; label: string } | null; // El usuario logueado
  auditLog: AuditEntry[]; // Los registros históricos
}

type SessionAction =
  | { type: 'SET_ACTIVE_ROLE'; payload: { id: RoleId; label: string } | null }
  | { type: 'ADD_AUDIT_ENTRY'; payload: Omit<AuditEntry, 'id' | 'timestamp' | 'roleId' | 'roleLabel'> };

const initialState: SessionState = {
  activeRole: null,
  auditLog: AUDIT_LOGS, // init with mock data for now
};

function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'SET_ACTIVE_ROLE':
      return { ...state, activeRole: action.payload };
    case 'ADD_AUDIT_ENTRY': {
      if (!state.activeRole) return state; // Solo procedemos si alguien está logueado
      
      // Creamos un registro nuevo, auto-implantando la fecha, la ID de transacción,
      // y sellando fuertemente EL ROL del autor que empaquetó este suceso para el panel Legal.
      const newEntry: AuditEntry = {
        ...action.payload,
        id: crypto.randomUUID(),
        timestamp: new Date().toLocaleTimeString(),
        roleId: state.activeRole.id,
        roleLabel: state.activeRole.label,
      };
      
      return {
        ...state,
        auditLog: [newEntry, ...state.auditLog],
      };
    }
    default:
      return state;
  }
}

interface SessionContextValue extends SessionState {
  setActiveRole: (role: { id: RoleId; label: string } | null) => void;
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'roleId' | 'roleLabel'>) => void;
}

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(sessionReducer, initialState);

  const setActiveRole = (role: { id: RoleId; label: string } | null) => {
    dispatch({ type: 'SET_ACTIVE_ROLE', payload: role });
  };

  const addAuditEntry = (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'roleId' | 'roleLabel'>) => {
    dispatch({ type: 'ADD_AUDIT_ENTRY', payload: entry });
  };

  return (
    <SessionContext.Provider value={{ ...state, setActiveRole, addAuditEntry }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
