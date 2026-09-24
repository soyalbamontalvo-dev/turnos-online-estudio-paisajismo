import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./calendar.css";
import "./brand-overrides.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Agenda Paisajismo | Turnos online",
  description: "Demo de reserva y gestión de turnos para un estudio de paisajismo.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${outfit.variable} ${jakarta.variable}`}>
        {children}
        <a
          href="/gestionar"
          aria-label="Gestionar una reserva existente"
          style={{
            position: "fixed",
            right: 18,
            bottom: 18,
            zIndex: 40,
            display: "inline-flex",
            minHeight: 48,
            alignItems: "center",
            justifyContent: "center",
            padding: "0 17px",
            border: "1px solid rgba(30,58,47,.16)",
            borderRadius: 999,
            background: "#1E3A2F",
            color: "white",
            boxShadow: "0 12px 30px rgba(35,39,42,.18)",
            fontFamily: "var(--font-jakarta), sans-serif",
            fontSize: ".78rem",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Gestionar turno
        </a>
      </body>
    </html>
  );
}
