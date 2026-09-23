"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import styles from "./manage.module.css";

const APPOINTMENTS_KEY = "paisajismo-demo-appointments";
const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const services = {
  diagnostico: "Visita de diagnóstico a terreno",
  botanico: "Consultoría de diseño botánico",
  riego: "Supervisión de riego y siembra",
} as const;

const professionals = {
  lucia: "Lucía Herrera",
  mateo: "Mateo Rivas",
  ines: "Inés Valverde",
} as const;

type DemoAppointment = {
  id: string;
  code: string;
  clientName: string;
  email?: string;
  phone?: string;
  note?: string;
  serviceId: keyof typeof services;
  professionalId: keyof typeof professionals;
  date: string;
  time: string;
  status: "confirmado" | "pendiente" | "ausente" | "cancelado";
  createdAt?: string;
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromDateKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfWeek(date: Date) {
  const start = new Date(date);
  const day = start.getDay();
  const difference = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + difference);
  start.setHours(0, 0, 0, 0);
  return start;
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
  const [code, setCode] = useState("");
  const [managedId, setManagedId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reprogramming, setReprogramming] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [todayKey, setTodayKey] = useState("");

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setTodayKey(toDateKey(today));

    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      try {
        setAppointments(JSON.parse(stored) as DemoAppointment[]);
        return;
      } catch {}
    }

    const initial = createDemoAppointments(startOfWeek(today));
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(initial));
    setAppointments(initial);
  }, []);

  const managed = useMemo(
    () => appointments.find((appointment) => appointment.id === managedId) ?? null,
    [appointments, managedId],
  );

  const availableDays = useMemo(() => {
    if (!todayKey) return [];
    const today = fromDateKey(todayKey);
    return Array.from({ length: 18 }, (_, index) => addDays(today, index))
      .filter((date) => date.getDay() !== 0)
      .slice(0, 12);
  }, [todayKey]);

  const occupiedTimes = useMemo(() => {
    if (!managed || !newDate) return new Set<string>();
    return new Set(
      appointments
        .filter(
          (appointment) =>
            appointment.id !== managed.id &&
            appointment.professionalId === managed.professionalId &&
            appointment.date === newDate &&
            appointment.status !== "cancelado",
        )
        .map((appointment) => appointment.time),
    );
  }, [appointments, managed, newDate]);

  function persist(next: DemoAppointment[]) {
    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(next));
    setAppointments(next);
  }

  function findBooking(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setReprogramming(false);
    setNewDate("");
    setNewTime("");

    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError("Introduce el código de reserva.");
      return;
    }

    let latest = appointments;
    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      try { latest = JSON.parse(stored) as DemoAppointment[]; } catch {}
    }
    setAppointments(latest);

    const found = latest.find((appointment) => appointment.code.toUpperCase() === normalized);
    if (!found) {
      setManagedId("");
      setError("No hemos encontrado una reserva con ese código en esta demo.");
      return;
    }

    setManagedId(found.id);
  }

  function cancelBooking() {
    if (!managed || managed.status === "cancelado") return;
    const next = appointments.map((appointment) =>
      appointment.id === managed.id ? { ...appointment, status: "cancelado" as const } : appointment,
    );
    persist(next);
    setReprogramming(false);
    setMessage("Reserva cancelada. El horario anterior ya vuelve a estar disponible.");
  }

  function startReprogramming() {
    if (!managed || managed.status === "cancelado") return;
    setError("");
    setMessage("");
    setNewDate(managed.date >= todayKey ? managed.date : todayKey);
    setNewTime(managed.time);
    setReprogramming(true);
  }

  function saveReprogramming() {
    if (!managed || !newDate || !newTime) {
      setError("Selecciona una nueva fecha y hora.");
      return;
    }

    let latest = appointments;
    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      try { latest = JSON.parse(stored) as DemoAppointment[]; } catch {}
    }

    const conflict = latest.some(
      (appointment) =>
        appointment.id !== managed.id &&
        appointment.professionalId === managed.professionalId &&
        appointment.date === newDate &&
        appointment.time === newTime &&
        appointment.status !== "cancelado",
    );

    if (conflict) {
      setAppointments(latest);
      setNewTime("");
      setError("Ese horario ya está ocupado. Elige otro turno disponible.");
      return;
    }

    const next = latest.map((appointment) =>
      appointment.id === managed.id
        ? { ...appointment, date: newDate, time: newTime, status: "confirmado" as const }
        : appointment,
    );

    persist(next);
    setError("");
    setMessage("Reserva reprogramada. El hueco anterior se ha liberado automáticamente.");
    setReprogramming(false);
  }

  const dateLabel = managed
    ? fromDateKey(managed.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="/">
          <span className={styles.mark}>P</span>
          <span><strong>Estudio Paisaje</strong><span>Agenda de visitas y consultoría</span></span>
        </a>
        <a className={styles.back} href="/">← Volver a reservar</a>
      </header>

      <section className={styles.hero}>
        <p className={styles.kicker}>Gestionar turno</p>
        <h1>Tu cita, bajo control.</h1>
        <p className={styles.heroText}>Introduce tu código de reserva para consultar la cita, cambiar el horario o cancelarla. En esta demo todos los cambios se guardan en este navegador.</p>
      </section>

      <section className={styles.card}>
        <h2>Busca tu reserva</h2>
        <p className={styles.cardIntro}>Usa el código que aparece después de confirmar una reserva. Para una prueba rápida también puedes utilizar <strong>DEMO01</strong>.</p>
        <form className={styles.searchForm} onSubmit={findBooking}>
          <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Ej. PAIS-ABC123" aria-label="Código de reserva" />
          <button className={styles.primary} type="submit">Buscar reserva</button>
        </form>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {message && <p className={styles.success} role="status">{message}</p>}
        <p className={styles.hint}>Los cambios realizados aquí actualizan la disponibilidad pública de la demo de forma inmediata.</p>
      </section>

      {managed && (
        <section className={styles.appointment} aria-live="polite">
          <div className={styles.appointmentTop}>
            <div>
              <p className={styles.code}>{managed.code}</p>
              <h2>{managed.clientName}</h2>
            </div>
            <span className={`${styles.status} ${managed.status === "cancelado" ? styles.statusCancelled : ""}`}>{managed.status}</span>
          </div>

          <div className={styles.details}>
            <div className={styles.detail}><span>Servicio</span><strong>{services[managed.serviceId]}</strong></div>
            <div className={styles.detail}><span>Profesional</span><strong>{professionals[managed.professionalId]}</strong></div>
            <div className={styles.detail}><span>Fecha</span><strong>{dateLabel}</strong></div>
            <div className={styles.detail}><span>Hora</span><strong>{managed.time}</strong></div>
          </div>

          {managed.status !== "cancelado" && (
            <div className={styles.actions}>
              <button className={styles.secondary} type="button" onClick={startReprogramming}>Reprogramar cita</button>
              <button className={styles.danger} type="button" onClick={cancelBooking}>Cancelar cita</button>
            </div>
          )}

          {reprogramming && managed.status !== "cancelado" && (
            <div className={styles.reschedule}>
              <h3>Elige un nuevo horario</h3>
              <p>Al guardar el cambio, el hueco anterior queda libre inmediatamente.</p>

              <div className={styles.days} aria-label="Fechas para reprogramar">
                {availableDays.map((date) => {
                  const key = toDateKey(date);
                  const active = key === newDate;
                  return (
                    <button key={key} type="button" className={`${styles.day} ${active ? styles.dayActive : ""}`} onClick={() => { setNewDate(key); setNewTime(""); setError(""); }}>
                      <span>{date.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "")}</span>
                      <strong>{date.getDate()}</strong>
                      <small>{date.toLocaleDateString("es-ES", { month: "short" }).replace(".", "")}</small>
                    </button>
                  );
                })}
              </div>

              <div className={styles.slots}>
                {timeSlots.map((time) => {
                  const occupied = occupiedTimes.has(time);
                  const active = newTime === time;
                  return (
                    <button key={time} type="button" disabled={occupied} className={`${styles.slot} ${active ? styles.slotActive : ""}`} onClick={() => { setNewTime(time); setError(""); }}>
                      <strong>{time}</strong>
                      <span>{occupied ? "Ocupado" : active ? "Elegido" : "Disponible"}</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.rescheduleActions}>
                <button className={styles.primary} type="button" onClick={saveReprogramming} disabled={!newDate || !newTime}>Guardar nuevo horario</button>
                <button className={styles.secondary} type="button" onClick={() => { setReprogramming(false); setError(""); }}>Cancelar cambio</button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
