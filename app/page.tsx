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

type Draft = {
  serviceId: string;
  professionalId: string;
};

const STORAGE_KEY = "paisajismo-booking-draft";

export default function HomePage() {
  const [serviceId, setServiceId] = useState(services[0].id);
  const [professionalId, setProfessionalId] = useState(professionals[0].id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
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
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ serviceId, professionalId } satisfies Draft),
    );
  }, [serviceId, professionalId, ready]);

  const selectedService = useMemo(
    () => services.find((item) => item.id === serviceId) ?? services[0],
    [serviceId],
  );

  const selectedProfessional = useMemo(
    () => professionals.find((item) => item.id === professionalId) ?? professionals[0],
    [professionalId],
  );

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
          Elige el tipo de atención y el profesional. En el siguiente paso podrás seleccionar día y hora disponibles.
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
            onChange={(event) => setProfessionalId(event.target.value)}
          >
            {professionals.map((professional) => (
              <option key={professional.id} value={professional.id}>
                {professional.name} · {professional.role}
              </option>
            ))}
          </select>
        </div>

        <div className="summary-box">
          <div>
            <span className="summary-label">Tu selección</span>
            <strong>{selectedService.title}</strong>
            <span>{selectedProfessional.name}</span>
          </div>
          <button className="primary-button" type="button" disabled>
            Elegir día y hora
          </button>
        </div>
      </section>

      <section className="trust-strip" aria-label="Información de la reserva">
        <div>
          <strong>Sin llamadas</strong>
          <span>Consulta disponibilidad cuando quieras.</span>
        </div>
        <div>
          <strong>Reserva flexible</strong>
          <span>La demo permitirá reprogramar o cancelar con un código.</span>
        </div>
        <div>
          <strong>Datos de prueba</strong>
          <span>Esta primera fase funciona íntegramente en tu navegador.</span>
        </div>
      </section>
    </main>
  );
}
