# TuneBox Security Simulator

TuneBox Simulator es un entorno web interactivo diseñado para emular la integridad de controles de seguridad paramétricos (RBAC, DAC y MAC) dentro de un entorno aislado de la industria musical.

> Para conocer a fondo la filosofía lógica del simulador, cómo auditar permisos cruzados o cómo operar las diferentes identidades corporativas, consulte el **`MANUAL_COMPLETO_Y_GRAFICO_TUNEBOX.pdf`** adjunto en este repositorio.

---

## 🛠 Instalación y Despliegue Local

Siga los siguientes pasos para ejecutar esta plataforma en su computador:

### 1. Pre-requisitos
Asegúrese de tener instalado el entorno de ejecución de JavaScript en su sistema:
- **Node.js** (Versión 18 o superior).

### 2. Arranque del Entorno
Abra su consola de comandos (Terminal o PowerShell) en la carpeta principal del proyecto y ejecute los siguientes dos comandos:

**Descargar librerías requeridas:**
```bash
npm install
```

**Encender el servidor interno interactivo:**
```bash
npm run dev -- --open
```

Este último comando desplegará exitosamente la interfaz del simulador en su navegador por defecto (generalmente bajo el enlace `http://localhost:5173`).

---


