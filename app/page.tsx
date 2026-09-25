"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

const services = [
  { id: "diagnostico", title: "Visita de diagnóstico a terreno", description: "Primera revisión del espacio, orientación técnica y prioridades de intervención.", duration: "60 min" },
  { id: "botanico", title: "Consultoría de diseño botánico", description: "Selección vegetal, composición y criterios de mantenimiento adaptados al proyecto.", duration: "75 min" },
  { id: "riego", title: "Supervisión de riego y siembra", description: "Revisión técnica de implantación, riego y condiciones para una ejecución correcta.", duration: "45 min" },
];

const professionals = [
  { id: "lucia", name: "Lucía Herrera", role: "Arquitecta paisajista" },
  { id: "mateo", name: "Mateo Rivas", role: "Especialista en diseño botánico" },
  { id: "ines", name: "Inés Valverde", role: "Coordinadora de obra verde" },
];

const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];
const STORAGE_KEY = "paisajismo-booking-draft";
const APPOINTMENTS_KEY = "paisajismo-demo-appointments";
const BLOCKS_KEY = "paisajismo-demo-blocks";
const STUDIO_TIME_ZONE = "America/Tegucigalpa";

type Draft = { serviceId: string; professionalId: string; date: string; time: string };
type DemoAppointment = {
  id: string; code: string; clientName: string; email?: string; phone?: string; note?: string;
  serviceId: string; professionalId: string; date: string; time: string;
  status: "confirmado" | "pendiente" | "ausente" | "cancelado"; createdAt?: string;
};
type AvailabilityBlock = { id: string; professionalId: string; date: string; time: string; reason: string; createdAt?: string };
type FormData = { name: string; email: string; phone: string; note: string };

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function addDays(date: Date, amount: number) { const next = new Date(date); next.setDate(next.getDate() + amount); return next; }
function startOfWeek(date: Date) {
  const start = new Date(date); const day = start.getDay(); const difference = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + difference); start.setHours(0, 0, 0, 0); return start;
}
function getStudioNow() {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: STUDIO_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date());
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]));
  return { dateKey: `${values.year}-${values.month}-${values.day}`, time: `${values.hour}:${values.minute}` };
}
function isPastSlot(dateKey: string, time: string) {
  const now = getStudioNow();
  return dateKey < now.dateKey || (dateKey === now.dateKey && time <= now.time);
}
function createDemoAppointments(monday: Date): DemoAppointment[] {
  return [
    { id: "demo-01", code: "DEMO01", clientName: "Camila Paredes", serviceId: "diagnostico", professionalId: "lucia", date: toDateKey(addDays(monday, 2)), time: "10:30", status: "confirmado" },
    { id: "demo-02", code: "DEMO02", clientName: "Esteban Mejía", serviceId: "botanico", professionalId: "lucia", date: toDateKey(addDays(monday, 3)), time: "14:00", status: "confirmado" },
    { id: "demo-03", code: "DEMO03", clientName: "Valeria Durón", serviceId: "riego", professionalId: "mateo", date: toDateKey(addDays(monday, 2)), time: "12:00", status: "pendiente" },
    { id: "demo-04", code: "DEMO04", clientName: "Nicolás Ferrera", serviceId: "diagnostico", professionalId: "mateo", date: toDateKey(addDays(monday, 4)), time: "15:30", status: "confirmado" },
    { id: "demo-05", code: "DEMO05", clientName: "Mariana Zelaya", serviceId: "riego", professionalId: "ines", date: toDateKey(addDays(monday, 3)), time: "09:00", status: "confirmado" },
    { id: "demo-06", code: "DEMO06", clientName: "Jorge Lanza", serviceId: "botanico", professionalId: "ines", date: toDateKey(addDays(monday, 4)), time: "10:30", status: "pendiente" },
    { id: "demo-07", code: "DEMO07", clientName: "Paola Rivera", serviceId: "diagnostico", professionalId: "lucia", date: toDateKey(addDays(monday, 7)), time: "09:00", status: "confirmado" },
  ];
}
function generateCode() { return `PAIS-${Math.random().toString(36).slice(2, 8).toUpperCase()}`; }

export default function HomePage() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [professionalId, setProfessionalId] = useState(professionals[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [todayKey, setTodayKey] = useState("");
  const [baseMondayKey, setBaseMondayKey] = useState("");
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [form, setForm] = useState<FormData>({ name: "", email: "", phone: "", note: "" });
  const [confirmedAppointment, setConfirmedAppointment] = useState<DemoAppointment | null>(null);
  const [formError, setFormError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const studioNow = getStudioNow();
    const today = fromDateKey(studioNow.dateKey);
    const monday = startOfWeek(today); const currentTodayKey = studioNow.dateKey; const currentMondayKey = toDateKey(monday);
    setTodayKey(currentTodayKey); setBaseMondayKey(currentMondayKey);

    let demoAppointments = createDemoAppointments(monday);
    const storedAppointments = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (storedAppointments) {
      try { demoAppointments = JSON.parse(storedAppointments) as DemoAppointment[]; }
      catch { window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(demoAppointments)); }
    } else window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(demoAppointments));
    setAppointments(demoAppointments);

    const storedBlocks = window.localStorage.getItem(BLOCKS_KEY);
    if (storedBlocks) { try { setBlocks(JSON.parse(storedBlocks) as AvailabilityBlock[]); } catch { window.localStorage.removeItem(BLOCKS_KEY); } }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as Partial<Draft>;
        if (draft.serviceId && services.some((item) => item.id === draft.serviceId)) setServiceId(draft.serviceId);
        if (draft.professionalId && professionals.some((item) => item.id === draft.professionalId)) setProfessionalId(draft.professionalId);
        if (draft.date && draft.date >= currentTodayKey) {
          const draftDate = fromDateKey(draft.date);
          const diffDays = Math.round((draftDate.getTime() - monday.getTime()) / 86400000);
          const draftWeekOffset = Math.max(0, Math.floor(diffDays / 7));
          if (draftWeekOffset <= 4) { setWeekOffset(draftWeekOffset); setSelectedDate(draft.date); if (draft.time && timeSlots.includes(draft.time) && !isPastSlot(draft.date, draft.time)) setSelectedTime(draft.time); }
        }
      } catch { window.localStorage.removeItem(STORAGE_KEY); }
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === APPOINTMENTS_KEY && event.newValue) { try { setAppointments(JSON.parse(event.newValue) as DemoAppointment[]); } catch {} }
      if (event.key === BLOCKS_KEY) { try { setBlocks(event.newValue ? JSON.parse(event.newValue) as AvailabilityBlock[] : []); } catch {} }
    };
    window.addEventListener("storage", handleStorage); setReady(true);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const weekStart = useMemo(() => baseMondayKey ? addDays(fromDateKey(baseMondayKey), weekOffset * 7) : null, [baseMondayKey, weekOffset]);
  const weekDays = useMemo(() => weekStart ? Array.from({ length: 6 }, (_, index) => addDays(weekStart, index)) : [], [weekStart]);
  useEffect(() => {
    if (!ready || !weekStart || selectedDate) return;
    const firstAvailableDay = weekDays.find((date) => toDateKey(date) >= todayKey);
    if (firstAvailableDay) setSelectedDate(toDateKey(firstAvailableDay));
  }, [ready, selectedDate, todayKey, weekDays, weekStart]);

  const selectedService = useMemo(() => services.find((item) => item.id === serviceId) ?? services[0], [serviceId]);
  const selectedProfessional = useMemo(() => professionals.find((item) => item.id === professionalId) ?? professionals[0], [professionalId]);
  const blockedTimes = useMemo(() => new Set(blocks.filter((block) => block.professionalId === professionalId && block.date === selectedDate).map((block) => block.time)), [blocks, professionalId, selectedDate]);
  const occupiedTimes = useMemo(() => {
    if (!selectedDate) return new Set<string>();
    return new Set(appointments.filter((a) => a.professionalId === professionalId && a.date === selectedDate && a.status !== "cancelado").map((a) => a.time));
  }, [appointments, professionalId, selectedDate]);

  useEffect(() => { if (selectedTime && (occupiedTimes.has(selectedTime) || blockedTimes.has(selectedTime) || isPastSlot(selectedDate, selectedTime))) setSelectedTime(""); }, [blockedTimes, occupiedTimes, selectedDate, selectedTime]);
  useEffect(() => { if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ serviceId, professionalId, date: selectedDate, time: selectedTime } satisfies Draft)); }, [serviceId, professionalId, selectedDate, selectedTime, ready]);

  const weekLabel = useMemo(() => {
    if (!weekStart) return "";
    const end = addDays(weekStart, 5);
    return `${weekStart.toLocaleDateString("es-ES", { day: "numeric", month: "short" })} — ${end.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}`;
  }, [weekStart]);
  const selectedDateLabel = selectedDate ? fromDateKey(selectedDate).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) : "Selecciona un día";

  function changeWeek(direction: -1 | 1) {
    const nextOffset = Math.min(4, Math.max(0, weekOffset + direction)); if (nextOffset === weekOffset || !baseMondayKey) return;
    const nextWeekStart = addDays(fromDateKey(baseMondayKey), nextOffset * 7);
    const candidates = Array.from({ length: 6 }, (_, index) => addDays(nextWeekStart, index));
    const firstAvailable = candidates.find((date) => toDateKey(date) >= todayKey) ?? candidates[0];
    setWeekOffset(nextOffset); setSelectedDate(toDateKey(firstAvailable)); setSelectedTime("");
  }
  function selectDay(date: Date) { const key = toDateKey(date); if (key < todayKey) return; setSelectedDate(key); setSelectedTime(""); }

  function submitBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setFormError("");
    if (!selectedDate || !selectedTime) return setFormError("Selecciona primero un día y una hora disponibles.");
    if (isPastSlot(selectedDate, selectedTime)) { setSelectedTime(""); return setFormError("Ese horario ya ha pasado en Tegucigalpa. Elige otro turno disponible."); }
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) return setFormError("Completa nombre, teléfono y correo para confirmar la reserva.");

    let latestAppointments = appointments; let latestBlocks = blocks;
    try { latestAppointments = JSON.parse(window.localStorage.getItem(APPOINTMENTS_KEY) || "[]") as DemoAppointment[]; } catch {}
    try { latestBlocks = JSON.parse(window.localStorage.getItem(BLOCKS_KEY) || "[]") as AvailabilityBlock[]; } catch {}
    const appointmentConflict = latestAppointments.some((a) => a.professionalId === professionalId && a.date === selectedDate && a.time === selectedTime && a.status !== "cancelado");
    const blockConflict = latestBlocks.some((b) => b.professionalId === professionalId && b.date === selectedDate && b.time === selectedTime);
    if (appointmentConflict || blockConflict) {
      setAppointments(latestAppointments); setBlocks(latestBlocks); setSelectedTime("");
      return setFormError(blockConflict ? "Ese horario ha sido bloqueado por el estudio. Elige otro turno disponible." : "Ese horario acaba de ocuparse. Elige otro turno disponible.");
    }

    const appointment: DemoAppointment = {
      id: `booking-${Date.now()}`, code: generateCode(), clientName: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), note: form.note.trim(),
      serviceId, professionalId, date: selectedDate, time: selectedTime, status: "confirmado", createdAt: new Date().toISOString(),
    };
    const nextAppointments = [...latestAppointments, appointment];
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(nextAppointments)); window.localStorage.removeItem(STORAGE_KEY);
    setAppointments(nextAppointments); setConfirmedAppointment(appointment);
    window.setTimeout(() => document.getElementById("confirmation")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
  }

  function startNewBooking() { setConfirmedAppointment(null); setSelectedTime(""); setForm({ name: "", email: "", phone: "", note: "" }); window.setTimeout(() => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" }), 50); }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">P</div>
        <div><p className="brand-name">Estudio Paisaje</p><p className="brand-subtitle">Agenda de visitas y consultoría</p></div>
        <nav className="top-actions" aria-label="Accesos de la demo"><a className="nav-link" href="/gestionar">Gestionar turno</a><a className="ghost-button" href="/dashboard">Panel interno</a></nav>
      </header>

      <section className="hero"><p className="eyebrow">Reserva online</p><h1>Tu paisaje empieza aquí.</h1><p className="hero-copy">Elige el servicio, encuentra un horario y confirma tu visita en pocos pasos.</p></section>

      <section className="booking-card" id="booking" aria-labelledby="booking-title">
        <div className="step-heading"><span className="step-number">01</span><div><p className="overline">Servicio y profesional</p><h2 id="booking-title">¿Qué necesitas?</h2></div></div>
        <div className="service-grid">
          {services.map((service) => {
            const active = service.id === serviceId;
            return <button className={`service-card ${active ? "is-active" : ""}`} key={service.id} type="button" aria-pressed={active} onClick={() => { setServiceId(service.id); setConfirmedAppointment(null); }}><div className="service-card-topline"><span>{service.duration}</span><span className="selection-dot" aria-hidden="true" /></div><strong>{service.title}</strong><span>{service.description}</span></button>;
          })}
        </div>
        <div className="field-block"><label htmlFor="professional">Profesional</label><select id="professional" value={professionalId} onChange={(event) => { setProfessionalId(event.target.value); setSelectedTime(""); setConfirmedAppointment(null); }}>{professionals.map((professional) => <option key={professional.id} value={professional.id}>{professional.name} · {professional.role}</option>)}</select></div>
      </section>

      <section className="booking-card calendar-card" aria-labelledby="calendar-title">
        <div className="step-heading"><span className="step-number">02</span><div><p className="overline">Disponibilidad</p><h2 id="calendar-title">Elige día y hora</h2></div></div>
        {!ready || !weekStart ? <div className="calendar-loading">Preparando disponibilidad…</div> : <>
          <div className="week-toolbar" aria-label="Navegación semanal"><button type="button" className="week-nav-button" onClick={() => changeWeek(-1)} disabled={weekOffset === 0}>←</button><div><span>Semana</span><strong>{weekLabel}</strong></div><button type="button" className="week-nav-button" onClick={() => changeWeek(1)} disabled={weekOffset === 4}>→</button></div>
          <div className="day-strip">{weekDays.map((date) => { const key = toDateKey(date); const active = key === selectedDate; return <button type="button" className={`day-button ${active ? "is-active" : ""}`} key={key} disabled={key < todayKey} onClick={() => selectDay(date)}><span>{date.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "")}</span><strong>{date.getDate()}</strong><small>{date.toLocaleDateString("es-ES", { month: "short" }).replace(".", "")}</small></button>; })}</div>
          <div className="availability-heading"><div><span>Horarios de {selectedProfessional.name}</span><strong>{selectedDateLabel}</strong></div><span className="availability-note">Horarios pasados, citas ocupadas y bloqueos internos no se pueden seleccionar</span></div>
          <div className="slot-grid">{timeSlots.map((time) => { const occupied = occupiedTimes.has(time); const blocked = blockedTimes.has(time); const past = !!selectedDate && isPastSlot(selectedDate, time); const active = selectedTime === time; return <button key={time} type="button" className={`slot-button ${active ? "is-active" : ""}`} disabled={occupied || blocked || past} aria-pressed={active} onClick={() => { setSelectedTime(time); setConfirmedAppointment(null); }}>{time}<span>{past ? "Pasado" : blocked ? "Bloqueado" : occupied ? "Ocupado" : active ? "Elegido" : "Disponible"}</span></button>; })}</div>
        </>}
      </section>

      <section className="booking-card details-card" aria-labelledby="details-title">
        <div className="step-heading"><span className="step-number">03</span><div><p className="overline">Tus datos</p><h2 id="details-title">Confirma tu visita</h2></div></div>
        <div className="booking-summary"><div><span>Servicio</span><strong>{selectedService.title}</strong></div><div><span>Profesional</span><strong>{selectedProfessional.name}</strong></div><div><span>Fecha</span><strong>{selectedDateLabel}</strong></div><div><span>Hora</span><strong>{selectedTime || "Por elegir"}</strong></div></div>
        <form className="booking-form" onSubmit={submitBooking}><div className="form-grid"><label><span>Nombre y apellidos</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ej. Andrea Mejía" autoComplete="name" /></label><label><span>Teléfono</span><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Ej. +504 9999 9999" inputMode="tel" autoComplete="tel" /></label><label><span>Correo electrónico</span><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nombre@correo.com" type="email" autoComplete="email" /></label><label className="form-wide"><span>Nota breve <small>opcional</small></span><textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Cuéntanos qué necesitas revisar." rows={3} /></label></div>{formError && <p className="form-error" role="alert">{formError}</p>}<button className="primary-button booking-submit" type="submit" disabled={!selectedTime}>Confirmar reserva</button><p className="demo-hint">Demo: la cita se guarda únicamente en este navegador. No se envía ningún correo ni WhatsApp real.</p></form>
      </section>

      {confirmedAppointment && <section className="confirmation-card" id="confirmation" aria-live="polite"><span className="confirmation-icon">✓</span><p className="overline">Reserva confirmada</p><h2>Tu visita ya está en la agenda.</h2><p>Guarda este código para consultar, cancelar o reprogramar tu cita.</p><div className="reservation-code">{confirmedAppointment.code}</div><div className="confirmation-details"><span>{selectedService.title}</span><strong>{selectedDateLabel} · {confirmedAppointment.time}</strong><span>{selectedProfessional.name}</span></div><div className="confirmation-actions"><a className="secondary-button" href={`/gestionar?codigo=${encodeURIComponent(confirmedAppointment.code)}`}>Gestionar esta reserva</a><button type="button" className="secondary-button" onClick={startNewBooking}>Hacer otra reserva</button></div></section>}

      <section className="trust-strip"><div><strong>Reserva rápida</strong><span>Servicio, profesional, horario y datos mínimos.</span></div><div><strong>Agenda coordinada</strong><span>Las citas y bloqueos internos actualizan la disponibilidad.</span></div><div><strong>Demo persistente</strong><span>Las citas creadas permanecen tras recargar el navegador.</span></div></section>
    </main>
  );
}
