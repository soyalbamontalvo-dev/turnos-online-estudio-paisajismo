# Turnos online — Estudio de paisajismo

Demo frontend de un sistema de reserva de turnos y agenda para un estudio de paisajismo.

La aplicación está diseñada con enfoque **mobile-first**, para que la experiencia principal funcione cómodamente desde un teléfono móvil.

## Cómo probar la demo

1. Abre la URL de previsualización facilitada para el proyecto.
2. Selecciona el tipo de servicio.
3. Elige uno de los profesionales disponibles.
4. Selecciona una fecha en el calendario semanal.
5. Escoge uno de los horarios disponibles.
6. Los horarios ya ocupados aparecen deshabilitados y no pueden seleccionarse.
7. Recarga la página para comprobar que la selección realizada se mantiene.

La demo guarda la información en el propio navegador mediante `localStorage`. No utiliza backend ni base de datos externa.

## Servicios incluidos

- **Visita de diagnóstico a terreno** — 60 min.
- **Consultoría de diseño botánico** — 75 min.
- **Supervisión de riego y siembra** — 45 min.

Se incluyen profesionales y citas de ejemplo realistas para que la aplicación pueda probarse sin configurar nada previamente.

## Funcionalidades disponibles actualmente

- Selección de servicio.
- Selección de profesional.
- Calendario semanal navegable.
- Selección de fecha.
- Selección de horario disponible.
- Horarios ocupados deshabilitados.
- Disponibilidad adaptada al profesional seleccionado.
- Resumen de la selección realizada.
- Persistencia de la selección mediante `localStorage`.
- Datos de ejemplo precargados.
- Diseño responsive con prioridad móvil.
- Identidad visual basada en el briefing del cliente.

## Restablecer la demo y recuperar los datos de ejemplo

Como esta versión funciona con `localStorage`, las pruebas realizadas quedan guardadas en el navegador.

Para volver al estado inicial de la demo:

1. Abre la aplicación en el navegador.
2. Borra los datos del sitio o el almacenamiento local correspondiente a esta URL desde la configuración del navegador.
3. Recarga la página.

Al volver a cargar la aplicación sin datos guardados, se utilizará nuevamente el estado inicial y los datos de ejemplo incluidos en la demo.

> En una fase posterior se podrá incorporar también un botón visible **“Restablecer demo”** para realizar este proceso directamente desde la propia aplicación, sin necesidad de entrar en la configuración del navegador.

## Identidad visual aplicada

- Verde Follaje Profundo: `#1E3A2F`
- Terracota Mineral: `#B85D38`
- Arena Cálido: `#F4F1EA`
- Verde Salvia: `#7D9D85`
- Gris Carbón: `#23272A`
- Titulares, números y destacados: **Outfit**
- Textos de lectura, formularios y controles: **Plus Jakarta Sans**

## Funcionalidades previstas en siguientes fases

Todavía no se incluyen:

- creación definitiva de la cita;
- formulario final de datos del cliente;
- código de reserva;
- cancelación y reprogramación mediante código;
- panel interno de agenda;
- bloqueos de disponibilidad desde el panel;
- estadísticas de ausencias;
- recordatorios simulados a 48 h y 3 h;
- integraciones reales con WhatsApp, correo o bases de datos externas.

## Persistencia de datos

La demo **no utiliza backend ni base de datos externa**. Los datos se guardan en `localStorage`, dentro del navegador y dispositivo desde el que se utiliza la aplicación.

Esto permite demostrar el funcionamiento sin configurar servicios externos. Los datos guardados en un navegador no se comparten automáticamente con otros dispositivos o navegadores.

## Alcance técnico acordado

Esta versión frontend se entrega sin conexiones reales a:

- WhatsApp Business API;
- SMTP/correo electrónico;
- pagos;
- base de datos centralizada;
- dominio definitivo.

Las interacciones que dependan de estos servicios se simularán visualmente dentro de la demo. Kodarvia asumirá posteriormente la conexión de los servicios reales, la base de datos centralizada, el dominio y la redacción legal definitiva.

## Tecnología

- Next.js
- React
- TypeScript
- `localStorage`
- GitHub para el código fuente
- Vercel para previsualización y despliegue

## Ejecutar el proyecto en local

Requisitos: Node.js y npm instalados.

```bash
npm install
npm run dev
```

Después, abre en el navegador la dirección indicada por Next.js, normalmente:

```text
http://localhost:3000
```

## Estado del proyecto

**Fase 2 — Selección de fecha y horario.**

El proyecto se desarrolla por fases. Cada fase se revisa antes de continuar para comprobar funcionalidad, diseño responsive, identidad visual y cumplimiento del briefing del cliente.
