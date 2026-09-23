# Turnos online — Estudio de paisajismo

Demo frontend de un sistema de reserva y gestión de turnos para un estudio de paisajismo, diseñada con enfoque **mobile-first**.

## Cómo probar la demo

### Reservar una cita

1. Abre la URL de previsualización del proyecto.
2. Selecciona un servicio.
3. Elige un profesional.
4. Selecciona fecha y horario disponible.
5. Completa nombre, teléfono y correo electrónico.
6. Confirma la reserva.
7. Guarda el código generado, por ejemplo `PAIS-ABC123`.

La cita queda guardada en `localStorage` y el horario seleccionado pasa a mostrarse como ocupado.

### Gestionar una cita

Pulsa **“Gestionar turno”** en la aplicación.

1. Introduce el código de reserva.
2. Consulta servicio, profesional, fecha, hora y estado.
3. Puedes **reprogramar** la cita seleccionando un nuevo día y horario disponible.
4. También puedes **cancelar** la cita.
5. Al cancelar o reprogramar, el hueco horario anterior queda disponible inmediatamente en la demo.

Para probar esta pantalla sin crear una cita nueva puedes utilizar el código `DEMO01`.

## Servicios incluidos

- **Visita de diagnóstico a terreno** — 60 min.
- **Consultoría de diseño botánico** — 75 min.
- **Supervisión de riego y siembra** — 45 min.

La demo incluye profesionales y citas de ejemplo realistas.

## Funcionalidades disponibles actualmente

- Selección de servicio y profesional.
- Calendario semanal navegable.
- Horarios disponibles y ocupados.
- Creación de citas demo.
- Código único de reserva.
- Persistencia mediante `localStorage`.
- Consulta de reserva mediante código.
- Cancelación de citas.
- Reprogramación de citas.
- Liberación inmediata del hueco anterior al cancelar o reprogramar.
- Prevención de doble reserva dentro del mismo almacenamiento local.
- Diseño responsive con prioridad móvil.
- Identidad visual basada en el briefing del cliente.

## Restablecer la demo y recuperar los datos de ejemplo

Las pruebas quedan guardadas en el navegador mediante `localStorage`.

Para volver al estado inicial:

1. Abre la aplicación.
2. Borra los datos del sitio o el almacenamiento local correspondiente a la URL de la demo desde la configuración del navegador.
3. Recarga la página.

Al volver a cargar sin datos guardados, se restauran los datos de ejemplo incluidos en la aplicación.

## Identidad visual aplicada

- Verde Follaje Profundo: `#1E3A2F`
- Terracota Mineral: `#B85D38`
- Arena Cálido: `#F4F1EA`
- Verde Salvia: `#7D9D85`
- Gris Carbón: `#23272A`
- Titulares, números y destacados: **Outfit**
- Textos, formularios y controles: **Plus Jakarta Sans**

## Funcionalidades previstas en siguientes fases

Todavía no se incluyen:

- dashboard interno del estudio;
- agenda interna por profesional y día;
- bloqueos de disponibilidad desde el panel;
- listado y búsqueda interna de citas;
- marcación de ausencias y estadística automática;
- exportación;
- recordatorios simulados a 48 h y 3 h;
- botón interno para restablecer la demo;
- integraciones reales con WhatsApp, correo o base de datos externa.

## Persistencia y alcance técnico

La demo **no utiliza backend ni base de datos externa**. Los datos se guardan en `localStorage`, dentro del navegador y dispositivo desde el que se utiliza la aplicación.

Los datos de distintos dispositivos no se sincronizan entre sí. Las conexiones reales con WhatsApp Business API, SMTP y base de datos centralizada serán realizadas posteriormente por Kodarvia, junto con el dominio y la redacción legal definitiva.

## Tecnología

- Next.js
- React
- TypeScript
- `localStorage`
- GitHub
- Vercel

## Ejecutar el proyecto en local

Requisitos: Node.js y npm instalados.

```bash
npm install
npm run dev
```

Después abre la dirección indicada por Next.js, normalmente:

```text
http://localhost:3000
```

## Estado del proyecto

**Fase 4 — Gestión de reservas mediante código.**

El proyecto se desarrolla por fases. Antes de avanzar se revisan funcionalidad, responsive mobile-first, identidad visual y cumplimiento del briefing del cliente.
