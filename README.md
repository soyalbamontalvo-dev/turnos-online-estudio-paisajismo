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

### Ver el panel interno

Pulsa **“Panel interno”** desde la parte superior de la reserva pública.

El dashboard de esta fase permite consultar:

- resumen visual de la semana;
- citas previstas para el día;
- citas pendientes;
- ausencias registradas en los datos demo;
- tres perfiles profesionales ficticios con fotografía de stock;
- agenda precargada con contenido específico del sector paisajístico;
- estados `confirmado`, `pendiente`, `ausente` y `cancelado`;
- filtro de agenda por profesional.

El dashboard utiliza el mismo `localStorage` que la reserva pública. Las citas creadas, canceladas o reprogramadas forman parte del mismo conjunto de datos.

## Servicios incluidos

- **Visita de diagnóstico a terreno** — 60 min.
- **Consultoría de diseño botánico** — 75 min.
- **Supervisión de riego y siembra** — 45 min.

Los textos de la agenda son específicos del sector: análisis de asoleamiento y drenaje, selección de especies, diseño botánico, revisión de riego, siembra, taludes y puesta en marcha de jardines. No se utiliza texto de relleno.

## Profesionales demo

- **Lucía Herrera** — Arquitecta paisajista.
- **Mateo Rivas** — Especialista en diseño botánico.
- **Inés Valverde** — Coordinadora de obra verde.

Son perfiles ficticios creados únicamente para la demostración. Las fotografías utilizadas son imágenes de stock de Unsplash identificadas como libres de uso bajo su licencia y se muestran con crédito dentro del propio panel.

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
- Dashboard interno de consulta.
- Resumen visual de agenda.
- Profesionales con perfiles y fotografías demo.
- Agenda precargada con citas en distintos estados.
- Filtro de agenda por profesional.
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

- edición interna de estados desde el dashboard;
- bloqueos de disponibilidad desde el panel;
- listado y búsqueda interna avanzada de citas;
- estadística automática de ausencias tras editar estados;
- exportación;
- simulación visual de recordatorios a 48 h y 3 h;
- simulación de estados de correo y WhatsApp;
- botón interno para restablecer la demo;
- integraciones reales con WhatsApp, correo o base de datos externa.

## Persistencia y alcance técnico

La demo **no utiliza backend ni base de datos externa**. Los datos se guardan en `localStorage`, dentro del navegador y dispositivo desde el que se utiliza la aplicación.

Los datos de distintos dispositivos no se sincronizan entre sí. En esta demo no se conectan servicios reales de correo, WhatsApp ni pagos. Las futuras interacciones dependientes de servicios externos se representarán mediante estados y acciones simuladas, dejando la estructura preparada para su integración posterior.

El encargo actual no contempla pago en línea, por lo que la demo no incorpora un flujo de pago real.

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

**Fase 5 — Resumen visual, profesionales con fotografía y agenda precargada con estados.**

El proyecto se desarrolla por fases. Antes de avanzar se revisan funcionalidad, responsive mobile-first, identidad visual y cumplimiento del briefing del cliente.
