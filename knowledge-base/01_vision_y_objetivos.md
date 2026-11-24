# Visión y Objetivos

## Propósito del sistema

Desarrollar un sistema **SaaS Cloud multi-tenant de gestión de turnos y agenda de pacientes para consultorios y clínicas odontológicas en Argentina**, que elimine los procesos fragmentados actuales (agenda en papel o Excel, recordatorios manuales, cobros dispersos e historia clínica en papel) para reducir el ausentismo, evitar la pérdida de pacientes y asegurar trazabilidad operativa, clínica y financiera.

El producto se apoya en los hallazgos del relevamiento de mercado de 21 sistemas (`docs/discovery/informe-discovery.md`), priorizando la automatización práctica por WhatsApp, una agenda estricta multi-profesional y multi-sillón/box, y la futura integración nativa con el ecosistema argentino (Mercado Pago y facturación electrónica ARCA).

---

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| **Odontólogo** (generalista o especialista) | Consultar y gestionar su agenda diaria sin superposiciones de horarios ni de sillón/box | Minimizar tiempos ociosos por ausencias; registrar evoluciones y odontograma FDI versionado (v1.1) |
| **Recepcionista / Asistente** | Administrar turnos, disponibilidad multi-profesional/sillón y fichas de pacientes con agilidad | Reducir carga manual de confirmaciones mediante recordatorios automáticos; gestionar reprogramaciones y cobros (v1.1) |
| **Administrador / Dueño de clínica** | Centralizar la operación de la institución (profesionales, sillones/boxes, prestaciones y métricas) | Reducir inasistencias; controlar caja diaria y facturación ARCA integrada (v1.1); contar con pricing transparente en ARS sin permanencia |
| **Paciente** | Reservar, confirmar o cancelar turnos online 24/7 desde un link propio sin fricción | Recibir recordatorios automáticos por WhatsApp/email; abonar seña online (v1.1) y consultar su portal sin contraseña (v1.1) |
| **Laboratorio dental** *(opcional / postergado)* | Coordinar entregas y estados de trabajos protésicos asociados a pacientes y turnos | Integrarse al flujo clínico de la clínica (alcance diferido post-MVP según recomendación de Discovery) |

---

## Alcance v1.0 (MVP Núcleo — Acordado por el equipo)

Según el consenso documentado en `COORDINACION-EQUIPO.md`, la primera versión operativa del sistema cubre cuatro pilares acotados:

- **Ficha básica de paciente:** alta, búsqueda, edición y desactivación lógica de pacientes con datos administrativos mínimos de contacto (sin datos reales en repositorio; cumplimiento Ley 25.326).
- **Agenda multi-profesional y multi-sillón/box:** gestión de turnos con estados, duración variable según la prestación odontológica y **prevención estricta de solapamientos** tanto por profesional como por sillón/box.
- **Reserva de turnos online 24/7:** portal público accesible mediante link propio del consultorio para consultar disponibilidad real y reservar turno sin contraseña.
- **Recordatorios automáticos por WhatsApp:** programación y envío automatizado mediante WhatsApp Business API (plantillas aprobadas por Meta), con email transaccional como complemento/respaldo.

---

## Alcance v1.1 (Extensión Imprescindibles del Discovery)

Funcionalidades identificadas como imprescindibles en `docs/discovery/informe-discovery.md` que amplían el MVP núcleo una vez validada la base de agenda y turnos:

- **Seña online (Mercado Pago):** cobro de seña a cuenta propia del consultorio/profesional mediante checkout y webhooks.
- **Historia clínica + odontograma FDI (versionado básico):** registro clínico anclado a evoluciones con trazabilidad por versión (cumplimiento Ley 26.529).
- **Presupuestos, cobros y caja diaria:** registro de planes de tratamiento presupuestados, pagos y arqueo de caja en ARS.
- **Facturación electrónica ARCA:** emisión integrada de comprobantes con CAE.
- **Portal del paciente sin contraseña:** acceso por enlace/token temporal para consultar próximos turnos, señas y comprobantes.
- **Sincronización con Google Calendar:** reflejo bidireccional o unidireccional de agenda por profesional.

---

## Fuera de alcance (Postergado — v2+)

Explícitamente excluido del MVP y de v1.1 (respaldado por Sección D del informe de Discovery):

- Receta electrónica oficial (**ReNaPDiS**).
- **Teleconsulta** odontológica.
- **Módulo de laboratorio dental** integrado.
- **Cobertura de obras sociales (PUCO)** avanzada y liquidaciones de obras sociales.
- **Imaging con IA** (lectura asistida de radiografías).
- **IA recepcionista 24h** conversacional por WhatsApp y **campañas automáticas de recuperación de pacientes inactivos** (diferenciadores futuros).
- **Check-in por QR/DNI** en sala de espera (diferenciador futuro).

---

## Métricas de éxito

Indicadores definidos cualitativamente a partir del problema raíz del Discovery (los umbrales numéricos objetivo quedan pendientes de definición en `10_preguntas_abiertas.md`):

- **Cero solapamientos en agenda:** 0% de turnos activos superpuestos para un mismo profesional o un mismo sillón/box.
- **Reducción de ausentismo (no-show):** disminución medible de inasistencias tras la activación de recordatorios automáticos por WhatsApp/email.
- **Adopción de reserva online 24/7:** proporción de turnos totales generados de forma autónoma por pacientes mediante el link propio.
- **Efectividad de recordatorios:** porcentaje de recordatorios programados entregados antes del turno respecto del total de turnos elegibles.

