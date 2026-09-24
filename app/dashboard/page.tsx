"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./dashboard.module.css";

const APPOINTMENTS_KEY = "paisajismo-demo-appointments";

const services = {
  diagnostico: "Visita de diagnóstico a terreno",
  botanico: "Consultoría de diseño botánico",
  riego: "Supervisión de riego y siembra",
} as const;

const serviceShowcase = [
  {
    id: "diagnostico",
    eyebrow: "Lectura del lugar",
    title: "Visita de diagnóstico a terreno",
    text: "Una primera lectura técnica del espacio para entender orientación solar, drenaje, pendientes, circulaciones, suelo y relación con la vivienda antes de tomar decisiones de diseño.",
    detail: "Ideal para jardines residenciales, patios, terrazas y terrenos que necesitan definir prioridades antes de proyectar.",
    photo: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "botanico",
    eyebrow: "Vegetación con criterio",
    title: "Consultoría de diseño botánico",
    text: "Selección y composición de especies según exposición, humedad, mantenimiento, escala y carácter del proyecto, buscando una paleta vegetal coherente durante todo el año.",
    detail: "Pensada para resolver combinaciones vegetales, sustituciones, zonas de sombra, terrazas soleadas y jardines de bajo mantenimiento.",
    photo: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=82",
  },
  {
    id: "riego",
    eyebrow: "Ejecución y seguimiento",
    title: "Supervisión de riego y siembra",
    text: "Revisión de sectorización, cobertura, presión, programación y correcta implantación de las especies para reducir fallos durante la puesta en marcha del jardín.",
    detail: "Útil antes de cerrar una obra verde, tras una nueva plantación o cuando aparecen zonas secas, exceso de agua o problemas de establecimiento.",
    photo: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?auto=format&fit=crop&w=1200&q=82",
  },
] as const;

const professionals = [
  {
    id: "lucia",
    name: "Lucía Herrera",
    role: "Arquitecta paisajista",
    specialty: "Diagnóstico de sitio, lectura del terreno y estrategia de implantación.",
    bio: "Coordina las primeras visitas y transforma condicionantes del terreno en una hoja de ruta clara para el proyecto.",
    focus: "Vivienda unifamiliar · patios · jardines de nueva implantación",
    photo: "https://images.unsplash.com/photo-1747671688812-76d7bca21f34?auto=format&fit=crop&w=900&q=82",
    credit: "Arturo Añez · Unsplash",
  },
  {
    id: "mateo",
    name: "Mateo Rivas",
    role: "Especialista en diseño botánico",
    specialty: "Paletas vegetales, especies adaptadas al clima y composición estacional.",
    bio: "Trabaja la selección vegetal desde el comportamiento real de cada espacio: luz, textura, mantenimiento y evolución temporal.",
    focus: "Paletas vegetales · terrazas · jardines de bajo consumo",
    photo: "https://images.unsplash.com/photo-1772450236019-7b1c970b57ad?auto=format&fit=crop&w=900&q=82",
    credit: "Rodrigo Rodrigues · Unsplash",
  },
  {
    id: "ines",
    name: "Inés Valverde",
    role: "Coordinadora de obra verde",
    specialty: "Supervisión de riego, siembra y puesta en marcha de jardines.",
    bio: "Acompaña la fase de ejecución para comprobar que plantación, riego y acabados respondan al diseño previsto y funcionen desde el primer día.",
    focus: "Riego · plantación · control de ejecución",
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
  projectType?: string;
  location?: string;
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
      projectType: "Jardín residencial · 420 m²",
      location: "Lomas del Guijarro · Tegucigalpa",
      serviceId: "diagnostico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 2)),
      time: "10:30",
      status: "confirmado",
      note: "Evaluar asoleamiento, drenaje, recorridos y privacidad antes de definir la reorganización completa del jardín posterior.",
    },
    {
      id: "demo-02",
      code: "DEMO02",
      clientName: "Esteban Mejía",
      email: "esteban.mejia@demo.hn",
      phone: "+504 9981 4052",
      projectType: "Patio interior · 75 m²",
      location: "Col. Palmira · Tegucigalpa",
      serviceId: "botanico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 3)),
      time: "14:00",
      status: "confirmado",
      note: "Revisar una propuesta vegetal para patio sombreado y sustituir especies con demasiada demanda de riego y mantenimiento.",
    },
    {
      id: "demo-03",
      code: "DEMO03",
      clientName: "Valeria Durón",
      email: "valeria.duron@demo.hn",
      phone: "+504 9732 6621",
      projectType: "Jardín familiar · 260 m²",
      location: "El Hatillo · Tegucigalpa",
      serviceId: "riego",
      professionalId: "mateo",
      date: toDateKey(addDays(monday, 2)),
      time: "12:00",
      status: "pendiente",
      note: "Comprobar cobertura del riego por goteo y ajustar sectores antes de iniciar la plantación de arbustos y cubresuelos.",
    },
    {
      id: "demo-04",
      code: "DEMO04",
      clientName: "Nicolás Ferrera",
      email: "nicolas.ferrera@demo.hn",
      phone: "+504 9554 1187",
      projectType: "Talud ajardinado · 180 m²",
      location: "Residencial Las Uvas · Tegucigalpa",
      serviceId: "diagnostico",
      professionalId: "mateo",
      date: toDateKey(addDays(monday, 4)),
      time: "15:30",
      status: "confirmado",
      note: "Diagnosticar escorrentía y erosión del talud y definir criterios iniciales de estabilización mediante vegetación adaptada.",
    },
    {
      id: "demo-05",
      code: "DEMO05",
      clientName: "Mariana Zelaya",
      email: "mariana.zelaya@demo.hn",
      phone: "+504 9905 7740",
      projectType: "Jardín de nueva obra · 510 m²",
      location: "Valle de Ángeles",
      serviceId: "riego",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 3)),
      time: "09:00",
      status: "confirmado",
      note: "Supervisar sectorización, presión y programación de riego antes de la recepción de un jardín recién ejecutado.",
    },
    {
      id: "demo-06",
      code: "DEMO06",
      clientName: "Jorge Lanza",
      email: "jorge.lanza@demo.hn",
      phone: "+504 9655 8204",
      projectType: "Terraza urbana · 48 m²",
      location: "Col. Florencia Norte · Tegucigalpa",
      serviceId: "botanico",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 4)),
      time: "10:30",
      status: "pendiente",
      note: "Seleccionar especies resistentes para una terraza con sol intenso por la tarde, viento y poco espacio para contenedores.",
    },
    {
      id: "demo-07",
      code: "DEMO07",
      clientName: "Paola Rivera",
      email: "paola.rivera@demo.hn",
      phone: "+504 9442 6003",
      projectType: "Vivienda unifamiliar · 600 m²",
      location: "Santa Lucía",
      serviceId: "diagnostico",
      professionalId: "lucia",
      date: toDateKey(addDays(monday, 7)),
      time: "09:00",
      status: "confirmado",
      note: "Primera visita para reorganizar accesos, zona social exterior y transición entre vivienda, árboles existentes y nuevo jardín.",
    },
    {
      id: "demo-08",
      code: "DEMO08",
      clientName: "Sofía Andino",
      email: "sofia.andino@demo.hn",
      phone: "+504 9840 1135",
      projectType: "Jardín existente · 310 m²",
      location: "Col. Tepeyac · Tegucigalpa",
      serviceId: "botanico",
      professionalId: "mateo",
      date: toDateKey(monday),
      time: "14:00",
      status: "ausente",
      note: "Consultoría prevista para sustituir césped de alto consumo por cubresuelos y masas vegetales adaptadas al clima local.",
    },
    {
      id: "demo-09",
      code: "DEMO09",
      clientName: "Andrés Cáceres",
      email: "andres.caceres@demo.hn",
      phone: "+504 9711 2498",
      projectType: "Jardín consolidado · 220 m²",
      location: "Col. Alameda · Tegucigalpa",
      serviceId: "riego",
      professionalId: "ines",
      date: toDateKey(addDays(monday, 1)),
      time: "15:30",
      status: "cancelado",
      note: "Revisión prevista de goteros obstruidos y diferencias de humedad entre sectores. Cita cancelada por el cliente.",
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
        projectType: item.projectType || richer.projectType,
        location: item.location || richer.location,
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
    if (!weekStartKey) return [];
    const windowEnd = toDateKey(addDays(fromDateKey(weekStartKey), 13));
    return appointments
      .filter((item) => {
        const inWindow = item.date >= weekStartKey && item.date <= windowEnd;
        const professionalMatches = professionalFilter === "todos" || item.professionalId === professionalFilter;
        return inWindow && professionalMatches;
      })
      .sort((a, b) => `${a.date}-${a.time}`.localeCompare(`${b.date}-${b.time}`));
  }, [appointments, professionalFilter, weekStartKey]);

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
          <p>Una vista interna para seguir visitas de diagnóstico, decisiones de diseño botánico y supervisiones de obra verde con el contexto suficiente para preparar cada intervención.</p>
        </div>
        <div className={styles.weekBadge}><span>Semana visible</span><strong>{weekLabel}</strong></div>
      </section>

      <section className={styles.summaryGrid} aria-label="Resumen de agenda">
        <article className={styles.metric}><span>Citas hoy</span><strong>{ready ? summary.today : "—"}</strong><small>Visitas activas para la jornada</small></article>
        <article className={styles.metric}><span>Semana activa</span><strong>{ready ? summary.week : "—"}</strong><small>Sin contar cancelaciones</small></article>
        <article className={styles.metric}><span>Pendientes</span><strong>{ready ? summary.pending : "—"}</strong><small>Por confirmar o revisar</small></article>
        <article className={styles.metric}><span>Ausencias</span><strong>{ready ? summary.absent : "—"}</strong><small>Registro demo de inasistencias</small></article>
      </section>

      <section className={styles.section} aria-labelledby="services-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.kicker}>Servicios</p><h2 id="services-title">Qué resolvemos en cada visita</h2></div>
          <p>Textos de demostración redactados específicamente para un estudio de paisajismo. No se utiliza contenido genérico ni texto de relleno.</p>
        </div>

        <div className={styles.serviceVisualGrid}>
          {serviceShowcase.map((service) => (
            <article className={styles.serviceVisualCard} key={service.id}>
              <img src={service.photo} alt={`Imagen de ambiente para ${service.title}`} loading="lazy" />
              <div className={styles.serviceVisualBody}>
                <span>{service.eyebrow}</span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
                <small>{service.detail}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="team-title">
        <div className={styles.sectionHeading}>
          <div><p className={styles.kicker}>Equipo</p><h2 id="team-title">Profesionales del estudio</h2></div>
          <p>Perfiles ficticios creados para la demo. Las fotografías se utilizan únicamente como imágenes de stock asociadas a esos perfiles.</p>
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
                  <p className={styles.professionalBio}>{professional.bio}</p>
                  <div className={styles.focusTag}>{professional.focus}</div>
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
          <p>La agenda utiliza el mismo <code>localStorage</code> que la reserva pública. Cada cita demo incorpora contexto de proyecto para que el panel resulte útil y verosímil.</p>
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
                  {(appointment.projectType || appointment.location) && (
                    <div className={styles.projectMeta}>
                      {appointment.projectType && <span>{appointment.projectType}</span>}
                      {appointment.location && <span>{appointment.location}</span>}
                    </div>
                  )}
                  <p>{appointment.note || "Consulta paisajística registrada en la agenda de demostración."}</p>
                </div>
                <div className={styles.agendaProfessional}><span>Profesional</span><strong>{professional?.name ?? appointment.professionalId}</strong><small>{appointment.code}</small></div>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.demoNote}>
        <strong>Contenido demo específico de paisajismo</strong>
        <p>Los nombres, perfiles, clientes, direcciones, proyectos y notas son ficticios y sirven únicamente para mostrar cómo funcionaría el producto. Las fotografías se usan como material visual de demostración.</p>
      </section>
    </main>
  );
}
