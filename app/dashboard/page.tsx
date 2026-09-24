"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css";
import blockStyles from "./blocks.module.css";

const APPOINTMENTS_KEY = "paisajismo-demo-appointments";
const BLOCKS_KEY = "paisajismo-demo-blocks";
const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const services = {
  diagnostico: "Visita de diagnóstico a terreno",
  botanico: "Consultoría de diseño botánico",
  riego: "Supervisión de riego y siembra",
} as const;

const serviceShowcase = [
  { id: "diagnostico", eyebrow: "Lectura del lugar", title: "Visita de diagnóstico a terreno", text: "Lectura técnica de orientación solar, drenaje, pendientes, circulaciones, suelo y relación con la vivienda antes de decidir cómo intervenir.", detail: "Jardines residenciales, patios, terrazas y terrenos que necesitan ordenar prioridades.", photo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=82" },
  { id: "botanico", eyebrow: "Vegetación con criterio", title: "Consultoría de diseño botánico", text: "Selección y composición de especies según exposición, humedad, mantenimiento, escala y carácter del proyecto.", detail: "Paletas vegetales, sustituciones, sombra, terrazas soleadas y jardines de bajo mantenimiento.", photo: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=82" },
  { id: "riego", eyebrow: "Ejecución y seguimiento", title: "Supervisión de riego y siembra", text: "Revisión de sectorización, cobertura, presión, programación e implantación de especies para reducir fallos en la puesta en marcha.", detail: "Obra verde, nuevas plantaciones y revisión de zonas secas o con exceso de agua.", photo: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=82" },
] as const;

const professionals = [
  { id: "lucia", name: "Lucía Herrera", role: "Arquitecta paisajista", specialty: "Diagnóstico de sitio, lectura del terreno y estrategia de implantación.", bio: "Coordina las primeras visitas y transforma los condicionantes del terreno en una hoja de ruta clara.", focus: "Vivienda unifamiliar · patios · jardines de nueva implantación", photo: "https://images.unsplash.com/photo-1747671688812-76d7bca21f34?auto=format&fit=crop&w=900&q=82", credit: "Arturo Añez · Unsplash" },
  { id: "mateo", name: "Mateo Rivas", role: "Especialista en diseño botánico", specialty: "Paletas vegetales, especies adaptadas y composición estacional.", bio: "Trabaja la selección vegetal desde la luz, textura, mantenimiento y evolución temporal del espacio.", focus: "Paletas vegetales · terrazas · jardines de bajo consumo", photo: "https://images.unsplash.com/photo-1772450236019-7b1c970b57ad?auto=format&fit=crop&w=900&q=82", credit: "Rodrigo Rodrigues · Unsplash" },
  { id: "ines", name: "Inés Valverde", role: "Coordinadora de obra verde", specialty: "Supervisión de riego, siembra y puesta en marcha de jardines.", bio: "Acompaña la ejecución para comprobar que plantación, riego y acabados respondan al diseño previsto.", focus: "Riego · plantación · control de ejecución", photo: "https://images.unsplash.com/photo-1758207573678-aecc46b2a64a?auto=format&fit=crop&w=900&q=82", credit: "Elist Nguyen · Unsplash" },
] as const;

type ProfessionalId = "lucia" | "mateo" | "ines";
type Status = "confirmado" | "pendiente" | "ausente" | "cancelado";
type DemoAppointment = {
  id: string; code: string; clientName: string; email?: string; phone?: string; note?: string; projectType?: string; location?: string;
  serviceId: keyof typeof services; professionalId: ProfessionalId; date: string; time: string; status: Status; createdAt?: string;
};
type AvailabilityBlock = { id: string; professionalId: ProfessionalId; date: string; time: string; reason: string; createdAt?: string };

type BlockForm = { professionalId: ProfessionalId; date: string; time: string; reason: string };

function toDateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function fromDateKey(key: string) { const [year, month, day] = key.split("-").map(Number); return new Date(year, month - 1, day); }
function addDays(date: Date, amount: number) { const next = new Date(date); next.setDate(next.getDate() + amount); return next; }
function startOfWeek(date: Date) { const start = new Date(date); const day = start.getDay(); start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day)); start.setHours(0, 0, 0, 0); return start; }
function formatDate(key: string) { return fromDateKey(key).toLocaleDateString("es-ES", { weekday: "short", day: "numeric", month: "short" }); }

function createRichSeed(monday: Date): DemoAppointment[] {
  return [
    { id: "demo-01", code: "DEMO01", clientName: "Camila Paredes", email: "camila.paredes@demo.hn", phone: "+504 9874 2130", projectType: "Jardín residencial · 420 m²", location: "Lomas del Guijarro · Tegucigalpa", serviceId: "diagnostico", professionalId: "lucia", date: toDateKey(addDays(monday, 2)), time: "10:30", status: "confirmado", note: "Evaluar asoleamiento, drenaje, recorridos y privacidad antes de reorganizar el jardín posterior." },
    { id: "demo-02", code: "DEMO02", clientName: "Esteban Mejía", email: "esteban.mejia@demo.hn", phone: "+504 9981 4052", projectType: "Patio interior · 75 m²", location: "Col. Palmira · Tegucigalpa", serviceId: "botanico", professionalId: "lucia", date: toDateKey(addDays(monday, 3)), time: "14:00", status: "confirmado", note: "Revisar propuesta vegetal para patio sombreado y reducir demanda de riego y mantenimiento." },
    { id: "demo-03", code: "DEMO03", clientName: "Valeria Durón", email: "valeria.duron@demo.hn", phone: "+504 9732 6621", projectType: "Jardín familiar · 260 m²", location: "El Hatillo · Tegucigalpa", serviceId: "riego", professionalId: "mateo", date: toDateKey(addDays(monday, 2)), time: "12:00", status: "pendiente", note: "Comprobar cobertura de riego por goteo y ajustar sectores antes de la plantación." },
    { id: "demo-04", code: "DEMO04", clientName: "Nicolás Ferrera", email: "nicolas.ferrera@demo.hn", phone: "+504 9554 1187", projectType: "Talud ajardinado · 180 m²", location: "Residencial Las Uvas · Tegucigalpa", serviceId: "diagnostico", professionalId: "mateo", date: toDateKey(addDays(monday, 4)), time: "15:30", status: "confirmado", note: "Diagnosticar escorrentía y erosión y definir criterios de estabilización vegetal." },
    { id: "demo-05", code: "DEMO05", clientName: "Mariana Zelaya", email: "mariana.zelaya@demo.hn", phone: "+504 9905 7740", projectType: "Jardín de nueva obra · 510 m²", location: "Valle de Ángeles", serviceId: "riego", professionalId: "ines", date: toDateKey(addDays(monday, 3)), time: "09:00", status: "confirmado", note: "Supervisar sectorización, presión y programación de riego antes de recepción de obra." },
    { id: "demo-06", code: "DEMO06", clientName: "Jorge Lanza", email: "jorge.lanza@demo.hn", phone: "+504 9655 8204", projectType: "Terraza urbana · 48 m²", location: "Col. Florencia Norte · Tegucigalpa", serviceId: "botanico", professionalId: "ines", date: toDateKey(addDays(monday, 4)), time: "10:30", status: "pendiente", note: "Seleccionar especies resistentes a sol intenso, viento y cultivo en contenedor." },
    { id: "demo-07", code: "DEMO07", clientName: "Paola Rivera", email: "paola.rivera@demo.hn", phone: "+504 9442 6003", projectType: "Vivienda unifamiliar · 600 m²", location: "Santa Lucía", serviceId: "diagnostico", professionalId: "lucia", date: toDateKey(addDays(monday, 7)), time: "09:00", status: "confirmado", note: "Reorganizar accesos, zona social exterior y transición con árboles existentes." },
    { id: "demo-08", code: "DEMO08", clientName: "Sofía Andino", email: "sofia.andino@demo.hn", phone: "+504 9840 1135", projectType: "Jardín existente · 310 m²", location: "Col. Tepeyac · Tegucigalpa", serviceId: "botanico", professionalId: "mateo", date: toDateKey(monday), time: "14:00", status: "ausente", note: "Sustituir césped de alto consumo por cubresuelos y masas vegetales adaptadas." },
    { id: "demo-09", code: "DEMO09", clientName: "Andrés Cáceres", email: "andres.caceres@demo.hn", phone: "+504 9711 2498", projectType: "Jardín consolidado · 220 m²", location: "Col. Alameda · Tegucigalpa", serviceId: "riego", professionalId: "ines", date: toDateKey(addDays(monday, 1)), time: "15:30", status: "cancelado", note: "Revisión de goteros obstruidos y diferencias de humedad entre sectores." },
  ];
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [professionalFilter, setProfessionalFilter] = useState("todos");
  const [todayKey, setTodayKey] = useState("");
  const [weekStartKey, setWeekStartKey] = useState("");
  const [ready, setReady] = useState(false);
  const [blockForm, setBlockForm] = useState<BlockForm>({ professionalId: "lucia", date: "", time: "09:00", reason: "" });
  const [blockMessage, setBlockMessage] = useState("");
  const [blockError, setBlockError] = useState("");

  useEffect(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0); const monday = startOfWeek(today); const seed = createRichSeed(monday);
    let existing: DemoAppointment[] = [];
    try { existing = JSON.parse(window.localStorage.getItem(APPOINTMENTS_KEY) || "[]") as DemoAppointment[]; } catch {}
    const seedById = new Map(seed.map((item) => [item.id, item]));
    const merged = existing.length ? existing.map((item) => { const richer = seedById.get(item.id); return richer ? { ...richer, ...item, note: item.note || richer.note, email: item.email || richer.email, phone: item.phone || richer.phone, projectType: item.projectType || richer.projectType, location: item.location || richer.location } : item; }) : seed;
    const ids = new Set(merged.map((item) => item.id)); seed.forEach((item) => { if (!ids.has(item.id)) merged.push(item); });
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(merged)); setAppointments(merged);

    let currentBlocks: AvailabilityBlock[] = [];
    try { currentBlocks = JSON.parse(window.localStorage.getItem(BLOCKS_KEY) || "[]") as AvailabilityBlock[]; } catch {}
    if (!window.localStorage.getItem(BLOCKS_KEY)) {
      currentBlocks = [{ id: "block-demo-01", professionalId: "lucia", date: toDateKey(addDays(monday, 1)), time: "17:00", reason: "Visita técnica externa", createdAt: new Date().toISOString() }];
      window.localStorage.setItem(BLOCKS_KEY, JSON.stringify(currentBlocks));
    }
    setBlocks(currentBlocks);
    const todayDateKey = toDateKey(today); setTodayKey(todayDateKey); setWeekStartKey(toDateKey(monday));
    setBlockForm((current) => ({ ...current, date: todayDateKey })); setReady(true);
  }, []);

  const weekEndKey = useMemo(() => weekStartKey ? toDateKey(addDays(fromDateKey(weekStartKey), 6)) : "", [weekStartKey]);
  const summary = useMemo(() => {
    const inWeek = appointments.filter((item) => item.date >= weekStartKey && item.date <= weekEndKey);
    return { today: inWeek.filter((item) => item.date === todayKey && item.status !== "cancelado").length, week: inWeek.filter((item) => item.status !== "cancelado").length, pending: inWeek.filter((item) => item.status === "pendiente").length, absent: inWeek.filter((item) => item.status === "ausente").length };
  }, [appointments, todayKey, weekEndKey, weekStartKey]);

  const visibleAppointments = useMemo(() => {
    if (!weekStartKey) return [];
    const maxDate = toDateKey(addDays(fromDateKey(weekStartKey), 13));
    return appointments.filter((item) => item.date >= weekStartKey && item.date <= maxDate && (professionalFilter === "todos" || item.professionalId === professionalFilter)).sort((a, b) => `${a.date}-${a.time}`.localeCompare(`${b.date}-${b.time}`));
  }, [appointments, professionalFilter, weekStartKey]);

  const visibleBlocks = useMemo(() => blocks.filter((block) => block.date >= todayKey).sort((a, b) => `${a.date}-${a.time}`.localeCompare(`${b.date}-${b.time}`)), [blocks, todayKey]);
  const weekLabel = weekStartKey ? `${formatDate(weekStartKey)} — ${formatDate(weekEndKey)}` : "";

  function saveBlocks(next: AvailabilityBlock[]) { window.localStorage.setItem(BLOCKS_KEY, JSON.stringify(next)); setBlocks(next); }
  function createBlock(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBlockError(""); setBlockMessage("");
    if (!blockForm.date || !blockForm.time || !blockForm.reason.trim()) return setBlockError("Completa profesional, fecha, hora y motivo del bloqueo.");
    if (blockForm.date < todayKey) return setBlockError("No puedes crear un bloqueo en una fecha pasada.");
    const appointmentConflict = appointments.some((a) => a.professionalId === blockForm.professionalId && a.date === blockForm.date && a.time === blockForm.time && a.status !== "cancelado");
    const duplicate = blocks.some((b) => b.professionalId === blockForm.professionalId && b.date === blockForm.date && b.time === blockForm.time);
    if (appointmentConflict) return setBlockError("Ese horario ya contiene una cita activa. Elige otro hueco.");
    if (duplicate) return setBlockError("Ese horario ya está bloqueado para este profesional.");
    const next = [...blocks, { id: `block-${Date.now()}`, professionalId: blockForm.professionalId, date: blockForm.date, time: blockForm.time, reason: blockForm.reason.trim(), createdAt: new Date().toISOString() }];
    saveBlocks(next); setBlockMessage("Bloqueo creado. El turno deja de estar disponible para reserva y reprogramación."); setBlockForm((current) => ({ ...current, reason: "" }));
  }
  function removeBlock(id: string) { saveBlocks(blocks.filter((block) => block.id !== id)); setBlockMessage("Bloqueo eliminado. El horario vuelve a quedar disponible si no existe una cita."); setBlockError(""); }

  return (
    <main className={styles.shell}>
      <header className={styles.header}><a className={styles.brand} href="/"><span className={styles.mark}>P</span><span><strong>Estudio Paisaje</strong><span>Panel interno · demo</span></span></a><nav className={styles.headerActions}><a href="/">Reserva pública</a><a href="/gestionar">Gestionar turno</a></nav></header>

      <section className={styles.hero}><div><p className={styles.kicker}>Resumen del estudio</p><h1>La agenda, de un vistazo.</h1><p>Una vista interna para ordenar visitas, profesionales y disponibilidad operativa del estudio.</p></div><div className={styles.weekBadge}><span>Semana visible</span><strong>{weekLabel}</strong></div></section>
      <section className={styles.summaryGrid}><article className={styles.metric}><span>Citas hoy</span><strong>{ready ? summary.today : "—"}</strong><small>Visitas activas</small></article><article className={styles.metric}><span>Semana activa</span><strong>{ready ? summary.week : "—"}</strong><small>Sin cancelaciones</small></article><article className={styles.metric}><span>Pendientes</span><strong>{ready ? summary.pending : "—"}</strong><small>Por confirmar</small></article><article className={styles.metric}><span>Ausencias</span><strong>{ready ? summary.absent : "—"}</strong><small>Inasistencias registradas</small></article></section>

      <section className={blockStyles.blockSection} aria-labelledby="blocks-title">
        <div className={blockStyles.heading}><span>Disponibilidad operativa</span><h2 id="blocks-title">Bloqueos de agenda</h2><p>Reserva tiempo no disponible para visitas: reuniones, desplazamientos, trabajo de campo u otras tareas internas. El bloqueo se aplica también a la reserva pública y a la reprogramación.</p></div>
        <form className={blockStyles.form} onSubmit={createBlock}>
          <div className={blockStyles.formGrid}>
            <div className={blockStyles.field}><label htmlFor="block-professional">Profesional</label><select id="block-professional" value={blockForm.professionalId} onChange={(e) => setBlockForm({ ...blockForm, professionalId: e.target.value as ProfessionalId })}>{professionals.map((p) => <option value={p.id} key={p.id}>{p.name}</option>)}</select></div>
            <div className={blockStyles.field}><label htmlFor="block-date">Fecha</label><input id="block-date" type="date" min={todayKey} value={blockForm.date} onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })} /></div>
            <div className={blockStyles.field}><label htmlFor="block-time">Hora</label><select id="block-time" value={blockForm.time} onChange={(e) => setBlockForm({ ...blockForm, time: e.target.value })}>{timeSlots.map((time) => <option key={time}>{time}</option>)}</select></div>
            <div className={`${blockStyles.field} ${blockStyles.fieldReason}`}><label htmlFor="block-reason">Motivo</label><input id="block-reason" value={blockForm.reason} onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })} placeholder="Ej. Visita técnica externa" /></div>
          </div>
          <div className={blockStyles.actions}><button className={blockStyles.primary} type="submit">Bloquear horario</button>{blockMessage && <p className={blockStyles.message}>{blockMessage}</p>}{blockError && <p className={blockStyles.error} role="alert">{blockError}</p>}</div>
        </form>
        {visibleBlocks.length ? <div className={blockStyles.list}>{visibleBlocks.map((block) => { const professional = professionals.find((p) => p.id === block.professionalId); return <article className={blockStyles.blockItem} key={block.id}><div className={blockStyles.blockMeta}><strong>{formatDate(block.date)} · {block.time}</strong><span>{professional?.name} · {block.reason}</span><small>Este horario no puede reservarse ni utilizarse para reprogramar.</small></div><button className={blockStyles.remove} type="button" onClick={() => removeBlock(block.id)}>Eliminar bloqueo</button></article>; })}</div> : <p className={blockStyles.empty}>No hay bloqueos futuros. Toda la disponibilidad depende únicamente de las citas registradas.</p>}
      </section>

      <section className={styles.section}><div className={styles.sectionHeading}><div><p className={styles.kicker}>Servicios</p><h2>Servicios en contexto</h2></div><p>Textos y fotografías demo específicos del trabajo paisajístico.</p></div><div className={styles.serviceVisualGrid}>{serviceShowcase.map((service) => <article className={styles.serviceVisualCard} key={service.id}><img src={service.photo} alt="Escena de paisajismo asociada al servicio" loading="lazy" /><div className={styles.serviceVisualBody}><span>{service.eyebrow}</span><h3>{service.title}</h3><p>{service.text}</p><small>{service.detail}</small></div></article>)}</div></section>

      <section className={styles.section}><div className={styles.sectionHeading}><div><p className={styles.kicker}>Equipo</p><h2>Profesionales del estudio</h2></div><p>Perfiles ficticios con fotografías de stock para esta demostración.</p></div><div className={styles.professionalGrid}>{professionals.map((professional) => { const activeCount = appointments.filter((item) => item.professionalId === professional.id && item.status !== "cancelado").length; return <article className={styles.professionalCard} key={professional.id}><img src={professional.photo} alt={`Fotografía de stock asociada al perfil ficticio de ${professional.name}`} loading="lazy" /><div className={styles.professionalBody}><div className={styles.professionalTop}><div><h3>{professional.name}</h3><span>{professional.role}</span></div><strong>{activeCount}</strong></div><p className={styles.professionalBio}>{professional.bio}</p><p>{professional.specialty}</p><div className={styles.focusTag}>{professional.focus}</div><small>Fotografía demo: {professional.credit}</small></div></article>; })}</div></section>

      <section className={styles.section}><div className={styles.sectionHeading}><div><p className={styles.kicker}>Agenda precargada</p><h2>Próximas citas y estados</h2></div><p>La agenda comparte el mismo localStorage con la reserva pública y la gestión por código.</p></div><div className={styles.filters}><button className={professionalFilter === "todos" ? styles.filterActive : ""} onClick={() => setProfessionalFilter("todos")} type="button">Todos</button>{professionals.map((p) => <button key={p.id} className={professionalFilter === p.id ? styles.filterActive : ""} onClick={() => setProfessionalFilter(p.id)} type="button">{p.name.split(" ")[0]}</button>)}</div><div className={styles.agendaList}>{visibleAppointments.map((appointment) => { const professional = professionals.find((item) => item.id === appointment.professionalId); return <article className={styles.agendaItem} key={appointment.id}><div className={styles.agendaWhen}><strong>{appointment.time}</strong><span>{formatDate(appointment.date)}</span></div><div className={styles.agendaMain}><div className={styles.agendaTitleRow}><h3>{appointment.clientName}</h3><span className={`${styles.status} ${styles[`status_${appointment.status}`]}`}>{appointment.status}</span></div><strong>{services[appointment.serviceId]}</strong><div className={styles.projectMeta}>{appointment.projectType && <span>{appointment.projectType}</span>}{appointment.location && <span>{appointment.location}</span>}</div><p>{appointment.note || "Consulta paisajística registrada en la agenda de demostración."}</p></div><div className={styles.agendaProfessional}><span>Profesional</span><strong>{professional?.name}</strong><small>{appointment.code}</small></div></article>; })}</div></section>

      <section className={styles.demoNote}><strong>Fase 6 · bloqueos operativos</strong><p>Esta fase valida que la disponibilidad del cliente responda a la agenda real del estudio. La edición de estados, estadísticas avanzadas y recordatorios simulados quedan para fases posteriores.</p></section>
    </main>
  );
}
