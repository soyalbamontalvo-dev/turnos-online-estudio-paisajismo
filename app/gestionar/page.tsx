"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./manage.module.css";

const APPOINTMENTS_KEY = "paisajismo-demo-appointments";
const BLOCKS_KEY = "paisajismo-demo-blocks";
const STUDIO_TIME_ZONE = "America/Tegucigalpa";
const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const services = {
  diagnostico: "Visita de diagnóstico a terreno",
  botanico: "Consultoría de diseño botánico",
  riego: "Supervisión de riego y siembra",
} as const;
const professionals = { lucia: "Lucía Herrera", mateo: "Mateo Rivas", ines: "Inés Valverde" } as const;

type DemoAppointment = {
  id: string; code: string; clientName: string; email?: string; phone?: string; note?: string;
  serviceId: keyof typeof services; professionalId: keyof typeof professionals; date: string; time: string;
  status: "confirmado" | "pendiente" | "ausente" | "cancelado"; createdAt?: string;
};
type AvailabilityBlock = { id: string; professionalId: keyof typeof professionals; date: string; time: string; reason: string; createdAt?: string };

function toDateKey(date: Date) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function fromDateKey(key: string) { const [year, month, day] = key.split("-").map(Number); return new Date(year, month - 1, day); }
function addDays(date: Date, amount: number) { const next = new Date(date); next.setDate(next.getDate() + amount); return next; }
function startOfWeek(date: Date) { const start = new Date(date); const day = start.getDay(); start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day)); start.setHours(0, 0, 0, 0); return start; }
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

export default function ManageBookingPage() {
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [code, setCode] = useState("");
  const [managedId, setManagedId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reprogramming, setReprogramming] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [todayKey, setTodayKey] = useState("");

  useEffect(() => {
    const studioNow = getStudioNow();
    const today = fromDateKey(studioNow.dateKey);
    setTodayKey(studioNow.dateKey);

    let initialAppointments: DemoAppointment[];
    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      try {
        initialAppointments = JSON.parse(stored) as DemoAppointment[];
      } catch {
        initialAppointments = createDemoAppointments(startOfWeek(today));
        window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(initialAppointments));
      }
    } else {
      initialAppointments = createDemoAppointments(startOfWeek(today));
      window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(initialAppointments));
    }
    setAppointments(initialAppointments);

    try { setBlocks(JSON.parse(window.localStorage.getItem(BLOCKS_KEY) || "[]") as AvailabilityBlock[]); }
    catch { window.localStorage.removeItem(BLOCKS_KEY); setBlocks([]); }

    const directCode = new URLSearchParams(window.location.search).get("codigo")?.trim().toUpperCase() || "";
    if (directCode) {
      setCode(directCode);
      const directBooking = initialAppointments.find((appointment) => appointment.code.toUpperCase() === directCode);
      if (directBooking) setManagedId(directBooking.id);
      else setError("No hemos encontrado una reserva con ese código en esta demo.");
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === APPOINTMENTS_KEY && event.newValue) { try { setAppointments(JSON.parse(event.newValue) as DemoAppointment[]); } catch {} }
      if (event.key === BLOCKS_KEY) { try { setBlocks(event.newValue ? JSON.parse(event.newValue) as AvailabilityBlock[] : []); } catch {} }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const managed = useMemo(() => appointments.find((appointment) => appointment.id === managedId) ?? null, [appointments, managedId]);
  const availableDays = useMemo(() => {
    if (!todayKey) return [];
    return Array.from({ length: 35 }, (_, index) => addDays(fromDateKey(todayKey), index)).filter((date) => date.getDay() !== 0).slice(0, 30);
  }, [todayKey]);
  const appointmentTimes = useMemo(() => {
    if (!managed || !newDate) return new Set<string>();
    return new Set(appointments.filter((a) => a.id !== managed.id && a.professionalId === managed.professionalId && a.date === newDate && a.status !== "cancelado").map((a) => a.time));
  }, [appointments, managed, newDate]);
  const blockedTimes = useMemo(() => {
    if (!managed || !newDate) return new Set<string>();
    return new Set(blocks.filter((b) => b.professionalId === managed.professionalId && b.date === newDate).map((b) => b.time));
  }, [blocks, managed, newDate]);

  function persist(next: DemoAppointment[]) { window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(next)); setAppointments(next); }

  function findBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setMessage(""); setReprogramming(false); setConfirmingCancel(false); setNewDate(""); setNewTime("");
    const normalized = code.trim().toUpperCase();
    if (!normalized) return setError("Introduce el código de reserva.");
    let latest = appointments;
    try { latest = JSON.parse(window.localStorage.getItem(APPOINTMENTS_KEY) || "[]") as DemoAppointment[]; } catch {}
    setAppointments(latest);
    const found = latest.find((appointment) => appointment.code.toUpperCase() === normalized);
    if (!found) { setManagedId(""); return setError("No hemos encontrado una reserva con ese código en esta demo."); }
    setManagedId(found.id);
  }

  function requestCancellation() {
    if (!managed || managed.status === "cancelado") return;
    setError(""); setMessage(""); setReprogramming(false); setConfirmingCancel(true);
  }

  function cancelBooking() {
    if (!managed || managed.status === "cancelado") return;
    let latest = appointments;
    try { latest = JSON.parse(window.localStorage.getItem(APPOINTMENTS_KEY) || "[]") as DemoAppointment[]; } catch {}
    const next = latest.map((a) => a.id === managed.id ? { ...a, status: "cancelado" as const } : a);
    persist(next);
    setConfirmingCancel(false);
    setMessage("Reserva cancelada. El horario anterior ya vuelve a estar disponible.");
  }

  function startReprogramming() {
    if (!managed || managed.status === "cancelado") return;
    setError(""); setMessage(""); setConfirmingCancel(false);
    const initialDate = managed.date >= todayKey ? managed.date : todayKey;
    const initialTime = managed.date >= todayKey && !isPastSlot(managed.date, managed.time) ? managed.time : "";
    setNewDate(initialDate);
    setNewTime(initialTime);
    setReprogramming(true);
  }

  function saveReprogramming() {
    if (!managed || !newDate || !newTime) return setError("Selecciona una nueva fecha y hora.");
    if (isPastSlot(newDate, newTime)) { setNewTime(""); return setError("Ese horario ya ha pasado en Tegucigalpa. Elige otro turno disponible."); }
    if (newDate === managed.date && newTime === managed.time) return setError("Elige una fecha u hora diferente para reprogramar la cita.");

    let latest = appointments; let latestBlocks = blocks;
    try { latest = JSON.parse(window.localStorage.getItem(APPOINTMENTS_KEY) || "[]") as DemoAppointment[]; } catch {}
    try { latestBlocks = JSON.parse(window.localStorage.getItem(BLOCKS_KEY) || "[]") as AvailabilityBlock[]; } catch {}
    const conflict = latest.some((a) => a.id !== managed.id && a.professionalId === managed.professionalId && a.date === newDate && a.time === newTime && a.status !== "cancelado");
    const blocked = latestBlocks.some((b) => b.professionalId === managed.professionalId && b.date === newDate && b.time === newTime);
    if (conflict || blocked) {
      setAppointments(latest); setBlocks(latestBlocks); setNewTime("");
      return setError(blocked ? "Ese horario está bloqueado por el estudio. Elige otro turno disponible." : "Ese horario ya está ocupado. Elige otro turno disponible.");
    }
    const next = latest.map((a) => a.id === managed.id ? { ...a, date: newDate, time: newTime, status: "confirmado" as const } : a);
    persist(next);
    setError(""); setMessage("Reserva reprogramada. El hueco anterior se ha liberado automáticamente."); setReprogramming(false);
  }

  const dateLabel = managed ? fromDateKey(managed.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) : "";
  const unchangedSchedule = !!managed && newDate === managed.date && newTime === managed.time;

  return (
    <main className={styles.shell}>
      <header className={styles.header}><a className={styles.brand} href="/"><span className={styles.mark}>P</span><span><strong>Estudio Paisaje</strong><span>Agenda de visitas y consultoría</span></span></a><a className={styles.back} href="/">← Volver a reservar</a></header>
      <section className={styles.hero}><p className={styles.kicker}>Gestionar turno</p><h1>Tu cita, bajo control.</h1><p className={styles.heroText}>Introduce tu código de reserva para consultar la cita, cambiar el horario o cancelarla. Los bloqueos internos del estudio también se respetan al reprogramar.</p></section>
      <section className={styles.card}><h2>Busca tu reserva</h2><p className={styles.cardIntro}>Usa el código generado al confirmar una reserva. Para una prueba rápida puedes utilizar <strong>DEMO01</strong>.</p><form className={styles.searchForm} onSubmit={findBooking}><input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej. PAIS-ABC123" aria-label="Código de reserva" autoCapitalize="characters" /><button className={styles.primary} type="submit">Buscar reserva</button></form>{error && <p className={styles.error} role="alert">{error}</p>}{message && <p className={styles.success} role="status">{message}</p>}<p className={styles.hint}>Los cambios actualizan la disponibilidad pública de la demo de forma inmediata.</p></section>

      {managed && <section className={styles.appointment} aria-live="polite">
        <div className={styles.appointmentTop}><div><p className={styles.code}>{managed.code}</p><h2>{managed.clientName}</h2></div><span className={`${styles.status} ${managed.status === "cancelado" ? styles.statusCancelled : ""}`}>{managed.status}</span></div>
        <div className={styles.details}><div className={styles.detail}><span>Servicio</span><strong>{services[managed.serviceId]}</strong></div><div className={styles.detail}><span>Profesional</span><strong>{professionals[managed.professionalId]}</strong></div><div className={styles.detail}><span>Fecha</span><strong>{dateLabel}</strong></div><div className={styles.detail}><span>Hora</span><strong>{managed.time}</strong></div></div>
        {managed.status !== "cancelado" && <div className={styles.actions}><button className={styles.secondary} type="button" onClick={startReprogramming}>Reprogramar cita</button><button className={styles.danger} type="button" onClick={requestCancellation}>Cancelar cita</button></div>}

        {confirmingCancel && managed.status !== "cancelado" && <div className={styles.cancelConfirm} role="alertdialog" aria-label="Confirmar cancelación"><p><strong>¿Cancelar esta cita?</strong><br />El horario quedará libre inmediatamente para otra reserva.</p><div className={styles.cancelConfirmActions}><button className={styles.danger} type="button" onClick={cancelBooking}>Sí, cancelar cita</button><button className={styles.secondary} type="button" onClick={() => setConfirmingCancel(false)}>No, mantener cita</button></div></div>}

        {reprogramming && managed.status !== "cancelado" && <div className={styles.reschedule}><h3>Elige un nuevo horario</h3><p>Los horarios pasados, ocupados o bloqueados por el estudio no están disponibles.</p><div className={styles.days}>{availableDays.map((date) => { const key = toDateKey(date); return <button key={key} type="button" className={`${styles.day} ${key === newDate ? styles.dayActive : ""}`} onClick={() => { setNewDate(key); setNewTime(""); setError(""); }}><span>{date.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "")}</span><strong>{date.getDate()}</strong><small>{date.toLocaleDateString("es-ES", { month: "short" }).replace(".", "")}</small></button>; })}</div><div className={styles.slots}>{timeSlots.map((time) => { const occupied = appointmentTimes.has(time); const blocked = blockedTimes.has(time); const past = !!newDate && isPastSlot(newDate, time); const active = newTime === time; return <button key={time} type="button" disabled={occupied || blocked || past} className={`${styles.slot} ${active ? styles.slotActive : ""}`} onClick={() => { setNewTime(time); setError(""); }}><strong>{time}</strong><span>{past ? "Pasado" : blocked ? "Bloqueado" : occupied ? "Ocupado" : active ? "Elegido" : "Disponible"}</span></button>; })}</div><div className={styles.rescheduleActions}><button className={styles.primary} type="button" onClick={saveReprogramming} disabled={!newDate || !newTime || unchangedSchedule}>Guardar nuevo horario</button><button className={styles.secondary} type="button" onClick={() => { setReprogramming(false); setError(""); }}>Cancelar cambio</button></div></div>}
      </section>}
    </main>
  );
}
