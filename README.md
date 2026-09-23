# Turnos online — Estudio de paisajismo

Demo frontend de un sistema de reserva de turnos y agenda para un estudio de paisajismo.

La aplicación está pensada con enfoque **mobile-first**, para que la experiencia principal funcione cómodamente desde un teléfono móvil.

## Cómo abrir y entender esta demo

1. Abre la URL de previsualización facilitada para el proyecto.
2. En la pantalla principal, selecciona el tipo de servicio que necesitas.
3. Elige uno de los profesionales disponibles.
4. La selección queda guardada automáticamente en el navegador.
5. Si recargas la página, la aplicación mantiene la última selección realizada.

En esta primera fase todavía no se completa una reserva real: el botón **“Elegir día y hora”** permanecerá sin funcionalidad hasta que se incorpore el calendario en la siguiente fase.

## Servicios incluidos en la demo

La aplicación incorpora contenido específico del estudio de paisajismo, sin textos de relleno:

- **Visita de diagnóstico a terreno** — 60 min.
- **Consultoría de diseño botánico** — 75 min.
- **Supervisión de riego y siembra** — 45 min.

También se incluyen profesionales de ejemplo para que la demo pueda comprenderse desde el primer momento.

## Qué se puede probar actualmente

- Selección visual de servicio.
- Selección de profesional.
- Resumen de la elección realizada.
- Persistencia de la selección mediante `localStorage`.
- Diseño responsive con prioridad móvil.
- Identidad visual basada en el briefing del cliente.

### Identidad visual aplicada

- Verde Follaje Profundo: `#1E3A2F`
- Terracota Mineral: `#B85D38`
- Arena Cálido: `#F4F1EA`
- Verde Salvia: `#7D9D85`
- Gris Carbón: `#23272A`
- Titulares y destacados: **Outfit**
- Textos de lectura, formularios y controles: **Plus Jakarta Sans**

## Qué se incorporará en siguientes fases

Esta primera entrega es únicamente la base de la experiencia pública de reserva. Todavía no incluye:

- calendario semanal;
- selección real de día y hora;
- creación definitiva de citas;
- cancelación y reprogramación mediante código de reserva;
- panel interno de agenda;
- bloqueos de disponibilidad;
- estadísticas de ausencias;
- recordatorios simulados a 48 h y 3 h;
- integraciones reales con WhatsApp, correo o bases de datos externas.

## Persistencia de datos en esta demo

La demo **no utiliza backend ni base de datos externa**. Los datos se guardan en `localStorage`, es decir, dentro del navegador del dispositivo desde el que se está utilizando la aplicación.

Esto permite demostrar el funcionamiento sin configurar servicios externos. Los datos guardados en un dispositivo no se comparten automáticamente con otros dispositivos o navegadores.

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

Después, abre en el navegador la dirección que indique Next.js, normalmente:

```text
http://localhost:3000
```

## Estado del proyecto

**Fase 1 — Base pública de reserva.**

El proyecto se está desarrollando por fases. Cada fase se revisa antes de continuar para comprobar funcionalidad, diseño responsive, identidad visual y cumplimiento del briefing del cliente.
