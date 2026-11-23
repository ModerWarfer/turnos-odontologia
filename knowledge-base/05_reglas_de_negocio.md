# Reglas de Negocio

Cada regla tiene un código único `RN-{DOMINIO}-{NN}` para trazabilidad desde historias de usuario y especificaciones OpenSpec.

---

## Dominio: Multi-tenancy y Autenticación (`RN-AU`)

- **RN-AU-01 — Aislamiento estricto por clínica (tenant):** toda consulta, creación, modificación o eliminación de datos autenticados debe filtrarse y validarse contra el `clinic_id` de la sesión del usuario. Ningún recurso perteneciente a otra clínica puede ser leído ni referenciado.
- **RN-AU-02 — Autorización por rol (RBAC):** solo usuarios con rol habilitado pueden operar recursos del consultorio; las acciones administrativas de configuración están reservadas a `admin`, y la escritura de registros clínicos (v1.1) está reservada a `dentist`.
- **RN-AU-03 — Privacidad en rutas públicas:** los endpoints públicos de reserva online 24/7 (`availability`, `catalog`) nunca deben exponer nombres, teléfonos, DNI ni motivos de consulta de pacientes con turnos ya agendados.

---

## Dominio: Agenda y Prevención de Solapamientos (`RN-AG`)

- **RN-AG-01 — No solapamiento por profesional:** un profesional no puede tener dos turnos en estado activo cuyos intervalos `[starts_at, ends_at)` se superpongan (`nuevo.starts_at < existente.ends_at AND nuevo.ends_at > existente.starts_at`).
- **RN-AG-02 — No solapamiento por sillón/box:** un sillón o box no puede tener dos turnos en estado activo cuyos intervalos `[starts_at, ends_at)` se superpongan, incluso si corresponden a profesionales distintos.
- **RN-AG-03 — Validez de turnos contiguos:** dos turnos estrictamente adyacentes en el tiempo (`A.ends_at == B.starts_at`) **no** se consideran solapados y deben permitirse para el mismo profesional y para el mismo sillón/box.
- **RN-AG-04 — Duración variable por prestación:** al crear un turno, su duración (`ends_at - starts_at`) se calcula a partir de `service.duration_minutes` (siempre `> 0`), permitiendo que distintas prestaciones ocupen bloques de distinta extensión (ej. 15, 30, 45, 60 minutos).
- **RN-AG-05 — Estados que bloquean vs. estados que liberan:** únicamente los estados activos (`pending`, `confirmed`, `checked_in`) ocupan al profesional y al sillón/box. Los estados terminales negativos (`cancelled`, `no_show`) liberan de inmediato el intervalo para nuevas reservas.
- **RN-AG-06 — Consistencia temporal y laboral:** todo turno debe cumplir `starts_at < ends_at`, pertenecer al horario laboral vigente del profesional (sin bloqueos activos) y, en reservas online 24/7, tener `starts_at` en el futuro respecto de la hora actual en `America/Argentina/Buenos_Aires`.
- **RN-AG-07 — Revalidación en reprogramación:** al modificar fecha, hora, profesional, sillón/box o prestación de un turno existente, deben re-evaluarse `RN-AG-01` a `RN-AG-06` excluyendo únicamente el ID del propio turno que se edita.

---

## Dominio: Reserva Online 24/7 (`RN-RO`)

- **RN-RO-01 — Acceso por link propio sin contraseña:** cada consultorio habilitado dispone de un identificador público (`clinicSlug`) para que el paciente reserve sin registrarse con contraseña.
- **RN-RO-02 — Resolución atómica de concurrencia:** si dos pacientes intentan reservar simultáneamente el mismo bloque (mismo profesional o mismo sillón/box), la transacción de persistencia debe garantizar que solo una reserva se confirme y la segunda reciba un rechazo controlado de conflicto de disponibilidad.
- **RN-RO-03 — Datos mínimos y reutilización de ficha:** la reserva online exige como mínimo nombre completo y canal de contacto válido (WhatsApp y/o email), evitando duplicar innecesariamente pacientes cuando la política de conciliación por clínica lo permita.

---

## Dominio: Recordatorios Automáticos (`RN-RC`)

- **RN-RC-01 — Plantillas Meta aprobadas en WhatsApp:** todo envío proactivo por WhatsApp Business API debe utilizar plantillas previamente aprobadas por Meta; si el paciente no posee WhatsApp o falla el canal, se utiliza email como complemento/respaldo según configuración.
- **RN-RC-02 — Ciclo de vida ligado al turno:** si un turno pasa a `cancelled` o `no_show`, o se reprograma su `starts_at`, los recordatorios en estado `scheduled` asociados deben cancelarse o recalcularse automáticamente para no notificar horarios obsoletos.
- **RN-RC-03 — Idempotencia y control de costos:** como Meta cobra por conversación/mensaje en WhatsApp Business API, ningún recordatorio puede enviarse más de una vez para la misma ventana y turno (`idempotency_key` único).

---

## Dominio: Cumplimiento Normativo y Comercial Argentina (`RN-LG`)

- **RN-LG-01 — Protección de datos personales (Ley 25.326):** todo dato de paciente debe tratarse con confidencialidad y acceso mínimo necesario; está estrictamente prohibido commitear datos reales de pacientes en el repositorio, seeds o tests.
- **RN-LG-02 — Trazabilidad de historia clínica (Ley 26.529, v1.1):** los registros clínicos y versiones de odontograma FDI no se sobrescriben destructivamente; cada cambio genera trazabilidad/versionado con autor y marca temporal.
- **RN-LG-03 — Modelo comercial transparente en ARS:** el producto contempla planes en pesos argentinos (ARS) y sin permanencia obligatoria, alineado al hallazgo de Discovery.
- **RN-LG-04 — Facturación electrónica ARCA integrada (v1.1):** los comprobantes fiscales deben obtener CAE válido desde ARCA sin requerir carga manual paralela fuera del sistema.
- **RN-LG-05 — Alcance diferido regulatorio:** la receta electrónica oficial (ReNaPDiS) y la validación avanzada de obras sociales (PUCO) quedan fuera de v1.0 y v1.1.

---

## Dominio: Excepciones globales (`RN-GL`)

- **RN-GL-01 — Zona horaria canónica:** las fechas/horas operativas de consultorios argentinos se interpretan en `America/Argentina/Buenos_Aires` (UTC-3) y se almacenan con zona horaria explícita (`timestamptz`).
- **RN-GL-02 — Cero invención de capacidades:** no se deben exponer ni prometer al usuario integraciones o validaciones que no estén implementadas y verificadas ("No evidenciado" / principio de honestidad del Discovery).

