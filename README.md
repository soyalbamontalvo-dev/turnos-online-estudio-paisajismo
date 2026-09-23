# Turnos online — Estudio de paisajismo

Aplicación frontend mobile-first para la reserva y gestión de turnos de un estudio de paisajismo.

## Fase actual

Fase 1: experiencia pública inicial de reserva.

Incluye:
- selección de servicio;
- selección de profesional;
- identidad visual basada en el briefing del cliente;
- persistencia del borrador en `localStorage`;
- diseño responsive con prioridad móvil.

Aún no incluye:
- calendario semanal;
- creación definitiva de citas;
- reprogramación/cancelación;
- panel interno;
- bloqueos de agenda;
- recordatorios simulados;
- servicios externos reales.

## Stack

- Next.js
- React
- TypeScript
- `localStorage`
- Vercel para previsualización y despliegue

## Desarrollo local

```bash
npm install
npm run dev
```

## Alcance técnico acordado

Esta demo no utiliza backend ni servicios externos. Las futuras integraciones con WhatsApp Business API, SMTP y base de datos centralizada serán realizadas posteriormente por Kodarvia. El código se estructura para poder evolucionar sin rehacer la interfaz completa.
