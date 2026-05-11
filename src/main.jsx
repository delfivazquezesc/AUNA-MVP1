import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity,
  Archive,
  BookOpen,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartHandshake,
  Home,
  Inbox,
  LayoutDashboard,
  Lock,
  MessageCircle,
  NotebookText,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  UsersRound,
} from 'lucide-react';
import './styles.css';

/*
  AUNA MVP - Frontend/demo sin backend.

  Seguridad desde el diseño:
  - No usar datos reales en esta demo.
  - No incluir secretos, claves ni tokens en frontend.
  - La autenticación, autorización, cifrado en reposo y multi-tenancy deben implementarse en backend.
  - En producción: usar HTTPS/TLS, hash + salt para contraseñas, validación y sanitización server-side,
    control de acceso por organización, auditoría sin datos sensibles y consentimiento informado.
  - Tener en cuenta OWASP Top 10 vigente y Ley 25.326 de Protección de Datos Personales.
*/

const pacientes = [
  {
    id: 1,
    nombre: 'Martina Salas',
    dni: '44.921.230',
    edad: 8,
    patologia: 'Enfermedad de Hirschsprung',
    cobertura: 'OSDE',
    contacto: 'Madre: Laura Salas',
    ultimoContacto: 'Hoy',
    resumen: 'Familia incorporada recientemente. Consulta principal vinculada a orientación postquirúrgica y búsqueda de centro especializado.',
  },
  {
    id: 2,
    nombre: 'Tomás Aguirre',
    dni: '52.103.018',
    edad: 4,
    patologia: 'Malformación anorectal',
    cobertura: 'Hospital público',
    contacto: 'Padre: Diego Aguirre',
    ultimoContacto: 'Ayer',
    resumen: 'Caso pediátrico con necesidad de orientación sobre cirujanos y controles de seguimiento.',
  },
  {
    id: 3,
    nombre: 'Camila Ruiz',
    dni: '39.114.700',
    edad: 29,
    patologia: 'Sin diagnóstico',
    cobertura: 'Swiss Medical',
    contacto: 'camila.ruiz@email.com',
    ultimoContacto: 'Hace 2 días',
    resumen: 'Consulta por síntomas persistentes y dificultad para encontrar especialista de referencia.',
  },
  {
    id: 4,
    nombre: 'Joaquín Pérez',
    dni: '50.318.992',
    edad: 6,
    patologia: 'Síndrome de intestino corto',
    cobertura: 'IOMA',
    contacto: 'Madre: Natalia Pérez',
    ultimoContacto: 'Hace 4 días',
    resumen: 'Familia con barreras de cobertura para insumos y turnos de seguimiento.',
  },
  {
    id: 5,
    nombre: 'Valeria Méndez',
    dni: '34.880.121',
    edad: 38,
    patologia: 'Acondroplasia',
    cobertura: 'Galeno',
    contacto: 'valeria.mendez@email.com',
    ultimoContacto: 'Hace 1 semana',
    resumen: 'Solicita orientación general y contacto con organización específica.',
  },
  {
    id: 6,
    nombre: 'Sofía Herrera',
    dni: '47.903.210',
    edad: 15,
    patologia: 'Enfermedad de Crohn',
    cobertura: 'Medifé',
    contacto: 'Tutor: Andrea Herrera',
    ultimoContacto: 'Hace 1 semana',
    resumen: 'Adolescente con consulta sobre continuidad de tratamiento y cobertura.',
  },
  {
    id: 7,
    nombre: 'Ramiro Núñez',
    dni: '41.562.884',
    edad: 31,
    patologia: 'Sin diagnóstico',
    cobertura: 'Particular',
    contacto: 'ramiro.nunez@email.com',
    ultimoContacto: 'Hace 10 días',
    resumen: 'Busca orientación para iniciar recorrido diagnóstico.',
  },
  {
    id: 8,
    nombre: 'Elena Morales',
    dni: '28.412.667',
    edad: 52,
    patologia: 'Déficit de alfa-1 antitripsina',
    cobertura: 'PAMI',
    contacto: 'elena.morales@email.com',
    ultimoContacto: 'Hace 12 días',
    resumen: 'Consulta por información confiable y derivación a especialistas.',
  },
  {
    id: 9,
    nombre: 'Bruno Castro',
    dni: '51.009.312',
    edad: 7,
    patologia: 'Síndrome genético en estudio',
    cobertura: 'Sancor Salud',
    contacto: 'Madre: Jimena Castro',
    ultimoContacto: 'Hace 15 días',
    resumen: 'Familia en búsqueda de orientación para estudios y segunda opinión médica.',
  },
  {
    id: 10,
    nombre: 'Ana Belén Ríos',
    dni: '36.790.908',
    edad: 35,
    patologia: 'Colitis ulcerosa',
    cobertura: 'Omint',
    contacto: 'ana.rios@email.com',
    ultimoContacto: 'Hace 18 días',
    resumen: 'Consulta administrativa sobre medicación y cambio de cobertura.',
  },
];

const consultas = [
  {
    id: 101,
    fecha: '11/05/2026',
    canal: 'Instagram',
    pacienteId: 1,
    motivo: 'Orientación postquirúrgica',
    patologia: 'Enfermedad de Hirschsprung',
    estado: 'Nueva',
    mensaje: 'Hola, mi hija fue operada y no sabemos con qué especialista seguir. ¿Tienen referencias?',
    respuesta: 'Podemos orientarte con información general y, si corresponde, acercarte datos de organizaciones o centros de referencia. No reemplazamos la consulta médica.',
  },
  {
    id: 102,
    fecha: '10/05/2026',
    canal: 'WhatsApp',
    pacienteId: 2,
    motivo: 'Búsqueda de cirujano',
    patologia: 'Malformación anorectal',
    estado: 'Respondida',
    mensaje: 'Necesitamos saber qué hospitales tienen experiencia en esta malformación.',
    respuesta: 'Te compartimos una respuesta orientativa y recomendamos validar siempre con el equipo tratante.',
  },
  {
    id: 103,
    fecha: '09/05/2026',
    canal: 'Mail',
    pacienteId: 3,
    motivo: 'Sin diagnóstico',
    patologia: 'Sin diagnóstico',
    estado: 'Nueva',
    mensaje: 'Tengo síntomas hace años y no sé a qué especialista recurrir.',
    respuesta: 'Podemos ayudarte a ordenar la información inicial para orientar la búsqueda de especialistas adecuados.',
  },
  {
    id: 104,
    fecha: '07/05/2026',
    canal: 'Facebook',
    pacienteId: 4,
    motivo: 'Cobertura de insumos',
    patologia: 'Síndrome de intestino corto',
    estado: 'Respondida',
    mensaje: 'La obra social demora la autorización de insumos.',
    respuesta: 'Te sugerimos reunir indicación médica, negativa o demora por escrito y documentación respaldatoria para evaluar próximos pasos.',
  },
  {
    id: 105,
    fecha: '06/05/2026',
    canal: 'Manual',
    pacienteId: 5,
    motivo: 'Derivación a organización',
    patologia: 'Acondroplasia',
    estado: 'Archivada',
    mensaje: 'Necesito conectar con una asociación de pacientes.',
    respuesta: 'Se compartió contacto institucional de referencia y materiales informativos generales.',
  },
  {
    id: 106,
    fecha: '05/05/2026',
    canal: 'Instagram',
    pacienteId: 6,
    motivo: 'Continuidad de tratamiento',
    patologia: 'Enfermedad de Crohn',
    estado: 'Respondida',
    mensaje: 'Mi prepaga cambió la cartilla y no consigo turno con mi médica.',
    respuesta: 'Registramos la situación como barrera de continuidad de cuidado y enviamos orientación general sobre documentación.',
  },
];

const respuestasGuardadas = [
  {
    categoria: 'Orientación general',
    titulo: 'Primera respuesta a familia',
    texto: 'Gracias por escribirnos. Para poder orientarte mejor, necesitamos conocer diagnóstico, edad, provincia, cobertura de salud y principal dificultad actual. La información compartida será tratada con confidencialidad.',
  },
  {
    categoria: 'Cobertura / obra social',
    titulo: 'Solicitud de documentación',
    texto: 'Para analizar una barrera de cobertura, sugerimos reunir indicación médica, presupuesto, negativa o demora por escrito, credencial y documentación clínica respaldatoria.',
  },
  {
    categoria: 'Derivación a organización',
    titulo: 'Conexión con organización',
    texto: 'Podemos acercarte información de organizaciones vinculadas a la patología mencionada. Antes de compartir datos de contacto, solicitaremos consentimiento.',
  },
  {
    categoria: 'Documentación',
    titulo: 'Carga de datos básicos',
    texto: 'Para mantener un registro ordenado y poder dar seguimiento, te pedimos completar los datos básicos de contacto, provincia, cobertura y motivo de consulta.',
  },
  {
    categoria: 'Consulta legal',
    titulo: 'Orientación no jurídica',
    texto: 'Desde la organización podemos brindar orientación general y acompañamiento, pero no reemplazamos asesoramiento jurídico profesional.',
  },
  {
    categoria: 'Sin diagnóstico',
    titulo: 'Orientación inicial',
    texto: 'Cuando aún no hay diagnóstico, recomendamos ordenar síntomas, estudios realizados, especialistas consultados y tiempos de evolución para facilitar la próxima consulta médica.',
  },
];

const eventos = [
  { pacienteId: 1, fecha: 'Hoy', tipo: 'Consulta registrada', detalle: 'Ingresó consulta por Instagram sobre seguimiento postquirúrgico.' },
  { pacienteId: 1, fecha: 'Hoy', tipo: 'Nota interna', detalle: 'La familia solicita referencia de centro especializado en CABA.' },
  { pacienteId: 1, fecha: 'Hoy', tipo: 'Respuesta enviada', detalle: 'Se envió respuesta de orientación general y solicitud de datos básicos.' },
  { pacienteId: 2, fecha: 'Ayer', tipo: 'Consulta registrada', detalle: 'Consulta sobre cirujanos y centros con experiencia.' },
  { pacienteId: 2, fecha: 'Ayer', tipo: 'Médico mencionado', detalle: 'La familia mencionó seguimiento previo con cirujano pediátrico.' },
  { pacienteId: 3, fecha: 'Hace 2 días', tipo: 'Consulta registrada', detalle: 'Persona adulta sin diagnóstico solicita orientación inicial.' },
  { pacienteId: 3, fecha: 'Hace 2 días', tipo: 'Nota interna', detalle: 'Se recomienda ordenar trayectoria y estudios previos para próxima consulta médica.' },
  { pacienteId: 4, fecha: 'Hace 4 días', tipo: 'Documento mencionado', detalle: 'La familia indica contar con prescripción e historia clínica resumida.' },
  { pacienteId: 6, fecha: 'Hace 1 semana', tipo: 'Respuesta enviada', detalle: 'Se envió orientación sobre continuidad de tratamiento y documentación respaldatoria.' },
];

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

function App() {
  const [vista, setVista] = useState('panel');
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(consultas[0]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(pacientes[0]);

  const pacienteDeConsulta = pacientes.find((p) => p.id === consultaSeleccionada?.pacienteId);

  return (
    <div className="min-h-screen bg-[#F7F0E8] text-[#2E2925]">
      <div className="flex min-h-screen">
        <BarraLateral vista={vista} setVista={setVista} />
        <main className="flex-1 p-6 lg:p-8">
          <Encabezado />
          {vista === 'panel' && <Panel setVista={setVista} />}
          {vista === 'consultas' && (
            <Consultas
              consultas={consultas}
              pacientes={pacientes}
              setConsultaSeleccionada={setConsultaSeleccionada}
              setPacienteSeleccionado={setPacienteSeleccionado}
              setVista={setVista}
            />
          )}
          {vista === 'detalleConsulta' && (
            <DetalleConsulta consulta={consultaSeleccionada} paciente={pacienteDeConsulta} setVista={setVista} />
          )}
          {vista === 'pacientes' && (
            <Pacientes pacientes={pacientes} setPacienteSeleccionado={setPacienteSeleccionado} setVista={setVista} />
          )}
          {vista === 'perfilPaciente' && <PerfilPaciente paciente={pacienteSeleccionado} setVista={setVista} />}
          {vista === 'respuestas' && <RespuestasGuardadas />}
          {vista === 'reporte' && <ReporteBasico />}
          {vista === 'configuracion' && <Configuracion />}
        </main>
      </div>
    </div>
  );
}

function BarraLateral({ vista, setVista }) {
  const items = [
    ['panel', 'Panel', LayoutDashboard],
    ['consultas', 'Consultas', Inbox],
    ['pacientes', 'Personas / Familias', UsersRound],
    ['respuestas', 'Respuestas guardadas', BookOpen],
    ['reporte', 'Reporte básico', FileText],
    ['configuracion', 'Configuración', Settings],
  ];

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/70 bg-white/65 p-5 backdrop-blur-xl lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C86E55] via-[#D99C79] to-[#7D5BBE] text-white shadow-soft">
          <HeartHandshake size={22} />
        </div>
        <div>
          <div className="text-xl font-black tracking-tight text-[#2E2925]">AUNA</div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8B7666]">Claridad orgánica</div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map(([id, label, Icon]) => (
          <button
            key={id}
            onClick={() => setVista(id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition',
              vista === id || (id === 'consultas' && vista === 'detalleConsulta') || (id === 'pacientes' && vista === 'perfilPaciente')
                ? 'bg-[#2E2925] text-white shadow-soft'
                : 'text-[#66594F] hover:bg-white hover:text-[#2E2925]'
            )}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-8 rounded-3xl border border-white bg-[#F6E4D8] p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-black text-[#6D3D33]">
          <ShieldCheck size={17} /> Seguridad desde el diseño
        </div>
        <p className="text-xs leading-relaxed text-[#7D6659]">
          Demo sin datos reales. Preparada para autenticación, roles, aislamiento por organización y consentimiento.
        </p>
      </div>
    </aside>
  );
}

function Encabezado() {
  return (
    <header className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="mb-1 text-sm font-bold text-[#9A6657]">Sistema operativo de consultas</p>
        <h1 className="text-3xl font-black tracking-tight text-[#2E2925] md:text-4xl">Acompañamiento organizado, sin perder lo humano.</h1>
      </div>
      <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-sm font-bold text-[#5D5047] shadow-soft">
        <Lock size={17} className="text-[#7D5BBE]" /> Demo con datos sintéticos
      </div>
    </header>
  );
}

function TarjetaMetrica({ icon: Icon, titulo, valor, detalle }) {
  return (
    <div className="flex min-h-[142px] flex-col justify-between rounded-3xl border border-white bg-white/75 p-5 shadow-soft backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div className="min-h-[42px] text-sm font-extrabold leading-snug text-[#6B5C51]">{titulo}</div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F0DDD2] text-[#B86650]">
          <Icon size={19} />
        </div>
      </div>
      <div>
        <div className="font-tabular text-4xl font-black tracking-tight text-[#2E2925]">{valor}</div>
        <div className="mt-1 text-xs font-semibold text-[#8C7A6D]">{detalle}</div>
      </div>
    </div>
  );
}

function Panel({ setVista }) {
  const motivos = [
    ['Orientación general', 26],
    ['Cobertura / obra social', 18],
    ['Sin diagnóstico', 12],
    ['Derivación a organización', 9],
  ];

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TarjetaMetrica icon={ClipboardList} titulo="Consultas totales" valor="84" detalle="registradas este año" />
        <TarjetaMetrica icon={MessageCircle} titulo="Consultas nuevas" valor="12" detalle="pendientes de respuesta" />
        <TarjetaMetrica icon={Archive} titulo="Consultas respondidas" valor="61" detalle="con trazabilidad" />
        <TarjetaMetrica icon={UsersRound} titulo="Personas / familias registradas" valor="48" detalle="base activa" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black">Motivos frecuentes</h2>
              <p className="text-sm font-medium text-[#8C7A6D]">Lo que más se está consultando últimamente.</p>
            </div>
            <Sparkles className="text-[#7D5BBE]" />
          </div>
          <div className="space-y-4">
            {motivos.map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm font-bold">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className="h-3 rounded-full bg-[#F0E2D8]">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-[#C86E55] to-[#7D5BBE]"
                    style={{ width: `${Math.min(value * 3, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white bg-[#2E2925] p-6 text-white shadow-soft">
          <h2 className="mb-2 text-xl font-black">Actividad reciente</h2>
          <p className="mb-5 text-sm font-medium text-white/65">Últimas interacciones registradas.</p>
          <div className="space-y-3">
            {consultas.slice(0, 4).map((c) => (
              <button
                key={c.id}
                onClick={() => setVista('consultas')}
                className="flex w-full items-center justify-between rounded-2xl bg-white/10 p-3 text-left transition hover:bg-white/15"
              >
                <div>
                  <div className="text-sm font-extrabold">{c.motivo}</div>
                  <div className="text-xs text-white/60">{c.canal} · {c.fecha}</div>
                </div>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Estado({ estado }) {
  const styles = {
    Nueva: 'bg-[#F6E4D8] text-[#A6533E]',
    Respondida: 'bg-[#E6F1E8] text-[#3F7B53]',
    Archivada: 'bg-[#ECE7F7] text-[#6C4BA0]',
  };
  return <span className={cn('whitespace-nowrap rounded-full px-3 py-1 text-xs font-black', styles[estado])}>{estado}</span>;
}

function Consultas({ consultas, pacientes, setConsultaSeleccionada, setPacienteSeleccionado, setVista }) {
  return (
    <section className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
      <SeccionTitulo icon={Inbox} titulo="Consultas" subtitulo="Registro simple de consultas recibidas por distintos canales." />
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#F7F0E8] px-4 py-3">
        <Search size={18} className="text-[#9A6657]" />
        <span className="text-sm font-semibold text-[#7B6B60]">Buscar por nombre, motivo, patología o canal</span>
      </div>
      <div className="overflow-hidden rounded-2xl border border-[#EFE3DA]">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#F4E8DE] text-xs uppercase tracking-[0.08em] text-[#7B6B60]">
            <tr>
              <th className="p-4">Fecha</th>
              <th className="p-4">Canal</th>
              <th className="p-4">Persona / familia</th>
              <th className="p-4">Motivo</th>
              <th className="p-4">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {consultas.map((c) => {
              const p = pacientes.find((x) => x.id === c.pacienteId);
              return (
                <tr key={c.id} className="border-t border-[#EFE3DA] bg-white/60">
                  <td className="p-4 font-bold">{c.fecha}</td>
                  <td className="p-4">{c.canal}</td>
                  <td className="p-4 font-bold">{p?.nombre}</td>
                  <td className="p-4">{c.motivo}</td>
                  <td className="p-4"><Estado estado={c.estado} /></td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setConsultaSeleccionada(c);
                        setPacienteSeleccionado(p);
                        setVista('detalleConsulta');
                      }}
                      className="rounded-xl bg-[#2E2925] px-3 py-2 text-xs font-black text-white"
                    >
                      Ver detalle
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DetalleConsulta({ consulta, paciente, setVista }) {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.85fr]">
      <div className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
        <button onClick={() => setVista('consultas')} className="mb-4 text-sm font-black text-[#A6533E]">← Volver a consultas</button>
        <SeccionTitulo icon={MessageCircle} titulo="Detalle de consulta" subtitulo="Mensaje recibido, datos asociados y respuesta registrada." />
        <div className="space-y-4">
          <BloqueDato label="Canal" value={consulta.canal} />
          <BloqueDato label="Motivo" value={consulta.motivo} />
          <BloqueDato label="Patología" value={consulta.patologia} />
          <BloqueDato label="Mensaje recibido" value={consulta.mensaje} large />
          <BloqueDato label="Nota interna" value="Se requiere verificar datos básicos antes de compartir derivaciones o contactos externos." large />
        </div>
      </div>
      <div className="space-y-6">
        <div className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
          <SeccionTitulo icon={UserRound} titulo="Persona / familia" subtitulo="Datos principales asociados a la consulta." small />
          <div className="space-y-3 text-sm">
            <BloqueDato label="Nombre" value={paciente?.nombre} />
            <BloqueDato label="Cobertura" value={paciente?.cobertura} />
            <BloqueDato label="Contacto" value={paciente?.contacto} />
          </div>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-[#F4DDD0] to-[#ECE2F7] p-6 shadow-soft">
          <h3 className="mb-2 text-lg font-black">Respuesta guardada sugerida</h3>
          <p className="mb-4 text-sm leading-relaxed text-[#5C5048]">{consulta.respuesta}</p>
          <button className="rounded-2xl bg-[#2E2925] px-4 py-3 text-sm font-black text-white">Registrar respuesta</button>
        </div>
      </div>
    </section>
  );
}

function Pacientes({ pacientes, setPacienteSeleccionado, setVista }) {
  return (
    <section className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
      <SeccionTitulo icon={UsersRound} titulo="Personas / Familias" subtitulo="Base simple para no perder datos ni depender de la memoria individual." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pacientes.map((p) => (
          <button
            key={p.id}
            onClick={() => {
              setPacienteSeleccionado(p);
              setVista('perfilPaciente');
            }}
            className="rounded-3xl border border-[#EFE3DA] bg-white/70 p-5 text-left transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-black">{p.nombre}</h3>
                <p className="text-sm font-semibold text-[#8C7A6D]">DNI {p.dni} · {p.edad} años</p>
              </div>
              <ChevronRight size={19} className="text-[#A6533E]" />
            </div>
            <div className="mb-3 rounded-2xl bg-[#F7F0E8] px-3 py-2 text-sm font-bold text-[#66594F]">{p.patologia}</div>
            <div className="text-sm text-[#7B6B60]">{p.cobertura}</div>
            <div className="mt-3 text-xs font-black uppercase tracking-[0.08em] text-[#9A6657]">Último contacto: {p.ultimoContacto}</div>
          </button>
        ))}
      </div>
    </section>
  );
}

function PerfilPaciente({ paciente, setVista }) {
  const timeline = eventos.filter((e) => e.pacienteId === paciente.id);
  return (
    <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
        <button onClick={() => setVista('pacientes')} className="mb-4 text-sm font-black text-[#A6533E]">← Volver a personas</button>
        <SeccionTitulo icon={UserRound} titulo={paciente.nombre} subtitulo="Perfil organizacional de la persona o familia." />
        <div className="space-y-3">
          <BloqueDato label="DNI / Identificador" value={paciente.dni} />
          <BloqueDato label="Edad" value={`${paciente.edad} años`} />
          <BloqueDato label="Patología" value={paciente.patologia} />
          <BloqueDato label="Cobertura" value={paciente.cobertura} />
          <BloqueDato label="Contacto" value={paciente.contacto} />
          <BloqueDato label="Resumen" value={paciente.resumen} large />
        </div>
      </div>

      <div className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
        <SeccionTitulo icon={Activity} titulo="Historial / Timeline" subtitulo="Recorrido organizacional construido a partir de consultas, respuestas y notas." />
        <div className="space-y-4">
          {timeline.length === 0 ? (
            <div className="rounded-2xl bg-[#F7F0E8] p-4 text-sm font-semibold text-[#7B6B60]">Aún no hay eventos registrados para esta persona.</div>
          ) : (
            timeline.map((e, i) => <EventoTimeline key={i} evento={e} />)
          )}
        </div>
      </div>
    </section>
  );
}

function EventoTimeline({ evento }) {
  const iconos = {
    'Consulta registrada': MessageCircle,
    'Respuesta enviada': ClipboardList,
    'Nota interna': NotebookText,
    'Documento mencionado': FileText,
    'Médico mencionado': UserRound,
  };
  const Icon = iconos[evento.tipo] || Activity;
  return (
    <div className="flex gap-4 rounded-3xl bg-[#F7F0E8] p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#7D5BBE] shadow-soft">
        <Icon size={19} />
      </div>
      <div>
        <div className="text-xs font-black uppercase tracking-[0.08em] text-[#9A6657]">{evento.fecha}</div>
        <div className="mt-1 font-black">{evento.tipo}</div>
        <div className="mt-1 text-sm leading-relaxed text-[#6B5C51]">{evento.detalle}</div>
      </div>
    </div>
  );
}

function RespuestasGuardadas() {
  return (
    <section className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
      <SeccionTitulo icon={BookOpen} titulo="Respuestas guardadas" subtitulo="Biblioteca de textos modelo para responder con coherencia y cuidado." />
      <div className="grid gap-4 md:grid-cols-2">
        {respuestasGuardadas.map((r) => (
          <div key={r.titulo} className="rounded-3xl border border-[#EFE3DA] bg-white/70 p-5">
            <div className="mb-2 text-xs font-black uppercase tracking-[0.08em] text-[#7D5BBE]">{r.categoria}</div>
            <h3 className="mb-2 text-lg font-black">{r.titulo}</h3>
            <p className="text-sm leading-relaxed text-[#6B5C51]">{r.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ReporteBasico() {
  const datos = [
    ['Instagram', 34],
    ['WhatsApp', 28],
    ['Mail', 18],
    ['Facebook', 12],
    ['Manual', 8],
  ];

  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
      <div className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
        <SeccionTitulo icon={FileText} titulo="Reporte básico" subtitulo="Resumen visual de la información cargada en la organización." />
        <div className="space-y-4">
          {datos.map(([label, value]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-sm font-bold"><span>{label}</span><span>{value}%</span></div>
              <div className="h-3 rounded-full bg-[#F0E2D8]">
                <div className="h-3 rounded-full bg-gradient-to-r from-[#C86E55] to-[#7D5BBE]" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl bg-[#2E2925] p-6 text-white shadow-soft">
        <h3 className="mb-2 text-xl font-black">Resumen mensual</h3>
        <p className="mb-5 text-sm leading-relaxed text-white/70">
          Este módulo permite preparar un resumen rápido de consultas, canales, motivos y patologías mencionadas. En esta demo no genera PDF real.
        </p>
        <div className="space-y-3 rounded-3xl bg-white/10 p-4">
          <div className="flex justify-between text-sm"><span>Motivo principal</span><strong>Cobertura / obra social</strong></div>
          <div className="flex justify-between text-sm"><span>Patología más frecuente</span><strong>Sin diagnóstico</strong></div>
          <div className="flex justify-between text-sm"><span>Canal más usado</span><strong>Instagram</strong></div>
        </div>
        <button className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#2E2925]">Preparar resumen</button>
      </div>
    </section>
  );
}

function Configuracion() {
  return (
    <section className="rounded-3xl border border-white bg-white/75 p-6 shadow-soft">
      <SeccionTitulo icon={Settings} titulo="Configuración" subtitulo="Estructura preparada para sumar seguridad real en una siguiente etapa." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-[#F7F0E8] p-5">
          <h3 className="mb-2 font-black">Autenticación segura</h3>
          <p className="text-sm leading-relaxed text-[#6B5C51]">Pendiente de backend: login, recuperación de cuenta, sesiones seguras y política de contraseñas.</p>
        </div>
        <div className="rounded-3xl bg-[#F7F0E8] p-5">
          <h3 className="mb-2 font-black">Roles y permisos</h3>
          <p className="text-sm leading-relaxed text-[#6B5C51]">Pendiente de backend: administrador, operador y auditoría por organización.</p>
        </div>
        <div className="rounded-3xl bg-[#F7F0E8] p-5">
          <h3 className="mb-2 font-black">Aislamiento de datos</h3>
          <p className="text-sm leading-relaxed text-[#6B5C51]">Pendiente de backend: multi-tenancy para que cada organización solo vea su información.</p>
        </div>
        <div className="rounded-3xl bg-[#F7F0E8] p-5">
          <h3 className="mb-2 font-black">Consentimiento</h3>
          <p className="text-sm leading-relaxed text-[#6B5C51]">Pendiente de backend: formularios de consentimiento y registro de autorizaciones.</p>
        </div>
      </div>
    </section>
  );
}

function SeccionTitulo({ icon: Icon, titulo, subtitulo, small = false }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0DDD2] text-[#A6533E]">
        <Icon size={20} />
      </div>
      <div>
        <h2 className={cn('font-black tracking-tight', small ? 'text-xl' : 'text-2xl')}>{titulo}</h2>
        <p className="mt-1 text-sm font-medium text-[#8C7A6D]">{subtitulo}</p>
      </div>
    </div>
  );
}

function BloqueDato({ label, value, large = false }) {
  return (
    <div className="rounded-2xl bg-[#F7F0E8] p-4">
      <div className="mb-1 text-xs font-black uppercase tracking-[0.08em] text-[#9A6657]">{label}</div>
      <div className={cn('font-semibold text-[#3D342E]', large ? 'text-sm leading-relaxed' : 'text-sm')}>{value}</div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
