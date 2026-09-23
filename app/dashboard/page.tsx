"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css";

const APPOINTMENTS_KEY = "paisajismo-demo-appointments";

const services = {
  diagnostico: "Visita de diagnóstico a terreno",
  botanico: "Consultoría de diseño botánico",
  riego: "Supervisión de riego y siembra",
} as const;

const professionals = [
  {
    id: "lucia",
    name: "Lucía Herrera",
    role: "Arquitecta paisajista",
    specialty: "Diagnóstico de sitio, lectura del terreno y estrategia de implantación.",
    photo: "https://images.unsplash.com/photo-1747671688812-76d7bca21f34?auto=format&fit=crop&w=900&q=82",
    credit: "Arturo Añez · Unsplash",
  },
  {
    id: "mateo",
    name: "Mateo Rivas",
    role: "Especialista en diseño botánico",
    specialty: "Paletas vegetales, especies adaptadas al clima y composición estacional.",
    photo: "https://images.unsplash.com/photo-1772450236019-7b1c970b57ad?auto=format&fit=crop&w=900&q=82",
    credit: "Rodrigo Rodrigues · Unsplash",
  },
  {
    id: "ines",
    name: "Inés Valverde",
    role: "Coordinadora de obra verde",
    specialty: "Supervisión de riego, siembra y puesta en marcha de jardines.",
    photo: "https://images.unsplash.com/photo-1758207573678-aecc46b2a64a?auto=format&fit=crop&w=900&q=82",
    credit: "Elist Nguyen · Unsplash",
  },
] as const;

type Status = "confirmado" | "pendiente" | "ausente" | "cancelado";

type DemoAppointment = {
  id: string;
  code: string;
  clientName: string;
  email?: string;
  phone?: string;
  note?: string;
  serviceId: keyof typeof services;
  professionalId: "lucia" | "mateo" | "ines";
  date: string;
  time: string;
  status: Status;
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

function createRichSeed(monday: Date): DemoAppointment[] {
  return [
    {
      id: "demo-01",
      code: "DEMO01",
      clientName: "Camila Paredes",
      email: "camila.paredes@demo.hn",
      phone: "+504 9874 2130",
      serviceId: "diagnostico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 2)),
      time: "10:30",
      status: "confirmado",
      note: "Evaluación inicial de asoleamiento, drenaje y recorridos para jardín residencial en Lomas del Guijarro.",
    },
    {
      id: "demo-02",
      code: "DEMO02",
      clientName: "Esteban Mejía",
      email: "esteban.mejia@demo.hn",
      phone: "+504 9981 4052",
      serviceId: "botanico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 3)),
      time: "14:00",
      status: "confirmado",
      note: "Revisión de propuesta vegetal para patio sombreado con especies de bajo mantenimiento.",
    },
    {
      id: "demo-03",
      code: "DEMO03",
      clientName: "Valeria Durón",
      email: "valeria.duron@demo.hn",
      phone: "+504 9732 6621",
      serviceId: "riego",
      professionalId: "mateo",
      date: toDateKey(addDays(monday, 2)),
      time: "12:00",
      status: "pendiente",
      note: "Comprobación de cobertura de riego por goteo antes de iniciar la nueva plantación.",
    },
    {
      id: "demo-04",
      code: "DEMO04",
      clientName: "Nicolás Ferrera",
      email: "nicolas.ferrera@demo.hn",
      phone: "+504 9554 1187",
      serviceId: "diagnostico",
      professionalId: "mateo",
      date: toDateKey(addDays(monday, 4)),
      time: "15:30",
      status: "confirmado",
      note: "Diagnóstico de talud, escorrentía y selección preliminar de especies para estabilización vegetal.",
    },
    {
      id: "demo-05",
      code: "DEMO05",
      clientName: "Mariana Zelaya",
      email: "mariana.zelaya@demo.hn",
      phone: "+504 9905 7740",
      serviceId: "riego",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 3)),
      time: "09:00",
      status: "confirmado",
      note: "Supervisión de sectorización, presión y programación de riego en jardín recién ejecutado.",
    },
    {
      id: "demo-06",
      code: "DEMO06",
      clientName: "Jorge Lanza",
      email: "jorge.lanza@demo.hn",
      phone: "+504 9655 8204",
      serviceId: "botanico",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 4)),
      time: "10:30",
      status: "pendiente",
      note: "Selección de especies para una terraza expuesta a sol intenso y viento durante la tarde.",
    },
    {
      id: "demo-07",
      code: "DEMO07",
      clientName: "Paola Rivera",
      email: "paola.rivera@demo.hn",
      phone: "+504 9442 6003",
      serviceId: "diagnostico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 7)),
      time: "09:00",
      status: "confirmado",
      note: "Primera visita para reorganizar accesos, zona social y transición entre vivienda y jardín.",
    },
    {
      id: "demo-08",
      code: "DEMO08",
      clientName: "Sofía Andino",
      email: "sofia.andino@demo.hn",
      phone: "+504 9840 1135",
      serviceId: "botanico",
      professionalId: "mateo",
      date: toDateKey(monday),
      time: "14:00",
      status: "ausente",
      note: "Consultoría para sustituir césped de alto consumo por cobertura vegetal adaptada al clima local.",
    },
    {
      id: "demo-09",
      code: "DEMO09",
      clientName: "Andrés Cáceres",
      email: "andres.caceres@demo.hn",
      phone: "+504 9711 2498",
      serviceId: "riego",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 1)),
      time: "15:30",
      status: "cancelado",
      note: "Revisión de goteros obstruidos en zona de arbustos. Cita cancelada por el cliente.",
    },
  ];
}

function formatDate(key: string) {
  return fromDateKey(key).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<DemoAppointment[]>([]);
  const [professionalFilter, setProfessionalFilter] = useState("todos");
  const [todayKey, setTodayKey] = useState("");
  const [weekStartKey, setWeekStartKey] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = startOfWeek(today);
    const seed = createRichSeed(monday);
    let existing: DemoAppointment[] = [];

    const stored = window.localStorage.getItem(APPOINTMENTS_KEY);
    if (stored) {
      try {
        existing = JSON.parse(stored) as DemoAppointment[];
      } catch {
        existing = [];
      }
    }

    const seedById = new Map(seed.map((item) => [item.id, item]));
    const merged = existing.map((item) => {
      const richer = seedById.get(item.id);
      if (!richer) return item;
      return {
        ...richer,
        ...item,
        note: item.note || richer.note,
        email: item.email || richer.email,
        phone: item.phone || richer.phone,
      };
    });

    const existingIds = new Set(merged.map((item) => item.id));
    seed.forEach((item) => {
      if (!existingIds.has(item.id)) merged.push(item);
    });

    window.localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(merged));
    setAppointments(merged);
    setTodayKey(toDateKey(today));
    setWeekStartKey(toDateKey(monday));
    setReady(true);
  }, []);

  const weekEndKey = useMemo(() => {
    if (!weekStartKey) return "";
    return toDateKey(addDays(fromDateKey(weekStartKey), 6));
  }, [weekStartKey]);

  const summary = useMemo(() => {
    const inWeek = appointments.filter((item) => item.date >= weekStartKey && item.date <= weekEndKey);
    return {
      today: inWeek.filter((item) => item.date === todayKey && item.status !== "cancelado").length,
      week: inWeek.filter((item) => item.status !== "cancelado").length,
      pending: inWeek.filter((item) => item.status === "pendiente").length,
      absent: inWeek.filter((item) => item.status === "ausente").length,
    };
  }, [appointments, todayKey, weekEndKey, weekStartKey]);

  const visibleAppointments = useMemo(() => {
    return appointments
      .filter((item) => {
        const inWindow = item.date >= weekStartKey && item.date <= toDateKey(addDays(fromDateKey(weekStartKey || todayKey), 13));
        const professionalMatches = professionalFilter === "todos" || item.professionalId === professionalFilter;
        return inWindow && professionalMatches;
      })
      .sort((a, b) => `${a.date}-${a.time}`.localeCompare(`${b.date}-${b.time}`));
  }, [appointments, professionalFilter, todayKey, weekStartKey]);

  const weekLabel = weekStartKey
    ? `${formatDate(weekStartKey)} — ${formatDate(weekEndKey)}`
    : "";

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <a className={styles.brand} href="/">
          <span className={styles.mark}>P</span>
          <span><strong>Estudio Paisaje</strong><span>Panel interno · demo</span></span>
        </a>
        <nav className={styles.headerActions} aria-label="Navegación del panel">
          <a href="/">Reserva pública</a>
          <a href="/gestionar">Gestionar turno</a>
        </nav>
      </header>

      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>Resumen del estudio</p>
          <h1>La agenda, de un vistazo.</h1>
          <p>Una vista interna para seguir las visitas de diagnóstico, las consultorías botánicas y la supervisión de riego y siembra sin perder contexto.</p>
        </div>
        <div className={styles.weekBadge}><span>Semana visible</span><strong>{weekLabel}</strong></div>
      </section>

      <section className={styles.summaryGrid} aria-label="Resumen de agenda">
        <article className={styles.metric}><span>Citas hoy</span><strong>{ready ? summary.today : "—"}</strong><small>Visitas activas para la jornada</small></article>
        <article className={styles.metric}><span>Semana activa</span><strong>{ready ? summary.week : "—"}</strong><small>Sin contar cancelaciones</small></article>
        <article className={styles.metric}><span>Pendientes</span><strong>{ready ? summary.pending : "—"}</strong><small>Por confirmar o revisar</small></article>
        <article className={styles.metric}><span>Ausencias</span><strong>{ready ? summary.absent : "—"}</strong><small>Registro demo de inasistencias</small></article>
      </section>

      <section className={styles.section} aria-labelledby="team-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.kicker}>Equipo</p><h2 id="team-title">Profesionales del estudio</h2></div>
          <p>Perfiles ficticios para esta demo. Las fotografías son imágenes de stock libres de uso bajo licencia de Unsplash.</p>
        </div>

        <div className={styles.professionalGrid}>
          {professionals.map((professional) => {
            const activeCount = appointments.filter((item) => item.professionalId === professional.id && item.status !== "cancelado").length;
            return (
              <article className={styles.professionalCard} key={professional.id}>
                <img src={professional.photo} alt={`Fotografía de stock asociada al perfil ficticio de ${professional.name}`} loading="lazy" />
                <div className={styles.professionalBody}>
                  <div className={styles.professionalTop}><div><h3>{professional.name}</h3><span>{professional.role}</span></div><strong>{activeCount}</strong></div>
                  <p>{professional.specialty}</p>
                  <small>Fotografía demo: {professional.credit}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="agenda-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.kicker}>Agenda precargada</p><h2 id="agenda-title">Próximas citas y estados</h2></div>
          <p>Los datos proceden del mismo <code>localStorage</code> que utiliza la reserva pública, por lo que las nuevas citas y cambios se reflejan en este panel.</p>
        </div>

        <div className={styles.filters} aria-label="Filtrar agenda por profesional">
          <button className={professionalFilter === "todos" ? styles.filterActive : ""} onClick={() => setProfessionalFilter("todos")} type="button">Todos</button>
          {professionals.map((professional) => (
            <button key={professional.id} className={professionalFilter === professional.id ? styles.filterActive : ""} onClick={() => setProfessionalFilter(professional.id)} type="button">{professional.name.split(" ")[0]}</button>
          ))}
        </div>

        <div className={styles.agendaList}>
          {visibleAppointments.map((appointment) => {
            const professional = professionals.find((item) => item.id === appointment.professionalId);
            return (
              <article className={styles.agendaItem} key={appointment.id}>
                <div className={styles.agendaWhen}><strong>{appointment.time}</strong><span>{formatDate(appointment.date)}</span></div>
                <div className={styles.agendaMain}>
                  <div className={styles.agendaTitleRow}><h3>{appointment.clientName}</h3><span className={`${styles.status} ${styles[`status_${appointment.status}`]}`}>{appointment.status}</span></div>
                  <strong>{services[appointment.serviceId]}</strong>
                  <p>{appointment.note || "Consulta paisajística registrada en la agenda de demostración."}</p>
                </div>
                <div className={styles.agendaProfessional}><span>Profesional</span><strong>{professional?.name ?? appointment.professionalId}</strong><small>{appointment.code}</small></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.demoNote}>
        <strong>Fase 5 · vista interna de demostración</strong>
        <p>En esta fase el panel es de consulta. La edición de estados, bloqueos, estadísticas avanzadas y simulaciones de recordatorios se incorporarán en fases posteriores para mantener cada entrega controlada y verificable.</p>
      </section>
    </main>
  );
}
