"use client";

import { useEffect, useMemo, useState } from "react";

const services = [
  {
    id: "diagnostico",
    title: "Visita de diagnóstico a terreno",
    description: "Primera revisión del espacio, orientación técnica y prioridades de intervención.",
    duration: "60 min",
  },
  {
    id: "botanico",
    title: "Consultoría de diseño botánico",
    description: "Selección vegetal, composición y criterios de mantenimiento adaptados al proyecto.",
    duration: "75 min",
  },
  {
    id: "riego",
    title: "Supervisión de riego y siembra",
    description: "Revisión técnica de implantación, riego y condiciones para una ejecución correcta.",
    duration: "45 min",
  },
];

const professionals = [
  { id: "lucia", name: "Lucía Herrera", role: "Arquitecta paisajista" },
  { id: "mateo", name: "Mateo Rivas", role: "Especialista en diseño botánico" },
  { id: "ines", name: "Inés Valverde", role: "Coordinadora de obra verde" },
];

const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

const STORAGE_KEY = "paisajismo-booking-draft";
const APPOINTMENTS_KEY = "paisajismo-demo-appointments";

type Draft = {
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
};

type DemoAppointment = {
  id: string;
  clientName: string;
  serviceId: string;
  professionalId: string;
  date: string;
  time: string;
  status: "confirmado" | "pendiente";
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
    {
      id: "demo-01",
      clientName: "Camila Paredes",
      serviceId: "diagnostico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 2)),
      time: "10:30",
      status: "confirmado",
    },
    {
      id: "demo-02",
      clientName: "Esteban Mejía",
      serviceId: "botanico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 3)),
      time: "14:00",
      status: "confirmado",
    },
    {
      id: "demo-03",
      clientName: "Valeria Durón",
      serviceId: "riego",
      professionalId: "mateo",
      date: toDateKey(addDays(monday, 2)),
      time: "12:00",
      status: "pendiente",
    },
    {
      id: "demo-04",
      clientName: "Nicolás Ferrera",
      serviceId: "diagnostico",
      professionalId: "mateo",
      date: toDateKey(addDays(monday, 4)),
      time: "15:30",
      status: "confirmado",
    },
    {
      id: "demo-05",
      clientName: "Mariana Zelaya",
      serviceId: "riego",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 3)),
      time: "09:00",
      status: "confirmado",
    },
    {
      id: "demo-06",
      clientName: "Jorge Lanza",
      serviceId: "botanico",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 4)),
      time: "10:30",
      status: "pendiente",
    },
    {
      id: "demo-07",
      clientName: "Paola Rivera",
      serviceId: "diagnostico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 7)),
      time: "09:00",
      status: "confirmado",
    },
  ];
}

export default function HomePage() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [professionalId, setProfessionalId] = useState(professionals[0].id);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [weekOffset, setWeekOffset] = useState(0);
  const [todayKey, setTodayKey] = useState("");
  const [baseMondayKey, setBaseMondayKey] = useState("");
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = startOfWeek(today);
    const currentTodayKey = toDateKey(today);
    const currentMondayKey = toDateKey(monday);

    setTodayKey(currentTodayKey);
    setBaseMondayKey(currentMondayKey);

    let demoAppointments = createDemoAppointments(monday);
    const storedAppointments = window.localStorage.getItem(APPOINTMENTS_KEY);

    if (storedAppointments) {
      try {
        demoAppointments = JSON.parse(storedAppointments) as DemoAppointment[];
      } catch {
        window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(demoAppointments));
      }
    } else {
      window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(demoAppointments));
    }

    setAppointments(demoAppointments);

    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as Partial<Draft>;
        if (draft.serviceId && services.some((item) => item.id === draft.serviceId)) {
          setServiceId(draft.serviceId);
        }
        if (
          draft.professionalId &&
          professionals.some((item) => item.id === draft.professionalId)
        ) {
          setProfessionalId(draft.professionalId);
        }
        if (draft.date && draft.date >= currentTodayKey) {
          const draftDate = fromDateKey(draft.date);
          const diffDays = Math.round(
            (draftDate.getTime() - monday.getTime()) / (1000 * 60 * 60 * 24),
          );
          const draftWeekOffset = Math.max(0, Math.floor(diffDays / 7));
          if (draftWeekOffset <= 4) {
            setWeekOffset(draftWeekOffset);
            setSelectedDate(draft.date);
            if (draft.time && timeSlots.includes(draft.time)) {
              setSelectedTime(draft.time);
            }
          }
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setReady(true);
  }, []);

  const weekStart = useMemo(() => {
    if (!baseMondayKey) return null;
    return addDays(fromDateKey(baseMondayKey), weekOffset * 7);
  }, [baseMondayKey, weekOffset]);

  const weekDays = useMemo(() => {
    if (!weekStart) return [];
    return Array.from({ length: 6 }, (_, index) => addDays(weekStart, index));
  }, [weekStart]);

  useEffect(() => {
    if (!ready || !weekStart || selectedDate) return;

    const firstAvailableDay = weekDays.find((date) => toDateKey(date) >= todayKey);
    if (firstAvailableDay) {
      setSelectedDate(toDateKey(firstAvailableDay));
      return;
    }

    const nextWeek = addDays(weekStart, 7);
    setWeekOffset((current) => current + 1);
    setSelectedDate(toDateKey(nextWeek));
  }, [ready, selectedDate, todayKey, weekDays, weekStart]);

  const selectedService = useMemo(
    () => services.find((item) => item.id === serviceId) ?? services[0],
    [serviceId],
  );

  const selectedProfessional = useMemo(
    () => professionals.find((item) => item.id === professionalId) ?? professionals[0],
    [professionalId],
  );

  const occupiedTimes = useMemo(() => {
    if (!selectedDate) return new Set<string>();
    return new Set(
      appointments
        .filter(
          (appointment) =>
            appointment.professionalId === professionalId &&
            appointment.date === selectedDate,
        )
        .map((appointment) => appointment.time),
    );
  }, [appointments, professionalId, selectedDate]);

  useEffect(() => {
    if (selectedTime && occupiedTimes.has(selectedTime)) {
      setSelectedTime("");
    }
  }, [occupiedTimes, selectedTime]);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ serviceId, professionalId, date: selectedDate, time: selectedTime } satisfies Draft),
    );
  }, [serviceId, professionalId, selectedDate, selectedTime, ready]);

  const weekLabel = useMemo(() => {
    if (!weekStart) return "";
    const end = addDays(weekStart, 5);
    const startLabel = weekStart.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    const endLabel = end.toLocaleDateString("es-ES", { day: "numeric", month: "short" });
    return `${startLabel} — ${endLabel}`;
  }, [weekStart]);

  function changeWeek(direction: -1 | 1) {
    const nextOffset = Math.min(4, Math.max(0, weekOffset + direction));
    if (nextOffset === weekOffset || !baseMondayKey) return;

    const nextWeekStart = addDays(fromDateKey(baseMondayKey), nextOffset * 7);
    const candidates = Array.from({ length: 6 }, (_, index) => addDays(nextWeekStart, index));
    const firstAvailable = candidates.find((date) => toDateKey(date) >= todayKey) ?? candidates[0];

    setWeekOffset(nextOffset);
    setSelectedDate(toDateKey(firstAvailable));
    setSelectedTime("");
  }

  function selectDay(date: Date) {
    const key = toDateKey(date);
    if (key < todayKey) return;
    setSelectedDate(key);
    setSelectedTime("");
  }

  const selectedDateLabel = selectedDate
    ? fromDateKey(selectedDate).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "Selecciona un día";

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true">P</div>
        <div>
          <p className="brand-name">Estudio Paisaje</p>
          <p className="brand-subtitle">Agenda de visitas y consultoría</p>
        </div>
        <button className="ghost-button" type="button">Gestionar turno</button>
      </header>

      <section className="hero">
        <p className="eyebrow">Reserva online</p>
        <h1>Encuentra un horario para avanzar con tu espacio exterior.</h1>
        <p className="hero-copy">
          Elige el tipo de atención, el profesional y un horario disponible. La demo conserva tu selección en este navegador.
        </p>
      </section>

      <section className="booking-card" aria-labelledby="booking-title">
        <div className="step-heading">
          <span className="step-number">01</span>
          <div>
            <p className="overline">Primer paso</p>
            <h2 id="booking-title">¿Qué necesitas?</h2>
          </div>
        </div>

        <div className="service-grid">
          {services.map((service) => {
            const active = service.id === serviceId;
            return (
              <button
                className={`service-card ${active ? "is-active" : ""}`}
                key={service.id}
                type="button"
                aria-pressed={active}
                onClick={() => setServiceId(service.id)}
              >
                <div className="service-card-topline">
                  <span>{service.duration}</span>
                  <span className="selection-dot" aria-hidden="true" />
                </div>
                <strong>{service.title}</strong>
                <span>{service.description}</span>
              </button>
            );
          })}
        </div>

        <div className="field-block">
          <label htmlFor="professional">Profesional</label>
          <select
            id="professional"
            value={professionalId}
            onChange={(event) => {
              setProfessionalId(event.target.value);
              setSelectedTime("");
            }}
          >
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name} · {professional.role}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="booking-card calendar-card" aria-labelledby="calendar-title">
        <div className="step-heading calendar-heading">
          <span className="step-number">02</span>
          <div>
            <p className="overline">Disponibilidad</p>
            <h2 id="calendar-title">Elige día y hora</h2>
          </div>
        </div>

        {!ready || !weekStart ? (
          <div className="calendar-loading">Preparando disponibilidad de la agenda…</div>
        ) : (
          <>
            <div className="week-toolbar" aria-label="Navegación semanal">
              <button
                type="button"
                className="week-nav-button"
                onClick={() => changeWeek(-1)}
                disabled={weekOffset === 0}
                aria-label="Semana anterior"
              >
                ←
              </button>
              <div>
                <span>Semana</span>
                <strong>{weekLabel}</strong>
              </div>
              <button
                type="button"
                className="week-nav-button"
                onClick={() => changeWeek(1)}
                disabled={weekOffset === 4}
                aria-label="Semana siguiente"
              >
                →
              </button>
            </div>

            <div className="day-strip" aria-label="Días disponibles">
              {weekDays.map((date) => {
                const key = toDateKey(date);
                const isPast = key < todayKey;
                const active = key === selectedDate;
                return (
                  <button
                    type="button"
                    className={`day-button ${active ? "is-active" : ""}`}
                    key={key}
                    disabled={isPast}
                    aria-pressed={active}
                    onClick={() => selectDay(date)}
                  >
                    <span>{date.toLocaleDateString("es-ES", { weekday: "short" }).replace(".", "")}</span>
                    <strong>{date.getDate()}</strong>
                    <small>{date.toLocaleDateString("es-ES", { month: "short" }).replace(".", "")}</small>
                  </button>
                );
              })}
            </div>

            <div className="availability-head">
              <div>
                <span className="summary-label dark-label">Horarios de {selectedProfessional.name}</span>
                <strong>{selectedDateLabel}</strong>
              </div>
              <div className="availability-legend" aria-label="Leyenda de disponibilidad">
                <span><i className="legend-dot available" />Disponible</span>
                <span><i className="legend-dot occupied" />Ocupado</span>
              </div>
            </div>

            <div className="time-grid" aria-label="Horarios">
              {timeSlots.map((time) => {
                const occupied = occupiedTimes.has(time);
                const active = selectedTime === time;
                return (
                  <button
                    type="button"
                    className={`time-button ${active ? "is-active" : ""}`}
                    key={time}
                    disabled={occupied}
                    aria-pressed={active}
                    onClick={() => setSelectedTime(time)}
                  >
                    <strong>{time}</strong>
                    <span>{occupied ? "Ocupado" : active ? "Seleccionado" : "Disponible"}</span>
                  </button>
                );
              })}
            </div>

            <div className={`selection-summary ${selectedTime ? "is-complete" : ""}`}>
              <div>
                <span className="summary-label">Tu selección</span>
                <strong>{selectedService.title}</strong>
                <span>{selectedProfessional.name}</span>
                <span className="summary-date">
                  {selectedTime ? `${selectedDateLabel} · ${selectedTime}` : "Selecciona un horario disponible"}
                </span>
              </div>
              <span className="selection-status">
                {selectedTime ? "Horario listo" : "Falta elegir hora"}
              </span>
            </div>
          </>
        )}
      </section>

      <section className="trust-strip" aria-label="Información de la reserva">
        <div>
          <strong>Disponibilidad clara</strong>
          <span>Los horarios ya ocupados aparecen bloqueados en la demo.</span>
        </div>
        <div>
          <strong>Reserva flexible</strong>
          <span>Más adelante podrás reprogramar o cancelar con tu código de reserva.</span>
        </div>
        <div>
          <strong>Datos de demostración</strong>
          <span>Servicios, agenda y selección funcionan íntegramente en este navegador.</span>
        </div>
      </section>
    </main>
  );
}
