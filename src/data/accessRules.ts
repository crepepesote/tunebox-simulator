import { RoleId, AccessResult, AuditEntry } from '../types';

/**
 * MOTOR DE SEGURIDAD CENTRAL (PDP - Policy Decision Point)
 * 
 * Esta función es el corazón del control de acceso de TuneBox. 
 * Intercepta una solicitud de un ROL hacia un RECURSO pidiendo realizar una ACCIÓN.
 * Retorna si se PERMITE o DENIEGA bajo qué Modelo de Seguridad (RBAC, DAC o MAC).
 */
export function evaluateAccess(roleId: RoleId, resourceId: string, action: string): Pick<AuditEntry, 'result' | 'model' | 'reason'> {
  let isAllowed = false;
  let modelApplied = 'RBAC'; // Por defecto asumiremos la política base RBAC (Control Basado en Rol)
  let reasonGiven = 'Acceso autorizado según matriz de reglas';

  // EVALUACIÓN DE MATRIZ DE PERMISOS
  // Cada "case" a continuación representa la columna de un rol en nuestra matriz de seguridad.
  switch (roleId) {
    case 'artist':
      // RBAC: El artista puede manipular sus propias canciones y métricas.
      if (resourceId === 'Canciones (propias)' && ['Leer', 'Subir', 'Editar', 'Exportar'].includes(action)) isAllowed = true;
      if (resourceId === 'Métricas (propias)' && ['Leer', 'Exportar'].includes(action)) isAllowed = true;
      if (resourceId === 'Métricas agregadas plataforma' && action === 'Leer') isAllowed = true;
      if (resourceId === 'Ganancias (artistas propios)' && ['Leer', 'Exportar'].includes(action)) isAllowed = true;
      
      // DAC (Discretionary Access Control): El Artista es DUEÑO de su Dashboard, y él decide con quién compartirlo.
      if (resourceId === 'Dashboard (DAC)' && ['Leer', 'Compartir', 'Revocar'].includes(action)) { isAllowed = true; modelApplied = 'DAC'; }
      break;
      
    case 'manager':
      if (resourceId === 'Canciones (propias)' && action === 'Leer') isAllowed = true;
      if (resourceId === 'Métricas (propias)' && ['Leer', 'Exportar'].includes(action)) isAllowed = true;
      if (resourceId === 'Métricas agregadas plataforma' && action === 'Leer') isAllowed = true;
      // Manager IS allowed to read their own artists' financials.
      if (resourceId === 'Ganancias (artistas propios)' && action === 'Leer') isAllowed = true;
      break;

    case 'marketing':
      if (resourceId === 'Métricas (propias)' && ['Leer', 'Exportar'].includes(action)) isAllowed = true;
      if (resourceId === 'Métricas agregadas plataforma' && action === 'Leer') isAllowed = true;
      if (resourceId === 'Datos lanzamientos futuros' && action === 'Leer') isAllowed = true;
      break;

    case 'legal':
      modelApplied = 'MAC — log registrado';
      if (resourceId === 'Métricas agregadas plataforma' && action === 'Leer') isAllowed = true;
      else if (resourceId === 'API externas (métricas)' && action === 'Leer') isAllowed = true;
      else if (['Leer', 'Exportar'].includes(action)) isAllowed = true;
      break;
      
    case 'analytics':
      if (resourceId === 'Métricas (propias)' && ['Leer', 'Exportar'].includes(action)) isAllowed = true;
      if (resourceId === 'Métricas agregadas plataforma' && ['Leer', 'Exportar'].includes(action)) isAllowed = true;
      if (resourceId === 'API externas (métricas)' && action === 'Leer') isAllowed = true;
      break;

    case 'admin':
      if (resourceId === 'Nómina interna empresa' && ['Leer', 'Editar'].includes(action)) isAllowed = true;
      break;
  }

  // -------------------------------------------------------------
  // REGLAS ESPECIALES Y DE EXCEPCIÓN DIRECTA (Componentes MAC)
  // -------------------------------------------------------------
  
  // MAC SECRETO (Mandatory Access Control): Ningún rol está por encima de esta regla para prevenir sabotajes/competencia desleal.
  if (resourceId.includes('Rival')) return { result: 'DENIED', model: 'RBAC + MAC Secreto', reason: 'Overlap representation detected.' };
  
  // MAC CONFIDENCIAL: Los datos embargados (canciones pre-lanzadas) NO pueden exportarse, sin excepciones, ni siquiera por el dueño.
  if (action === 'Exportar' && resourceId.includes('Embargoed')) return { result: 'EMBARGOED', model: 'MAC Confidencial', reason: 'Embargo actúante.' };
  
  // Si la canción ya fue liberada públicamente, regresamos al control normal RBAC base
  if (action === 'Exportar' && resourceId === 'Lanzamiento liberado (Pre-cleared)') return { result: 'ALLOWED', model: 'RBAC', reason: 'Lanzamiento público' };
  
  // CATCH-ALL: Si el permiso explícito NO se encontró en el Role Switch de arriba, denegamos por defecto ("Principio de Menor Privilegio")
  if (!isAllowed) {
    if (resourceId === 'Datos lanzamientos futuros' && action === 'Exportar' && roleId === 'marketing') {
      return { result: 'EMBARGOED', model: 'MAC Confidencial', reason: 'Embargo prohíbe exportación de datos futuros.' };
    }
    if (['Ganancias (artista rival)', 'Canciones (de otro artista)', 'Métricas (artista no representado)'].includes(resourceId)) {
       return { result: 'DENIED', model: 'RBAC + MAC Secreto', reason: 'Aislamiento de competidores.' };
    }
    return { result: 'DENIED', model: 'RBAC', reason: 'Permiso insuficiente según matriz' };
  }

  return { result: 'ALLOWED', model: modelApplied, reason: reasonGiven };
}
