import { useState, useMemo } from "react";

/* ============================================================
   AUNA MVP — Sistema de acompañamiento para organizaciones de pacientes
   
   NOTAS DE SEGURIDAD (para desarrollo futuro):
   - TODO: Implementar autenticación segura (OAuth 2.0 / OIDC)
   - TODO: Implementar autorización por roles (admin, operador, consultor)
   - TODO: Aislamiento de datos por organización (multi-tenant)
   - TODO: HTTPS/TLS obligatorio en producción
   - TODO: Cifrado en reposo para datos sensibles (AES-256)
   - TODO: Contraseñas hasheadas con bcrypt/argon2 + salt
   - TODO: Validación y sanitización de todos los inputs (server-side)
   - TODO: Prevención de XSS (Content Security Policy, escape de output)
   - TODO: Prevención de SQL/NoSQL injection (queries parametrizadas)
   - TODO: Manejo seguro de sesiones (tokens HttpOnly, SameSite, Secure)
   - TODO: Rate limiting y protección contra fuerza bruta
   - TODO: Logs de auditoría sin datos personales sensibles
   - TODO: Consentimiento informado antes de almacenar datos
   - TODO: Cumplimiento de Ley 25.326 (Protección de Datos Personales, Argentina)
   - TODO: OWASP Top 10 — revisar cada punto antes de producción
   
   IMPORTANTE: Todos los datos en este archivo son ficticios/sintéticos.
   No se usan datos reales de ninguna persona.
   No se hardcodean secretos, claves ni tokens.
============================================================ */

// ── DATOS SINTÉTICOS (MOCK) ──────────────────────────────
// TODO: Reemplazar con llamadas a API segura con autenticación

const PERSONAS = [
  { id: "P001", nombre: "María González", dni: "28.456.789", edad: 42, patologia: "Esclerosis múltiple", cobertura: "OSDE 310", ultimoContacto: "2026-05-08", esMenor: false, resumen: "María consulta regularmente sobre cobertura de medicación y turnos con neurología. Muy organizada, suele acompañar a su madre también." },
  { id: "P002", nombre: "Carlos Fernández", dni: "31.234.567", edad: 35, patologia: "Sin diagnóstico", cobertura: "Swiss Medical", ultimoContacto: "2026-05-06", esMenor: false, resumen: "Carlos se contactó por primera vez buscando orientación general. Aún sin diagnóstico confirmado, en proceso de estudios." },
  { id: "P003", nombre: "Lucía Martínez", dni: "25.678.901", edad: 58, patologia: "Artritis reumatoide", cobertura: "PAMI", ultimoContacto: "2026-05-10", esMenor: false, resumen: "Lucía necesita acompañamiento constante con trámites de cobertura y derivaciones. Su hija suele llamar en su nombre." },
  { id: "P004", nombre: "Familia Rodríguez", dni: "Grupo familiar", edad: null, patologia: "ELA (miembro familiar)", cobertura: "Galeno", ultimoContacto: "2026-05-09", esMenor: false, resumen: "La familia acompaña al padre, diagnosticado con ELA hace 2 años. Necesitan apoyo integral: legal, cobertura y contención." },
  { id: "P005", nombre: "Valentina Sosa", dni: "55.123.456", edad: 8, patologia: "Epilepsia refractaria", cobertura: "OSDE 210", ultimoContacto: "2026-05-07", esMenor: true, tutor: "Ana Sosa (madre)", resumen: "Valentina es acompañada por su madre Ana. Consultan sobre medicación de alto costo y acceso a tratamientos especializados." },
  { id: "P006", nombre: "Roberto Díaz", dni: "20.345.678", edad: 67, patologia: "Parkinson", cobertura: "IOMA", ultimoContacto: "2026-04-28", esMenor: false, resumen: "Roberto consulta esporádicamente. Su esposa suele ser el contacto principal. Interesado en grupos de apoyo." },
  { id: "P007", nombre: "Sofía Ruiz", dni: "40.567.890", edad: 29, patologia: "Sin diagnóstico", cobertura: "Medifé", ultimoContacto: "2026-05-11", esMenor: false, resumen: "Sofía escribió recientemente preguntando por documentación necesaria para iniciar reclamo a obra social." },
  { id: "P008", nombre: "Tomás Herrera", dni: "56.789.012", edad: 12, patologia: "Diabetes tipo 1", cobertura: "OSDE 310", ultimoContacto: "2026-05-05", esMenor: true, tutor: "Martín Herrera (padre)", resumen: "Tomás es acompañado por su padre Martín. Consultan sobre insumos cubiertos y campamentos para chicos con diabetes." },
  { id: "P009", nombre: "Elena Morales", dni: "27.890.123", edad: 45, patologia: "Fibromialgia", cobertura: "Swiss Medical", ultimoContacto: "2026-05-03", esMenor: false, resumen: "Elena busca información sobre tratamientos alternativos y cobertura. Ha participado en talleres de la organización." },
  { id: "P010", nombre: "Familia Acosta", dni: "Grupo familiar", edad: null, patologia: "Fibrosis quística (hijo)", cobertura: "Accord Salud", ultimoContacto: "2026-05-10", esMenor: false, resumen: "Los Acosta acompañan a su hijo de 15 años con fibrosis quística. Muy activos, colaboran también como voluntarios." },
];

const CANALES = ["Instagram", "Facebook", "Mail", "WhatsApp", "Manual"];
const ESTADOS = ["Nueva", "Respondida", "Archivada"];
const MOTIVOS = ["Cobertura de medicación", "Orientación general", "Derivación médica", "Documentación", "Consulta legal", "Grupo de apoyo", "Reclamo obra social", "Acceso a tratamiento"];

const CONSULTAS = [
  { id: "C001", fecha: "2026-05-11", canal: "WhatsApp", personaId: "P007", motivo: "Documentación", estado: "Nueva", mensaje: "Hola, necesito saber qué documentación tengo que presentar para iniciar un reclamo ante mi obra social por negativa de cobertura. Me rechazaron un estudio que me pidió mi médico. Gracias." },
  { id: "C002", fecha: "2026-05-10", canal: "Instagram", personaId: "P010", motivo: "Acceso a tratamiento", estado: "Nueva", mensaje: "Buenos días, somos la familia Acosta. Nuestro hijo necesita un tratamiento nuevo que salió para fibrosis quística y la obra social dice que no está en el PMO. ¿Nos pueden orientar?" },
  { id: "C003", fecha: "2026-05-10", canal: "Mail", personaId: "P003", motivo: "Cobertura de medicación", estado: "Respondida", mensaje: "Estimados, les escribo porque PAMI me cambió la medicación por una genérica y mi reumatóloga dice que no es lo mismo. ¿Qué puedo hacer? Muchas gracias, Lucía." },
  { id: "C004", fecha: "2026-05-09", canal: "WhatsApp", personaId: "P004", motivo: "Consulta legal", estado: "Respondida", mensaje: "Buenas tardes, soy Laura Rodríguez. Mi papá tiene ELA y Galeno nos está demorando la entrega de una silla de ruedas motorizada que el médico indicó como imprescindible. Ya pasaron 40 días. ¿Hay alguna vía legal?" },
  { id: "C005", fecha: "2026-05-08", canal: "Facebook", personaId: "P001", motivo: "Derivación médica", estado: "Respondida", mensaje: "Hola AUNA, soy María. Mi neuróloga se fue de OSDE y no consigo turno con otro profesional que conozca mi caso. ¿Tienen algún contacto para recomendarme?" },
  { id: "C006", fecha: "2026-05-07", canal: "WhatsApp", personaId: "P005", motivo: "Cobertura de medicación", estado: "Respondida", mensaje: "Hola, soy Ana, la mamá de Valentina. La medicación que toma mi hija subió muchísimo y OSDE nos cubre solo el 40%. El neurólogo dice que es esencial. ¿Cómo hago para pedir cobertura del 100%?" },
  { id: "C007", fecha: "2026-05-06", canal: "Manual", personaId: "P002", motivo: "Orientación general", estado: "Nueva", mensaje: "Registrado de forma presencial. Carlos se acercó a la sede buscando información general. Aún no tiene diagnóstico confirmado, está en proceso de estudios. Quiere saber cómo la organización puede ayudarlo." },
  { id: "C008", fecha: "2026-05-05", canal: "Mail", personaId: "P008", motivo: "Grupo de apoyo", estado: "Archivada", mensaje: "Hola, soy Martín, el papá de Tomás. Queríamos saber si hay algún campamento o actividad de verano para chicos con diabetes tipo 1. Tomás tiene 12 años. Gracias." },
  { id: "C009", fecha: "2026-05-03", canal: "Instagram", personaId: "P009", motivo: "Reclamo obra social", estado: "Archivada", mensaje: "Hola, tengo fibromialgia y Swiss Medical me rechazó la cobertura de kinesiología porque dice que excedí las sesiones anuales. Pero mi médico indica que necesito continuar. ¿Me pueden ayudar?" },
  { id: "C010", fecha: "2026-04-28", canal: "Facebook", personaId: "P006", motivo: "Grupo de apoyo", estado: "Archivada", mensaje: "Buenas, soy la esposa de Roberto Díaz. Queríamos saber si hay algún grupo de apoyo para familias de personas con Parkinson. Roberto tiene 67 años y fue diagnosticado hace 3 años." },
];

const TIMELINES = {
  P001: [
    { fecha: "2026-05-08", tipo: "consulta", texto: "Consulta recibida vía Facebook: derivación médica por cambio de neuróloga." },
    { fecha: "2026-05-08", tipo: "respuesta", texto: "Se envió listado de neurólogos especializados en EM dentro de OSDE 310." },
    { fecha: "2026-04-15", tipo: "nota", texto: "María también acompaña a su madre (no registrada aún). Evaluar registro familiar." },
    { fecha: "2026-03-20", tipo: "documento", texto: "Se mencionó certificado de discapacidad vigente hasta 2027." },
    { fecha: "2026-02-10", tipo: "consulta", texto: "Consulta por cobertura de medicación de alto costo (Ocrevus)." },
    { fecha: "2026-02-11", tipo: "respuesta", texto: "Se orientó sobre trámite ante OSDE con nota del neurólogo." },
  ],
  P003: [
    { fecha: "2026-05-10", tipo: "consulta", texto: "Consulta por mail: PAMI cambió medicación por genérica sin autorización de reumatóloga." },
    { fecha: "2026-05-10", tipo: "respuesta", texto: "Se indicó presentar nota de reumatóloga y reclamo formal en PAMI." },
    { fecha: "2026-04-01", tipo: "medico", texto: "Médica tratante: Dra. Silvia Paredes, Reumatología." },
    { fecha: "2026-03-15", tipo: "nota", texto: "La hija de Lucía (Carla) es el contacto principal. Tel. registrado." },
    { fecha: "2026-02-20", tipo: "documento", texto: "Se mencionó orden médica y estudios de laboratorio recientes." },
  ],
  P004: [
    { fecha: "2026-05-09", tipo: "consulta", texto: "Consulta vía WhatsApp: demora en entrega de silla de ruedas motorizada por parte de Galeno." },
    { fecha: "2026-05-09", tipo: "respuesta", texto: "Se derivó a asesoramiento legal. Se sugirió amparo por vía judicial si no hay respuesta en 10 días." },
    { fecha: "2026-04-20", tipo: "nota", texto: "Laura (hija) es el contacto principal de la familia. El padre tiene movilidad muy reducida." },
    { fecha: "2026-03-10", tipo: "medico", texto: "Médico tratante: Dr. Gustavo Ramos, Neurología." },
    { fecha: "2026-02-01", tipo: "consulta", texto: "Primera consulta: orientación general sobre derechos del paciente con ELA." },
    { fecha: "2026-02-02", tipo: "respuesta", texto: "Se envió guía de derechos y contactos de organizaciones especializadas en ELA." },
    { fecha: "2026-01-15", tipo: "documento", texto: "Se mencionó certificado de discapacidad y prescripción de equipamiento." },
  ],
  P005: [
    { fecha: "2026-05-07", tipo: "consulta", texto: "Consulta vía WhatsApp: solicitud de cobertura al 100% de medicación antiepiléptica." },
    { fecha: "2026-05-07", tipo: "respuesta", texto: "Se indicó procedimiento para solicitar cobertura total con nota del neurólogo y resolución de Superintendencia." },
    { fecha: "2026-04-10", tipo: "nota", texto: "Valentina tiene 8 años. La madre Ana es tutora legal y contacto único." },
    { fecha: "2026-03-01", tipo: "medico", texto: "Médico tratante: Dr. Federico López, Neuropediatría." },
  ],
  P007: [
    { fecha: "2026-05-11", tipo: "consulta", texto: "Consulta vía WhatsApp: documentación necesaria para reclamo a obra social." },
  ],
  P010: [
    { fecha: "2026-05-10", tipo: "consulta", texto: "Consulta vía Instagram: acceso a nuevo tratamiento para fibrosis quística no incluido en PMO." },
    { fecha: "2026-04-25", tipo: "nota", texto: "Familia muy comprometida. Colaboran como voluntarios en eventos de la organización." },
    { fecha: "2026-03-15", tipo: "medico", texto: "Médico tratante: Dra. Carolina Vega, Neumonología pediátrica." },
    { fecha: "2026-02-10", tipo: "documento", texto: "Se mencionaron estudios genéticos y protocolo de tratamiento actual." },
  ],
};

const RESPUESTAS_GUARDADAS = [
  { id: "R001", categoria: "Orientación general", titulo: "Bienvenida inicial", texto: "Gracias por contactarte con AUNA. Somos una organización que acompaña a personas y familias en el acceso a la salud. Podemos orientarte sobre tus derechos, trámites de cobertura, derivaciones y documentación. Contanos en qué podemos ayudarte." },
  { id: "R002", categoria: "Cobertura / Obra social", titulo: "Reclamo por negativa de cobertura", texto: "Si tu obra social te negó la cobertura de un tratamiento o medicación prescripta por tu médico, tenés derecho a reclamar. Los pasos son: 1) Solicitar la negativa por escrito. 2) Presentar reclamo formal ante la obra social con nota del médico tratante. 3) Si no hay respuesta en 30 días, podés recurrir a la Superintendencia de Servicios de Salud." },
  { id: "R003", categoria: "Cobertura / Obra social", titulo: "Cobertura de medicación al 100%", texto: "Para solicitar cobertura total de medicación, necesitás: nota del médico tratante indicando que es imprescindible, estudios que respalden el diagnóstico, y presentar el pedido formal en tu obra social citando la Resolución vigente de la Superintendencia de Servicios de Salud." },
  { id: "R004", categoria: "Derivación a organización", titulo: "Derivación a organización especializada", texto: "Según tu situación, te sugerimos contactar a [nombre de organización], que se especializa en [patología/tema]. Ellos pueden ofrecerte acompañamiento específico. Te compartimos sus datos de contacto y, si querés, podemos hacer la presentación." },
  { id: "R005", categoria: "Documentación", titulo: "Documentación para trámites", texto: "Para iniciar el trámite necesitás: DNI vigente, carnet de obra social, orden médica actualizada, estudios complementarios, y nota del médico tratante explicando la necesidad. Te recomendamos llevar original y copia de todo." },
  { id: "R006", categoria: "Consulta legal", titulo: "Orientación sobre amparo de salud", texto: "Si tu obra social no responde al reclamo en tiempo y forma, existe la posibilidad de iniciar un amparo judicial. Este recurso es rápido y busca garantizar tu derecho a la salud. Te sugerimos consultar con un abogado especializado. Podemos conectarte con profesionales que trabajan con nuestra organización." },
  { id: "R007", categoria: "Sin diagnóstico", titulo: "Acompañamiento sin diagnóstico confirmado", texto: "Entendemos que estar en proceso de diagnóstico puede generar incertidumbre. Desde AUNA podemos acompañarte mientras transitás este camino: orientarte sobre estudios, derechos y opciones. No necesitás un diagnóstico confirmado para recibir nuestra ayuda." },
  { id: "R008", categoria: "Documentación", titulo: "Certificado de discapacidad", texto: "El Certificado Único de Discapacidad (CUD) se tramita en las juntas evaluadoras de cada jurisdicción. Necesitás: certificado médico actualizado, estudios complementarios, DNI, y formulario de la junta. El trámite es gratuito. Podemos orientarte según tu localidad." },
];

// ── ICONOS (SVG inline) ─────────────────────────────────
const Icons = {
  panel: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="7" rx="1.5"/>
      <rect x="11" y="2" width="7" height="7" rx="1.5"/>
      <rect x="2" y="11" width="7" height="7" rx="1.5"/>
      <rect x="11" y="11" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  consultas: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4h14a1 1 0 011 1v8a1 1 0 01-1 1H6l-3 3V5a1 1 0 011-1z"/>
    </svg>
  ),
  personas: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="3"/><path d="M2 17v-1a5 5 0 015-5h0a5 5 0 015 5v1"/>
      <circle cx="14" cy="7" r="2"/><path d="M14 11a4 4 0 014 4v2"/>
    </svg>
  ),
  respuestas: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h12a1 1 0 011 1v10l-3-2H4a1 1 0 01-1-1V5a1 1 0 011-1z"/><path d="M7 8h6M7 10.5h4"/>
    </svg>
  ),
  reporte: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17V3h8l4 4v10a1 1 0 01-1 1H5a1 1 0 01-1-1z"/><path d="M12 3v4h4"/><path d="M7 10h6M7 13h4"/>
    </svg>
  ),
  config: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5"/><path d="M10 2v2.5M10 15.5V18M2 10h2.5M15.5 10H18M4.2 4.2l1.8 1.8M14 14l1.8 1.8M4.2 15.8l1.8-1.8M14 6l1.8-1.8"/>
    </svg>
  ),
  back: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4L6 9l5 5"/>
    </svg>
  ),
  search: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5L14 14"/>
    </svg>
  ),
  whatsapp: "📱", instagram: "📸", facebook: "💬", mail: "✉️", manual: "📝",
};

const canalIcon = (canal) => {
  const map = { WhatsApp: Icons.whatsapp, Instagram: Icons.instagram, Facebook: Icons.facebook, Mail: Icons.mail, Manual: Icons.manual };
  return map[canal] || "📋";
};

const estadoColor = (estado) => {
  if (estado === "Nueva") return { bg: "#FEF3C7", text: "#92400E" };
  if (estado === "Respondida") return { bg: "#D1FAE5", text: "#065F46" };
  return { bg: "#E5E7EB", text: "#374151" };
};

const tipoTimelineStyle = (tipo) => {
  const map = {
    consulta: { color: "#C2956B", icon: "📩", label: "Consulta registrada" },
    respuesta: { color: "#7C6FA0", icon: "💬", label: "Respuesta enviada" },
    nota: { color: "#9CA3AF", icon: "📝", label: "Nota interna" },
    documento: { color: "#D4A574", icon: "📄", label: "Documento mencionado" },
    medico: { color: "#8B9DC3", icon: "🩺", label: "Médico mencionado" },
  };
  return map[tipo] || { color: "#9CA3AF", icon: "📋", label: tipo };
};

const formatFecha = (f) => {
  const d = new Date(f + "T12:00:00");
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
};

// ── COMPONENTES ────────────────────────────────────────

function Badge({ children, bg, color }) {
  return (
    <span style={{ background: bg, color, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, whiteSpace: "nowrap" }}>
      {children}
    </span>
  );
}

function Card({ children, style, onClick, hover }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFDF9",
        borderRadius: 14,
        padding: "22px 24px",
        boxShadow: hovered && hover ? "0 4px 20px rgba(0,0,0,0.08)" : "0 1px 6px rgba(0,0,0,0.04)",
        border: "1px solid #F0EBE3",
        transition: "box-shadow 0.2s, transform 0.2s",
        transform: hovered && hover ? "translateY(-1px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style }) {
  const styles = {
    primary: { background: "#C2956B", color: "#fff", border: "none" },
    secondary: { background: "transparent", color: "#7C6FA0", border: "1.5px solid #7C6FA0" },
    ghost: { background: "transparent", color: "#8B7E74", border: "1px solid #E0D9CF" },
  };
  return (
    <button
      onClick={onClick}
      style={{
        ...styles[variant],
        padding: "8px 18px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "opacity 0.15s",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.opacity = "0.7")}
      onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
    >
      {children}
    </button>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <Card style={{ flex: "1 1 160px", minWidth: 150 }}>
      <div style={{ fontSize: 13, color: "#8B7E74", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: accent || "#5A4F45", letterSpacing: "-0.5px" }}>{value}</div>
    </Card>
  );
}

// ── PANTALLAS ──────────────────────────────────────────

function PanelScreen() {
  const nuevas = CONSULTAS.filter((c) => c.estado === "Nueva").length;
  const respondidas = CONSULTAS.filter((c) => c.estado === "Respondida").length;
  const motivos = {};
  CONSULTAS.forEach((c) => { motivos[c.motivo] = (motivos[c.motivo] || 0) + 1; });
  const topMotivos = Object.entries(motivos).sort((a, b) => b[1] - a[1]).slice(0, 4);
  const recientes = CONSULTAS.slice(0, 4);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#3D3530", marginBottom: 24 }}>Panel</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        <StatCard label="Consultas totales" value={CONSULTAS.length} />
        <StatCard label="Nuevas" value={nuevas} accent="#C2956B" />
        <StatCard label="Respondidas" value={respondidas} accent="#7C6FA0" />
        <StatCard label="Personas / Familias" value={PERSONAS.length} accent="#5A4F45" />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Card style={{ flex: "1 1 280px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 14 }}>Motivos frecuentes</div>
          {topMotivos.map(([m, c]) => (
            <div key={m} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #F0EBE3" }}>
              <span style={{ fontSize: 13, color: "#6B5E53" }}>{m}</span>
              <Badge bg="#F5EDE4" color="#8B7E74">{c}</Badge>
            </div>
          ))}
        </Card>
        <Card style={{ flex: "1 1 320px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 14 }}>Actividad reciente</div>
          {recientes.map((c) => {
            const p = PERSONAS.find((x) => x.id === c.personaId);
            const ec = estadoColor(c.estado);
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F0EBE3" }}>
                <span style={{ fontSize: 16 }}>{canalIcon(c.canal)}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#3D3530", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p?.nombre}</div>
                  <div style={{ fontSize: 12, color: "#9B9088" }}>{c.motivo} · {formatFecha(c.fecha)}</div>
                </div>
                <Badge bg={ec.bg} color={ec.text}>{c.estado}</Badge>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

function ConsultasScreen({ onSelect }) {
  const [filtro, setFiltro] = useState("");
  const filtered = CONSULTAS.filter((c) => {
    const p = PERSONAS.find((x) => x.id === c.personaId);
    const txt = `${p?.nombre} ${c.motivo} ${c.canal} ${c.estado} ${p?.patologia}`.toLowerCase();
    return txt.includes(filtro.toLowerCase());
  });

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#3D3530", marginBottom: 20 }}>Consultas</h2>
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 360 }}>
        <span style={{ position: "absolute", left: 12, top: 10, color: "#B0A89E" }}>{Icons.search}</span>
        {/* TODO: Sanitizar input antes de enviar a backend */}
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nombre, motivo, canal..."
          style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: "1px solid #E0D9CF", fontSize: 13, background: "#FFFDF9", outline: "none", boxSizing: "border-box", color: "#3D3530" }}
        />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 6px", minWidth: 700 }}>
          <thead>
            <tr>
              {["Fecha", "Canal", "Persona / Familia", "Motivo", "Patología", "Estado", ""].map((h) => (
                <th key={h} style={{ textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9B9088", padding: "6px 10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const p = PERSONAS.find((x) => x.id === c.personaId);
              const ec = estadoColor(c.estado);
              return (
                <tr key={c.id} style={{ background: "#FFFDF9", borderRadius: 10 }}>
                  <td style={{ padding: "12px 10px", fontSize: 13, color: "#6B5E53", borderRadius: "10px 0 0 10px" }}>{formatFecha(c.fecha)}</td>
                  <td style={{ padding: "12px 10px", fontSize: 15 }}>{canalIcon(c.canal)} <span style={{ fontSize: 12, color: "#8B7E74" }}>{c.canal}</span></td>
                  <td style={{ padding: "12px 10px", fontSize: 13, fontWeight: 500, color: "#3D3530" }}>{p?.nombre}</td>
                  <td style={{ padding: "12px 10px", fontSize: 13, color: "#6B5E53" }}>{c.motivo}</td>
                  <td style={{ padding: "12px 10px", fontSize: 13, color: p?.patologia === "Sin diagnóstico" ? "#B0A89E" : "#6B5E53", fontStyle: p?.patologia === "Sin diagnóstico" ? "italic" : "normal" }}>{p?.patologia}</td>
                  <td style={{ padding: "12px 10px" }}><Badge bg={ec.bg} color={ec.text}>{c.estado}</Badge></td>
                  <td style={{ padding: "12px 10px", borderRadius: "0 10px 10px 0" }}>
                    <Btn variant="ghost" onClick={() => onSelect(c.id)}>Ver detalle</Btn>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DetalleConsultaScreen({ consultaId, onBack }) {
  const c = CONSULTAS.find((x) => x.id === consultaId);
  const p = PERSONAS.find((x) => x.id === c?.personaId);
  const [nota, setNota] = useState("");
  const [respRegistrada, setRespRegistrada] = useState(false);
  const sugerida = RESPUESTAS_GUARDADAS.find((r) => r.categoria.toLowerCase().includes(c?.motivo?.toLowerCase().split(" ")[0]) || r.titulo.toLowerCase().includes(c?.motivo?.toLowerCase().split(" ")[0])) || RESPUESTAS_GUARDADAS[0];

  if (!c) return null;

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#8B7E74", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        {Icons.back} Volver a consultas
      </button>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#3D3530", marginBottom: 20 }}>Detalle de consulta</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
        <Card style={{ flex: "1 1 340px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9B9088", textTransform: "uppercase", marginBottom: 8 }}>Mensaje recibido</div>
          <div style={{ fontSize: 14, color: "#3D3530", lineHeight: 1.6, marginBottom: 16, background: "#FAF7F2", padding: 14, borderRadius: 10 }}>{c.mensaje}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 13, color: "#6B5E53", marginBottom: 16 }}>
            <span>{canalIcon(c.canal)} {c.canal}</span>
            <span>· {formatFecha(c.fecha)}</span>
            <Badge bg={estadoColor(c.estado).bg} color={estadoColor(c.estado).text}>{c.estado}</Badge>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9B9088", textTransform: "uppercase", marginBottom: 8, marginTop: 8 }}>Respuesta sugerida</div>
          <Card style={{ background: "#F8F5FF", border: "1px solid #E8E0F5" }}>
            <div style={{ fontSize: 12, color: "#7C6FA0", fontWeight: 600, marginBottom: 4 }}>{sugerida.titulo}</div>
            <div style={{ fontSize: 13, color: "#5A4F45", lineHeight: 1.55 }}>{sugerida.texto}</div>
          </Card>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9B9088", textTransform: "uppercase", marginBottom: 8 }}>Nota interna (opcional)</div>
            {/* TODO: Sanitizar antes de guardar en backend */}
            <textarea
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Escribir nota interna..."
              rows={3}
              style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #E0D9CF", fontSize: 13, resize: "vertical", background: "#FFFDF9", outline: "none", boxSizing: "border-box", fontFamily: "inherit", color: "#3D3530" }}
            />
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
            {/* TODO: Enviar a backend seguro con token de sesión */}
            <Btn onClick={() => setRespRegistrada(true)} variant="primary">
              {respRegistrada ? "✓ Respuesta registrada" : "Registrar respuesta"}
            </Btn>
          </div>
        </Card>
        <Card style={{ flex: "0 1 260px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9B9088", textTransform: "uppercase", marginBottom: 12 }}>Persona / Familia</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#3D3530", marginBottom: 4 }}>{p?.nombre}</div>
          <div style={{ fontSize: 13, color: "#8B7E74", marginBottom: 2 }}>DNI: {p?.dni}</div>
          {p?.edad && <div style={{ fontSize: 13, color: "#8B7E74", marginBottom: 2 }}>Edad: {p.edad} años</div>}
          {p?.esMenor && <div style={{ fontSize: 12, color: "#C2956B", fontWeight: 500, marginBottom: 2 }}>👤 Tutor/a: {p.tutor}</div>}
          <div style={{ fontSize: 13, color: "#8B7E74", marginBottom: 2 }}>Patología: {p?.patologia}</div>
          <div style={{ fontSize: 13, color: "#8B7E74", marginBottom: 2 }}>Cobertura: {p?.cobertura}</div>
          <div style={{ fontSize: 13, color: "#8B7E74" }}>Motivo: {c.motivo}</div>
        </Card>
      </div>
    </div>
  );
}

function PersonasScreen({ onSelect }) {
  const [filtro, setFiltro] = useState("");
  const filtered = PERSONAS.filter((p) => {
    const txt = `${p.nombre} ${p.dni} ${p.patologia} ${p.cobertura}`.toLowerCase();
    return txt.includes(filtro.toLowerCase());
  });

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#3D3530", marginBottom: 20 }}>Personas / Familias</h2>
      <div style={{ position: "relative", marginBottom: 20, maxWidth: 360 }}>
        <span style={{ position: "absolute", left: 12, top: 10, color: "#B0A89E" }}>{Icons.search}</span>
        <input
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          placeholder="Buscar por nombre, patología, cobertura..."
          style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: "1px solid #E0D9CF", fontSize: 13, background: "#FFFDF9", outline: "none", boxSizing: "border-box", color: "#3D3530" }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((p) => (
          <Card key={p.id} hover onClick={() => onSelect(p.id)} style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 14, padding: "16px 20px", cursor: "pointer" }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #E8DFD5, #D4C4B0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 600, color: "#8B7E74", flexShrink: 0 }}>
              {p.nombre.charAt(0)}
            </div>
            <div style={{ flex: "1 1 150px", minWidth: 120 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#3D3530" }}>{p.nombre}</div>
              <div style={{ fontSize: 12, color: "#9B9088" }}>{p.dni}{p.edad ? ` · ${p.edad} años` : ""}</div>
            </div>
            <div style={{ flex: "0 1 180px", fontSize: 13, color: p.patologia === "Sin diagnóstico" ? "#B0A89E" : "#6B5E53", fontStyle: p.patologia === "Sin diagnóstico" ? "italic" : "normal" }}>{p.patologia}</div>
            <div style={{ flex: "0 1 130px", fontSize: 13, color: "#8B7E74" }}>{p.cobertura}</div>
            <div style={{ flex: "0 1 100px", fontSize: 12, color: "#9B9088" }}>{formatFecha(p.ultimoContacto)}</div>
            {p.esMenor && <Badge bg="#FEF3C7" color="#92400E">Menor</Badge>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function PerfilScreen({ personaId, onBack }) {
  const p = PERSONAS.find((x) => x.id === personaId);
  const timeline = TIMELINES[personaId] || [];
  if (!p) return null;

  return (
    <div>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: "#8B7E74", fontSize: 13, cursor: "pointer", marginBottom: 16, padding: 0 }}>
        {Icons.back} Volver a personas
      </button>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <Card style={{ flex: "1 1 300px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #D4C4B0, #C2956B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 700, color: "#fff" }}>
              {p.nombre.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#3D3530" }}>{p.nombre}</div>
              {p.esMenor && <div style={{ fontSize: 12, color: "#C2956B", fontWeight: 500 }}>👤 Tutor/a: {p.tutor}</div>}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", fontSize: 13 }}>
            <div><span style={{ color: "#9B9088" }}>DNI:</span> <span style={{ color: "#3D3530" }}>{p.dni}</span></div>
            {p.edad && <div><span style={{ color: "#9B9088" }}>Edad:</span> <span style={{ color: "#3D3530" }}>{p.edad} años</span></div>}
            <div><span style={{ color: "#9B9088" }}>Patología:</span> <span style={{ color: p.patologia === "Sin diagnóstico" ? "#B0A89E" : "#3D3530", fontStyle: p.patologia === "Sin diagnóstico" ? "italic" : "normal" }}>{p.patologia}</span></div>
            <div><span style={{ color: "#9B9088" }}>Cobertura:</span> <span style={{ color: "#3D3530" }}>{p.cobertura}</span></div>
            <div style={{ gridColumn: "span 2" }}><span style={{ color: "#9B9088" }}>Último contacto:</span> <span style={{ color: "#3D3530" }}>{formatFecha(p.ultimoContacto)}</span></div>
          </div>
        </Card>
        <Card style={{ flex: "1 1 300px" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#9B9088", textTransform: "uppercase", marginBottom: 8 }}>Resumen</div>
          <div style={{ fontSize: 14, color: "#5A4F45", lineHeight: 1.65 }}>{p.resumen}</div>
        </Card>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#3D3530", marginBottom: 16 }}>Historial de acompañamiento</h3>
      {timeline.length === 0 ? (
        <Card><div style={{ fontSize: 13, color: "#9B9088", padding: 10 }}>Sin eventos registrados aún.</div></Card>
      ) : (
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div style={{ position: "absolute", left: 9, top: 8, bottom: 8, width: 2, background: "#E8E0D8", borderRadius: 2 }} />
          {timeline.map((ev, i) => {
            const ts = tipoTimelineStyle(ev.tipo);
            return (
              <div key={i} style={{ position: "relative", marginBottom: 16 }}>
                <div style={{ position: "absolute", left: -22, top: 4, width: 18, height: 18, borderRadius: "50%", background: "#FFFDF9", border: `2px solid ${ts.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>
                  {ts.icon}
                </div>
                <Card style={{ padding: "14px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: ts.color, textTransform: "uppercase" }}>{ts.label}</span>
                    <span style={{ fontSize: 11, color: "#B0A89E" }}>{formatFecha(ev.fecha)}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#5A4F45", lineHeight: 1.5 }}>{ev.texto}</div>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function RespuestasScreen() {
  const [catFiltro, setCatFiltro] = useState("Todas");
  const categorias = ["Todas", ...new Set(RESPUESTAS_GUARDADAS.map((r) => r.categoria))];
  const filtered = catFiltro === "Todas" ? RESPUESTAS_GUARDADAS : RESPUESTAS_GUARDADAS.filter((r) => r.categoria === catFiltro);
  const [copiedId, setCopiedId] = useState(null);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#3D3530", marginBottom: 20 }}>Respuestas guardadas</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCatFiltro(cat)}
            style={{
              padding: "6px 14px", borderRadius: 20, border: catFiltro === cat ? "1.5px solid #C2956B" : "1px solid #E0D9CF",
              background: catFiltro === cat ? "#FAF0E6" : "transparent", color: catFiltro === cat ? "#C2956B" : "#8B7E74",
              fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all 0.15s",
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((r) => (
          <Card key={r.id} style={{ padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Badge bg="#F5EDE4" color="#8B7E74">{r.categoria}</Badge>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#3D3530" }}>{r.titulo}</span>
            </div>
            <div style={{ fontSize: 13, color: "#5A4F45", lineHeight: 1.6, marginBottom: 10 }}>{r.texto}</div>
            <Btn variant="ghost" onClick={() => { navigator.clipboard?.writeText(r.texto); setCopiedId(r.id); setTimeout(() => setCopiedId(null), 1500); }}>
              {copiedId === r.id ? "✓ Copiada" : "Copiar respuesta"}
            </Btn>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ReporteScreen() {
  const porCanal = {};
  CANALES.forEach((c) => { porCanal[c] = CONSULTAS.filter((x) => x.canal === c).length; });
  const porEstado = {};
  ESTADOS.forEach((e) => { porEstado[e] = CONSULTAS.filter((x) => x.estado === e).length; });
  const porMotivo = {};
  CONSULTAS.forEach((c) => { porMotivo[c.motivo] = (porMotivo[c.motivo] || 0) + 1; });
  const porPatologia = {};
  CONSULTAS.forEach((c) => {
    const p = PERSONAS.find((x) => x.id === c.personaId);
    const pat = p?.patologia || "Sin diagnóstico";
    porPatologia[pat] = (porPatologia[pat] || 0) + 1;
  });

  const maxCanal = Math.max(...Object.values(porCanal), 1);
  const maxMotivo = Math.max(...Object.values(porMotivo), 1);

  const [resumen, setResumen] = useState(false);

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#3D3530", marginBottom: 20 }}>Reporte básico</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <Card style={{ flex: "1 1 300px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 14 }}>Consultas por canal</div>
          {Object.entries(porCanal).map(([canal, n]) => (
            <div key={canal} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B5E53", marginBottom: 3 }}>
                <span>{canalIcon(canal)} {canal}</span><span style={{ fontWeight: 600 }}>{n}</span>
              </div>
              <div style={{ height: 8, background: "#F0EBE3", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(n / maxCanal) * 100}%`, background: "linear-gradient(90deg, #C2956B, #D4A574)", borderRadius: 4, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ flex: "1 1 300px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 14 }}>Motivos más frecuentes</div>
          {Object.entries(porMotivo).sort((a, b) => b[1] - a[1]).map(([motivo, n]) => (
            <div key={motivo} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#6B5E53", marginBottom: 3 }}>
                <span>{motivo}</span><span style={{ fontWeight: 600 }}>{n}</span>
              </div>
              <div style={{ height: 8, background: "#F0EBE3", borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(n / maxMotivo) * 100}%`, background: "linear-gradient(90deg, #7C6FA0, #9B8DC4)", borderRadius: 4, transition: "width 0.5s" }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
        <Card style={{ flex: "1 1 300px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 14 }}>Patologías mencionadas</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(porPatologia).sort((a, b) => b[1] - a[1]).map(([pat, n]) => (
              <Badge key={pat} bg={pat === "Sin diagnóstico" ? "#F0EBE3" : "#FAF0E6"} color={pat === "Sin diagnóstico" ? "#9B9088" : "#8B7E74"}>
                {pat} ({n})
              </Badge>
            ))}
          </div>
        </Card>
        <Card style={{ flex: "1 1 300px" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 14 }}>Consultas por estado</div>
          <div style={{ display: "flex", gap: 16 }}>
            {Object.entries(porEstado).map(([estado, n]) => {
              const ec = estadoColor(estado);
              return (
                <div key={estado} style={{ textAlign: "center", flex: 1 }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: ec.text }}>{n}</div>
                  <Badge bg={ec.bg} color={ec.text}>{estado}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Btn variant="primary" onClick={() => setResumen(true)}>
        {resumen ? "✓ Resumen preparado" : "📋 Preparar resumen"}
      </Btn>
      {resumen && (
        <Card style={{ marginTop: 16, background: "#F8F5FF", border: "1px solid #E8E0F5" }}>
          <div style={{ fontSize: 13, color: "#5A4F45", lineHeight: 1.6 }}>
            <strong>Resumen generado:</strong> Se registraron {CONSULTAS.length} consultas de {PERSONAS.length} personas/familias.
            Los canales más activos son WhatsApp ({porCanal.WhatsApp}) y Facebook ({porCanal.Facebook}).
            El motivo principal es "{Object.entries(porMotivo).sort((a, b) => b[1] - a[1])[0][0]}" con {Object.entries(porMotivo).sort((a, b) => b[1] - a[1])[0][1]} consultas.
            Hay {porEstado.Nueva} consultas pendientes de respuesta.
            {/* TODO: En producción, generar PDF real con datos actualizados desde backend */}
          </div>
        </Card>
      )}
    </div>
  );
}

function ConfigScreen() {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#3D3530", marginBottom: 20 }}>Configuración</h2>
      <Card style={{ maxWidth: 520, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 12 }}>Organización</div>
        <div style={{ fontSize: 13, color: "#6B5E53", lineHeight: 1.8 }}>
          <div><span style={{ color: "#9B9088" }}>Nombre:</span> AUNA (Demo)</div>
          <div><span style={{ color: "#9B9088" }}>Plan:</span> MVP / Evaluación</div>
          <div><span style={{ color: "#9B9088" }}>Versión:</span> 0.1.0</div>
        </div>
      </Card>
      <Card style={{ maxWidth: 520, background: "#FAF7F2" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#5A4F45", marginBottom: 8 }}>Próximos pasos</div>
        <div style={{ fontSize: 13, color: "#6B5E53", lineHeight: 1.8 }}>
          {/* TODO: Estas funcionalidades se implementarán con backend seguro */}
          <div>🔐 Autenticación segura (OAuth 2.0)</div>
          <div>👥 Roles y permisos por usuario</div>
          <div>🏢 Aislamiento de datos por organización</div>
          <div>🔒 Cifrado de datos sensibles</div>
          <div>📋 Consentimiento informado digital</div>
          <div>📊 Exportación de reportes en PDF</div>
          <div>🔗 Integración con canales reales</div>
        </div>
      </Card>
    </div>
  );
}

// ── APP PRINCIPAL ──────────────────────────────────────

const NAV_ITEMS = [
  { key: "panel", label: "Panel", icon: Icons.panel },
  { key: "consultas", label: "Consultas", icon: Icons.consultas },
  { key: "personas", label: "Personas / Familias", icon: Icons.personas },
  { key: "respuestas", label: "Respuestas guardadas", icon: Icons.respuestas },
  { key: "reporte", label: "Reporte básico", icon: Icons.reporte },
  { key: "config", label: "Configuración", icon: Icons.config },
];

export default function App() {
  const [screen, setScreen] = useState("panel");
  const [selectedConsulta, setSelectedConsulta] = useState(null);
  const [selectedPersona, setSelectedPersona] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = (s) => {
    setScreen(s);
    setSelectedConsulta(null);
    setSelectedPersona(null);
    setSidebarOpen(false);
  };

  const renderScreen = () => {
    if (screen === "consultas" && selectedConsulta) return <DetalleConsultaScreen consultaId={selectedConsulta} onBack={() => setSelectedConsulta(null)} />;
    if (screen === "consultas") return <ConsultasScreen onSelect={setSelectedConsulta} />;
    if (screen === "personas" && selectedPersona) return <PerfilScreen personaId={selectedPersona} onBack={() => setSelectedPersona(null)} />;
    if (screen === "personas") return <PersonasScreen onSelect={setSelectedPersona} />;
    if (screen === "respuestas") return <RespuestasScreen />;
    if (screen === "reporte") return <ReporteScreen />;
    if (screen === "config") return <ConfigScreen />;
    return <PanelScreen />;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans', 'Nunito', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#F5F0E8", color: "#3D3530" }}>
      {/* Overlay mobile */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 40 }} />}

      {/* Sidebar */}
      <aside style={{
        width: 240, background: "#FFFDF9", borderRight: "1px solid #E8E0D8", display: "flex", flexDirection: "column",
        padding: "24px 0", position: "fixed", top: 0, bottom: 0, left: sidebarOpen ? 0 : -260, zIndex: 50,
        transition: "left 0.25s ease",
        ...(typeof window !== "undefined" && window.innerWidth > 768 ? { position: "sticky", left: 0 } : {}),
      }}>
        <div style={{ padding: "0 24px 28px", borderBottom: "1px solid #F0EBE3" }}>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>
            <span style={{ color: "#C2956B" }}>AU</span><span style={{ color: "#7C6FA0" }}>NA</span>
          </div>
          <div style={{ fontSize: 11, color: "#B0A89E", marginTop: 2 }}>Acompañamiento organizado</div>
        </div>
        <nav style={{ flex: 1, padding: "12px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const active = screen === item.key;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px",
                  borderRadius: 10, border: "none", background: active ? "#FAF0E6" : "transparent",
                  color: active ? "#C2956B" : "#8B7E74", fontSize: 13, fontWeight: active ? 600 : 400,
                  cursor: "pointer", transition: "all 0.15s", marginBottom: 2, textAlign: "left",
                }}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #F0EBE3", fontSize: 11, color: "#B0A89E" }}>
          {/* TODO: Reemplazar con usuario autenticado */}
          Demo · v0.1.0
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {/* Mobile header */}
        <div style={{ display: "none", padding: "12px 16px", background: "#FFFDF9", borderBottom: "1px solid #E8E0D8", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 30,
          ...(typeof window !== "undefined" && window.innerWidth <= 768 ? { display: "flex" } : {}),
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", padding: 0, color: "#8B7E74" }}>☰</button>
          <span style={{ fontSize: 18, fontWeight: 700 }}><span style={{ color: "#C2956B" }}>AU</span><span style={{ color: "#7C6FA0" }}>NA</span></span>
        </div>
        <div style={{ padding: "28px 32px", maxWidth: 960 }}>
          {renderScreen()}
        </div>
      </main>
    </div>
  );
}
