# Turnos online — Estudio de paisajismo

Demo frontend de un sistema de reserva, reprogramación y gestión operativa de turnos para un estudio de paisajismo, desarrollada con enfoque **mobile-first**.

## Objetivo de la aplicación

Digitalizar la reserva y reprogramación de turnos de clientes y ordenar la agenda operativa de los profesionales del estudio en un panel ágil.

## Cómo probar la demo

### Reservar una cita

1. Abre la URL de previsualización del proyecto.
2. Selecciona servicio y profesional.
3. Selecciona fecha y horario disponible.
4. Completa nombre, teléfono y correo electrónico.
5. Confirma la reserva.
6. Guarda el código generado, por ejemplo `PAIS-ABC123`.

La cita queda guardada en `localStorage` y el horario pasa a mostrarse como ocupado.

### Gestionar una cita

Pulsa **“Gestionar turno”**.

1. Introduce el código de reserva.
2. Consulta servicio, profesional, fecha, hora y estado.
3. Reprograma a otro hueco disponible o cancela la cita.
4. Al cancelar o reprogramar, el hueco anterior queda disponible inmediatamente.

Para una prueba rápida puedes utilizar `DEMO01`.

### Panel interno y bloqueos de agenda

Pulsa **“Panel interno”** desde la reserva pública.

El dashboard permite:

- consultar el resumen operativo semanal;
- ver perfiles profesionales ficticios con fotografías de stock;
- revisar la agenda precargada con contenido específico de paisajismo;
- filtrar citas por profesional;
- crear y eliminar bloqueos de disponibilidad;
- editar el estado de cada cita;
- recalcular automáticamente la estadística de **no-show**.

Para comprobar los bloqueos:

1. En **Bloqueos de agenda**, elige profesional, fecha y hora.
2. Añade un motivo, por ejemplo `Visita técnica externa`.
3. Pulsa **“Bloquear horario”**.
4. Vuelve a **Reserva pública**, selecciona ese profesional y fecha: el turno aparecerá como **Bloqueado** y no se podrá reservar.
5. **Gestionar turno** tampoco permitirá reprogramar una cita a ese horario.
6. Elimina el bloqueo desde el panel y el turno volverá a quedar disponible siempre que no exista una cita activa.

Los bloqueos se guardan en `localStorage` con la clave `paisajismo-demo-blocks`.

### Cambiar estados y comprobar el no-show

En **Panel interno → Agenda operativa**:

1. Localiza una cita.
2. Cambia su estado desde el selector a **Ausente**.
3. La tarjeta superior **No-show** actualiza inmediatamente el porcentaje semanal y el número de ausencias.
4. Cambia de nuevo el estado a `confirmado`, `pendiente` o `cancelado` y comprueba que la estadística vuelve a recalcularse.
5. Recarga la página: el estado permanece porque se guarda en `localStorage`.

El porcentaje de no-show se calcula sobre las citas activas de la semana, excluyendo las canceladas.

## Servicios incluidos

- **Visita de diagnóstico a terreno** — 60 min.
- **Consultoría de diseño botánico** — 75 min.
- **Supervisión de riego y siembra** — 45 min.

Los textos son específicos del sector: asoleamiento, drenaje, selección de especies, diseño botánico, riego, siembra, taludes y puesta en marcha de jardines. No se utiliza texto de relleno.

## Profesionales demo

- **Lucía Herrera** — Arquitecta paisajista.
- **Mateo Rivas** — Especialista en diseño botánico.
- **Inés Valverde** — Coordinadora de obra verde.

Son perfiles ficticios para la demostración. Las fotografías se presentan expresamente como fotografías de stock.

## Funcionalidades disponibles actualmente

- Reserva pública de cita.
- Selección de servicio y profesional.
- Calendario semanal navegable.
- Horarios disponibles, ocupados y bloqueados.
- Código único de reserva.
- Consulta, cancelación y reprogramación mediante código.
- Liberación inmediata del hueco anterior al cancelar o reprogramar.
- Prevención de doble reserva dentro del mismo almacenamiento local.
- Bloqueos de agenda creados desde el panel interno.
- Los bloqueos impiden reservar y reprogramar ese horario.
- Dashboard interno de consulta y gestión.
- Agenda precargada con citas en distintos estados.
- Edición interna de estados `confirmado`, `pendiente`, `ausente` y `cancelado`.
- Estadística automática de no-show al cambiar estados.
- Filtro por profesional.
- Persistencia mediante `localStorage`.
- Diseño responsive con prioridad móvil.

## Restablecer la demo y recuperar los datos de ejemplo

Las pruebas quedan guardadas en el navegador mediante `localStorage`.

Para volver al estado inicial:

1. Abre la aplicación.
2. Borra los datos del sitio o el almacenamiento local de la URL de la demo desde la configuración del navegador.
3. Recarga la página.

Al cargar sin datos guardados se restauran los datos iniciales de demostración. En una fase posterior se incorporará un botón interno **“Restablecer demo”**.

## Identidad visual aplicada

- Verde Follaje Profundo: `#1E3A2F`
- Terracota Mineral: `#B85D38`
- Arena Cálido: `#F4F1EA`
- Verde Salvia: `#7D9D85`
- Gris Carbón: `#23272A`
- Titulares, números y destacados: **Outfit**
- Lectura, formularios, controles y tablas: **Plus Jakarta Sans**

## Funcionalidades previstas en siguientes fases

Todavía no se incluyen:

- búsqueda interna avanzada de citas;
- exportación;
- simulación visual de recordatorios a 48 h y 3 h;
- simulación de estados de correo y WhatsApp;
- botón interno para restablecer la demo;
- integraciones reales con WhatsApp, correo o base de datos externa.

## Persistencia y alcance técnico

La demo **no utiliza backend ni base de datos externa**. Los datos se guardan en `localStorage` en el navegador y dispositivo utilizados.

Esto permite demostrar el flujo sin configurar servicios externos. No existe sincronización real entre dispositivos y la prevención de concurrencia entre usuarios distintos requerirá una base de datos centralizada en la implementación posterior.

No se conectan servicios reales de correo, WhatsApp ni pagos. Las futuras interacciones dependientes de esos servicios se representarán mediante estados y acciones simuladas.

El encargo actual no contempla pago en línea, por lo que no existe flujo de pago real.

## Tecnología

- Next.js
- React
- TypeScript
- `localStorage`
- GitHub
- Vercel

## Ejecutar el proyecto en local

```bash
npm install
npm run dev
```

Después abre la dirección indicada por Next.js, normalmente:

```text
http://localhost:3000
```

## Estado del proyecto

**Fase 7 — Edición de estados y recálculo automático de no-show.**

El proyecto se desarrolla por fases. Cada fase se revisa antes de continuar para comprobar funcionalidad, responsive mobile-first, identidad visual y cumplimiento de los criterios de aceptación.
