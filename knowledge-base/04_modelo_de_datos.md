# Modelo de Datos

## Dominios

- **Organización y Multi-tenancy:** consultorio/clínica como unidad aislante (`Clinic`), usuarios del staff (`User`), profesionales (`Professional`) y recursos físicos (`Chair` / sillón o box).
- **Catálogo de Prestaciones:** servicios odontológicos (`Service`) con duración variable en minutos y habilitación para reserva online.
- **Pacientes:** ficha básica administrativa del paciente (`Patient`), aislada por clínica y sujeta a Ley 25.326.
- **Agenda y Turnos:** reglas de disponibilidad horaria (`AvailabilityRule`) y turnos (`Appointment`) con prevención estricta de solapamientos por profesional y por sillón/box.
- **Recordatorios:** cola y trazabilidad de notificaciones programadas y enviadas por WhatsApp/email (`Reminder`).
- **Dominios v1.1 (extensión post-MVP núcleo):** Clínica (`ClinicalRecord`, `OdontogramVersion` FDI) y Finanzas/ARCA (`Budget`, `Payment`, `Invoice`).

---

## ERD (Entity Relationship Diagram)

```text
+-------------+       1:N       +-------------+
|   Clinic    |---------------->|    User     |
|  (tenant)   |                 +------+------+
+------+------+                        | 0..1
       |                               v
       | 1:N                    +-------------+
       +----------------------->|Professional |
       |                        +------+------+
       | 1:N                           | 1:N
       +-----------------------+       v
       |                       |  +------------------+
       |                       |  | AvailabilityRule |
       |                       |  +------------------+
       | 1:N                   v
       +---------------> +-------------+
       |                 |    Chair    | (Sillón / Box)
       |                 +------+------+
       | 1:N                    |
       +---------------> +------+------+
       |                 |   Service   | (Prestación + duración)
       |                 +------+------+
       |                        |
       | 1:N                    | N:1
       +---------------> +------+------+       N:1       +-------------+
       |                 | Appointment |<----------------|   Patient   |
       |                 +------+------+                 +-------------+
       |                        | 1:N
       |                        v
       |                 +-------------+
       |                 |  Reminder   |
       |                 +-------------+
       |
       | [Extensión v1.1]
       +---> ClinicalRecord / OdontogramVersion (FDI)
       +---> Budget / Payment (Mercado Pago) / Invoice (ARCA CAE)
```

---

## Entidades

### `Clinic` (Consultorio / Clínica — Tenant raíz)
- **Atributos:** `id` (UUID), `name` (string), `slug` (string, único para link público), `cuit` (string, opcional en v1.0 / requerido ARCA en v1.1), `timezone` (string, default `America/Argentina/Buenos_Aires`), `whatsapp_phone_number_id` (string, nullable), `booking_enabled` (boolean), `active` (boolean), `created_at` (timestamp).
- **Relaciones:** 1:N con `User`, `Professional`, `Chair`, `Service`, `Patient`, `Appointment`.
- **Constraints:** `slug` único global en formato URL-safe; `active` obligatorio.
- **Índices relevantes:** índice único sobre `slug`.

### `User` (Usuario del sistema)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `email` (string), `password_hash` (string), `full_name` (string), `role` (enum: `admin | dentist | receptionist`), `active` (boolean), `created_at` (timestamp).
- **Relaciones:** N:1 con `Clinic`; 0..1 con `Professional`.
- **Constraints:** `(clinic_id, email)` único.
- **Índices relevantes:** índice compuesto `(clinic_id, role, active)`.

### `Professional` (Odontólogo)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `user_id` (UUID FK, nullable), `full_name` (string), `specialty` (string, nullable), `license_number` (string, matrícula), `default_chair_id` (UUID FK, nullable), `active` (boolean).
- **Relaciones:** N:1 con `Clinic`; 0..1 con `User`; 0..1 con `Chair` preferido; 1:N con `AvailabilityRule` y `Appointment`.
- **Constraints:** `full_name` no vacío; pertenece al mismo `clinic_id` que su `default_chair_id`.
- **Índices relevantes:** `(clinic_id, active)`.

### `Chair` (Sillón / Box odontológico)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `name` (string, ej. `"Sillón 1"`), `description` (string, nullable), `active` (boolean).
- **Relaciones:** N:1 con `Clinic`; 1:N con `Appointment`.
- **Constraints:** `(clinic_id, name)` único.
- **Índices relevantes:** `(clinic_id, active)`.

### `Service` (Prestación odontológica)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `name` (string), `duration_minutes` (integer), `allow_online_booking` (boolean), `base_price_ars` (decimal, nullable en v1.0), `active` (boolean).
- **Relaciones:** N:1 con `Clinic`; 1:N con `Appointment`.
- **Constraints:** `duration_minutes > 0` (ej. múltiplo configurable de grilla, validado en dominio).
- **Índices relevantes:** `(clinic_id, active, allow_online_booking)`.

### `AvailabilityRule` (Horario laboral / bloqueos)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `professional_id` (UUID FK), `rule_type` (enum: `weekly_schedule | date_override | block`), `day_of_week` (smallint 0..6, nullable), `specific_date` (date, nullable), `start_time` (time), `end_time` (time), `is_available` (boolean).
- **Relaciones:** N:1 con `Clinic` y `Professional`.
- **Constraints:** `start_time < end_time`; si `rule_type = weekly_schedule`, `day_of_week` requerido; si es excepción/bloqueo puntual, `specific_date` requerido.
- **Índices relevantes:** `(clinic_id, professional_id, rule_type, day_of_week, specific_date)`.

### `Patient` (Ficha básica de paciente)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `full_name` (string), `dni` (string, nullable según alta rápida), `phone_whatsapp` (string, formato E.164 ej. `+549...`), `email` (string, nullable), `birth_date` (date, nullable), `notes` (text administrativo, nullable), `active` (boolean), `created_at` (timestamp).
- **Relaciones:** N:1 con `Clinic`; 1:N con `Appointment`.
- **Constraints:** `full_name` obligatorio; al menos un canal de contacto (`phone_whatsapp` o `email`); `(clinic_id, dni)` único cuando `dni IS NOT NULL`.
- **Índices relevantes:** `(clinic_id, full_name)`, `(clinic_id, phone_whatsapp)`, `(clinic_id, dni)`.

### `Appointment` (Turno)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `patient_id` (UUID FK), `professional_id` (UUID FK), `chair_id` (UUID FK), `service_id` (UUID FK), `starts_at` (timestamptz), `ends_at` (timestamptz), `duration_minutes` (integer, snapshot de duración al crear/editar), `status` (enum: `pending | confirmed | checked_in | completed | cancelled | no_show`), `source` (enum: `internal | online_24_7`), `public_action_token` (string, único/hash para confirmar o cancelar), `cancellation_reason` (string, nullable), `created_at` (timestamp), `updated_at` (timestamp).
- **Relaciones:** N:1 con `Clinic`, `Patient`, `Professional`, `Chair`, `Service`; 1:N con `Reminder`.
- **Constraints críticos de negocio:**
  - `starts_at < ends_at` y `duration_minutes > 0`.
  - Todas las FK (`patient_id`, `professional_id`, `chair_id`, `service_id`) deben pertenecer al mismo `clinic_id`.
  - **No solapamiento por profesional:** para todo par de turnos en estado activo (`pending`, `confirmed`, `checked_in`) con igual `(clinic_id, professional_id)`, los intervalos `[starts_at, ends_at)` no pueden intersecarse (`A.starts_at < B.ends_at AND A.ends_at > B.starts_at`).
  - **No solapamiento por sillón/box:** para todo par de turnos en estado activo con igual `(clinic_id, chair_id)`, los intervalos `[starts_at, ends_at)` no pueden intersecarse.
- **Índices relevantes:** `(clinic_id, professional_id, starts_at, ends_at)`, `(clinic_id, chair_id, starts_at, ends_at)`, `(clinic_id, status, starts_at)`, índice único sobre `public_action_token`.

### `Reminder` (Recordatorio automático)
- **Atributos:** `id` (UUID), `clinic_id` (UUID FK), `appointment_id` (UUID FK), `channel` (enum: `whatsapp | email`), `template_name` (string), `scheduled_for` (timestamptz), `sent_at` (timestamptz, nullable), `status` (enum: `scheduled | sent | delivered | failed | cancelled`), `external_message_id` (string, nullable), `error_detail` (string, nullable), `idempotency_key` (string).
- **Relaciones:** N:1 con `Clinic` y `Appointment`.
- **Constraints:** `idempotency_key` único por `(appointment_id, channel, scheduled_for)`.
- **Índices relevantes:** `(status, scheduled_for)`, `(appointment_id)`.

### Entidades diferidas a v1.1 (resumen)
- **`ClinicalRecord` y `OdontogramVersion`:** evoluciones clínicas ancladas y snapshots versionados del odontograma FDI (52 piezas / 5 caras según referencias del Discovery).
- **`Budget` y `Payment`:** presupuestos en ARS y señas/cobros vía Mercado Pago a cuenta propia.
- **`Invoice`:** comprobantes electrónicos emitidos ante ARCA con número de `CAE` y fecha de vencimiento.

---

## Seed data inicial

> **Cumplimiento obligatorio:** datos **100% ficticios/anónimos** de ejemplo para entorno local/demo. **Prohibido** incluir datos reales de pacientes o clínicas reales.

- **Clínica demo:** `name = "Consultorio Demo Sonrisa"`, `slug = "demo-sonrisa"`, `timezone = "America/Argentina/Buenos_Aires"`.
- **Sillones/boxes:** `Sillón 1` (Planta Baja), `Box 2` (Planta Baja).
- **Profesionales ficticios:**
  - `Dra. Laura Gómez` (Odontología General, matrícula ficticia `MP-0001`).
  - `Dr. Martín Pérez` (Ortodoncia / Endodoncia, matrícula ficticia `MP-0002`).
- **Prestaciones base (duración variable):**
  - `Consulta y diagnóstico` — `30` min (`allow_online_booking = true`).
  - `Limpieza dental (profilaxis)` — `45` min (`allow_online_booking = true`).
  - `Endodoncia (tratamiento de conducto)` — `60` min (`allow_online_booking = false` o con evaluación previa).
- **Pacientes:** **0 pacientes reales precargados** en repositorio; los fixtures de tests usan datos sintéticos generados en memoria (ej. `"Paciente Ficticio A"`, teléfono de prueba `+5491100000001`).

