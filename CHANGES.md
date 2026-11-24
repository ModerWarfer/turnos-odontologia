# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Turnos Odontología**.
> Cada change es atómico: un agente puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

---

## Cómo usar este documento

1. Identificar el change a implementar (verificar que sus dependencias están en `openspec/changes/archive/`).
2. Leer los docs de la knowledge-base indicados en "Leer antes".
3. Ejecutar `/opsx:propose <nombre-del-change>`.
4. Al terminar el change, archivarlo con `/opsx:archive <nombre-del-change>`.
5. Marcar el checkbox `[x]` en este archivo.

---

## Árbol de dependencias

```text
C-01 foundation-setup
  └── C-02 core-models
        └── C-03 auth-rbac                               ← desbloquea operación del consultorio
              │
              ├── C-04 patients-basic
              ├── C-05 clinic-resources                  ← paralelo con C-04
              │     │
              └─────┴── C-06 appointments-no-overlap     ← requiere C-04 + C-05 (Core MVP / Etapa 6 OPSX)
                          │
                          ├── C-07 online-booking-24-7
                          │     ├── C-10 public-booking-ui
                          │     ├── C-11 mercadopago-deposits       [v1.1 post-MVP]
                          │     │     ├── C-13 billing-arca-cashbox [v1.1 post-MVP]
                          │     │     └── C-14 patient-portal       [v1.1 + C-07]
                          │     └── (desbloquea C-14 junto con C-11)
                          │
                          ├── C-08 whatsapp-reminders    ← paralelo con C-07
                          ├── C-09 staff-agenda-ui       ← requiere C-04 + C-05 + C-06
                          └── C-12 clinical-odontogram-fdi [v1.1 + C-04]
```

### Paralelismo por fase

> Cada "gate" es un punto de sincronización. Los changes dentro de un grupo pueden ejecutarse en paralelo.

```text
GATE 0: ninguna
  → C-01 foundation-setup             [Agente A]

GATE 1: C-01 ✓
  → C-02 core-models                  [Agente A]

GATE 2: C-02 ✓
  → C-03 auth-rbac                    [Agente A]

GATE 3: C-03 ✓
  → C-04 patients-basic               [Agente B]
  → C-05 clinic-resources             [Agente A]

GATE 4: C-04 + C-05 ✓
  → C-06 appointments-no-overlap      [Agente A]

GATE 5: C-06 ✓                        ← PRIMER FORK (3 paralelos MVP)
  → C-07 online-booking-24-7          [Agente A]
  → C-08 whatsapp-reminders           [Agente B]
  → C-09 staff-agenda-ui              [Agente C]

GATE 6: C-07 ✓
  → C-10 public-booking-ui            [Agente C]

GATE 7: C-06 + C-07 ✓                 ← FORK v1.1 (post-MVP núcleo)
  → C-11 mercadopago-deposits         [Agente A]
  → C-12 clinical-odontogram-fdi      [Agente B — si C-04 + C-06 ✓]
  → C-13 billing-arca-cashbox         [Agente A — si C-11 ✓]
  → C-14 patient-portal               [Agente C — si C-11 ✓]
```

### Camino crítico (7 changes — mínimo irreducible para MVP v1.0)

```text
C-01 → C-02 → C-03 → C-05 → C-06 → C-07 → C-10*
```

> *Nota:* `C-09*` (`staff-agenda-ui`) cierra la rama de interfaz interna en paralelo con `C-07`/`C-10` tras completarse `C-06`.

### Plan óptimo con 3 agentes

```text
Paso │ Agente A (Backend Core)      │ Agente B (Backend Aux)        │ Agente C (Frontend)
─────┼──────────────────────────────┼───────────────────────────────┼────────────────────────────
  1  │ C-01 foundation-setup        │               —               │              —
  2  │ C-02 core-models             │               —               │              —
  3  │ C-03 auth-rbac               │               —               │              —
  4  │ C-05 clinic-resources        │ C-04 patients-basic           │              —
  5  │ C-06 appointments-no-overlap │               —               │              —
  6  │ C-07 online-booking-24-7     │ C-08 whatsapp-reminders       │ C-09 staff-agenda-ui
  7  │ C-11 mercadopago-deposits    │ C-12 clinical-odontogram-fdi  │ C-10 public-booking-ui
  8  │ C-13 billing-arca-cashbox    │               —               │ C-14 patient-portal
```

---

## FASE 0 — Cimientos (Agnóstico al stack)

> *Pre-requisito antes de aplicar `C-01`:* definir el stack tecnológico concreto (lenguaje backend, framework frontend, motor de base de datos y runner de tests) en `knowledge-base/10_preguntas_abiertas.md`.

### [C-01] `foundation-setup`
- **Estado**: `[ ]` pendiente
- **Scope**: Scaffolding agnóstico del monorepo e infraestructura base ejecutable
  - Estructura de directorios: `backend/` (`domain/`, `application/`, `infrastructure/`, `tests/`) y `frontend/` (`src/features/`, `src/shared/`, `src/pages/`)
  - Endpoint de salud `GET /api/health` verificando conectividad de aplicación y base de datos
  - Configuración de variables de entorno: `.env.example` con `APP_ENV`, `PORT`, `APP_TIMEZONE=America/Argentina/Buenos_Aires`, `DATABASE_URL`, `AUTH_JWT_SECRET`, `PUBLIC_BASE_URL` sin secretos hardcodeados
  - Harness de migraciones inicializado y runner de tests automatizados funcionando en verde
  - Pipeline CI mínimo: verificación de lint/build/tests en backend y frontend
- **Dependencias**: ninguna
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Alcance v1.0
  - `knowledge-base/02_descripcion_general.md` §Stack tecnológico
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios, §Variables de entorno
  - `knowledge-base/10_preguntas_abiertas.md` §Incertidumbres de Discovery

---

### [C-02] `core-models`
- **Estado**: `[ ]` pendiente
- **Scope**: Entidades raíz multi-tenant, mixins de auditoría y seed ficticio de desarrollo
  - Modelos: `Clinic` (`id`, `name`, `slug` único URL-safe, `timezone`, `booking_enabled`, `active`), `User` (`id`, `clinic_id`, `email`, `password_hash`, `full_name`, `role`, `active`)
  - Contratos base de persistencia: `AuditMixin` (`created_at`, `updated_at`, `active`) y scope obligatorio por `clinic_id`
  - Migración 001: tablas `clinics`, `users` e índices `(slug)` y `(clinic_id, email)` único
  - Seed mínimo 100% ficticio: clínica `"Consultorio Demo Sonrisa"` (`slug: demo-sonrisa`) y 1 usuario `admin` demo (sin datos reales de pacientes)
  - Tests: unicidad de `slug` y `(clinic_id, email)`, aislamiento base por `clinic_id`, integridad de seed ficticio
- **Dependencias**: `C-01`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades (`Clinic`, `User`), §Seed data inicial
  - `knowledge-base/05_reglas_de_negocio.md` §Multi-tenancy y Autenticación, §Cumplimiento Normativo
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones aplicados
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-02, §DD-05

---

## FASE 1 — Autenticación y Multi-tenancy

### [C-03] `auth-rbac`
- **Estado**: `[ ]` pendiente
- **Scope**: Autenticación del staff, contexto de tenant y autorización RBAC por rol
  - Endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/clinic/settings`, `PATCH /api/v1/clinic/settings`
  - Middleware de autenticación y tenant scoping: extrae `clinic_id` y `role` (`admin`, `dentist`, `receptionist`) desde sesión/token firmado sin aceptar `clinic_id` arbitrario del cliente
  - Guardas RBAC: `require_role()` restringiendo configuración institucional exclusivamente a `admin`
  - Migración 002: soporte de sesiones/revocación si aplica al esquema elegido
  - Tests: login válido/inválido, aislamiento estricto entre dos `clinic_id`, rechazo `403` por rol insuficiente
- **Dependencias**: `C-02`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §Actores del sistema, §RBAC — Matriz de permisos
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AU-01, §RN-AU-02
  - `knowledge-base/08_arquitectura_propuesta.md` §Seguridad

---

## FASE 2 — Operación Base del Consultorio

> `C-04` y `C-05` pueden desarrollarse e integrarse en paralelo una vez archivado `C-03`.

### [C-04] `patients-basic`
- **Estado**: `[ ]` pendiente
- **Scope**: Ficha básica administrativa de paciente (`US-001`, `US-002`)
  - Modelo: `Patient` (`id`, `clinic_id`, `full_name`, `dni`, `phone_whatsapp` E.164, `email`, `birth_date`, `notes`, `active`)
  - Endpoints: `GET /api/v1/patients` (búsqueda paginada por nombre, DNI o teléfono), `POST /api/v1/patients`, `GET /api/v1/patients/{id}`, `PATCH /api/v1/patients/{id}`
  - Validaciones: `full_name` obligatorio, al menos un canal de contacto (`phone_whatsapp` o `email`), unicidad `(clinic_id, dni)` cuando `dni` está presente
  - Migración 003: tabla `patients` con índices `(clinic_id, full_name)`, `(clinic_id, phone_whatsapp)` y unicidad parcial `(clinic_id, dni)`
  - Tests: alta válida, rechazo sin contacto, rechazo DNI duplicado en misma clínica, permitido mismo DNI en distinta clínica, fixtures 100% ficticios (Ley 25.326)
- **Dependencias**: `C-03`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §`Patient`
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AU-01, §RN-LG-01
  - `knowledge-base/06_funcionalidades.md` §Épica 1 (`US-001`, `US-002`)

---

### [C-05] `clinic-resources`
- **Estado**: `[ ]` pendiente
- **Scope**: Gestión de profesionales, sillones/boxes, prestaciones con duración variable y horarios laborales (`US-003`)
  - Modelos: `Professional`, `Chair`, `Service` (`duration_minutes > 0`, `allow_online_booking`), `AvailabilityRule` (`weekly_schedule | date_override | block`)
  - Endpoints: CRUD `/api/v1/professionals`, `/api/v1/professionals/{id}/availability-rules`, `/api/v1/chairs`, `/api/v1/services`
  - Validaciones: nombre único de sillón por `clinic_id`, `duration_minutes > 0`, `start_time < end_time`, consistencia de `default_chair_id` en el mismo tenant; escritura restringida a `admin` (y disponibilidad propia para `dentist` según política)
  - Migración 004: tablas `professionals`, `chairs`, `services`, `availability_rules` + seed demo ficticio (`Dra. Laura Gómez`, `Dr. Martín Pérez`, `Sillón 1`, `Box 2`, prestaciones 30/45/60 min)
  - Tests: validación de duración > 0, reglas semanales vs bloqueos puntuales, aislamiento multi-tenant y RBAC
- **Dependencias**: `C-03`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §`Professional`, §`Chair`, §`Service`, §`AvailabilityRule`, §Seed data inicial
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-04, §RN-AG-06
  - `knowledge-base/06_funcionalidades.md` §Épica 2 (`US-003`)

---

## FASE 3 — Motor de Agenda y Turnos (Core MVP)

### [C-06] `appointments-no-overlap`
> *Change acotado recomendado en `COORDINACION-EQUIPO.md` para ejecutar el ciclo completo OPSX de Etapa 6.*

- **Estado**: `[ ]` pendiente
- **Scope**: Motor transaccional de agenda multi-profesional y multi-sillón/box con prevención estricta de solapamientos (`US-004`, `US-005`)
  - Modelo: `Appointment` (`clinic_id`, `patient_id`, `professional_id`, `chair_id`, `service_id`, `starts_at`, `ends_at`, `duration_minutes`, `status`, `source`, `public_action_token`, `cancellation_reason`)
  - Lógica pura de dominio + transacción atómica: cálculo `ends_at = starts_at + service.duration_minutes`, validación de horario laboral (`AvailabilityRule`), exclusión mutua en intervalos `[starts_at, ends_at)` por `professional_id` (`RN-AG-01`) y por `chair_id` (`RN-AG-02`), validez de turnos contiguos `A.ends_at == B.starts_at` (`RN-AG-03`), bloqueo solo en estados activos (`pending | confirmed | checked_in`) y liberación inmediata en `cancelled | no_show` (`RN-AG-05`)
  - Endpoints: `GET /api/v1/appointments`, `GET /api/v1/availability`, `POST /api/v1/appointments`, `PATCH /api/v1/appointments/{id}` (reprogramación/estados), `POST /api/v1/appointments/{id}/cancel`
  - Migración 005: tabla `appointments` con constraints temporales, índice único `public_action_token` e índices de rango por profesional y sillón/box
  - Tests automatizados (escenarios Dado/Cuando/Entonces): creación feliz con duración variable, rechazo `409` por solapamiento de profesional, rechazo `409` por solapamiento de sillón/box (distinto profesional), caso borde de turnos contiguos válidos, liberación tras `cancelled`/`no_show`, reprogramación y concurrencia atómica
- **Dependencias**: `C-04, C-05`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §`Appointment`
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AG-01 a §RN-AG-07, §RN-GL-01
  - `knowledge-base/06_funcionalidades.md` §`US-004`, §`US-005`
  - `knowledge-base/07_flujos_principales.md` §Flujo 1, §Flujo 4

---

## FASE 4 — Canales Automáticos del MVP

> `C-07`, `C-08` y `C-09` conforman el fork paralelo posterior a `C-06`.

### [C-07] `online-booking-24-7`
- **Estado**: `[ ]` pendiente
- **Scope**: API pública de reserva de turnos online 24/7 por link propio sin contraseña (`US-006`, `US-007`)
  - Endpoints públicos: `GET /api/v1/public/{clinicSlug}/catalog`, `GET /api/v1/public/{clinicSlug}/availability`, `POST /api/v1/public/{clinicSlug}/bookings`, `POST /api/v1/public/appointments/{token}/confirm`, `POST /api/v1/public/appointments/{token}/cancel`
  - Privacidad pública: respuesta de disponibilidad anonimizada exponiendo únicamente franjas libres donde profesional y al menos un sillón/box estén disponibles (`RN-AU-03`)
  - Transacción atómica en `/bookings`: crea o concilia ficha básica del paciente dentro del `clinic_id`, asigna sillón disponible, rechaza reservas en el pasado (`America/Argentina/Buenos_Aires`) y resuelve doble reserva simultánea con `409 Conflict` (`RN-RO-02`)
  - Tests: anonimato en disponibilidad pública, reserva 24/7 completa, acción por token (confirmar/cancelar), prueba de concurrencia ante doble reserva simultánea
- **Dependencias**: `C-06`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas
  - `knowledge-base/05_reglas_de_negocio.md` §RN-AU-03, §RN-RO-01 a §RN-RO-03
  - `knowledge-base/06_funcionalidades.md` §Épica 3 (`US-006`, `US-007`)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2

---

### [C-08] `whatsapp-reminders`
- **Estado**: `[ ]` pendiente
- **Scope**: Programación, envío automático idempotente de recordatorios por WhatsApp Business y respaldo por email (`US-008`, `US-009`)
  - Modelo: `Reminder` (`clinic_id`, `appointment_id`, `channel`, `template_name`, `scheduled_for`, `sent_at`, `status`, `external_message_id`, `error_detail`, `idempotency_key` único)
  - Puerto y adaptadores (`infrastructure/`): adaptador WhatsApp Business Cloud API con plantillas Meta aprobadas (`RN-RC-01`) + adaptador email transaccional como complemento/fallback
  - Worker / scheduler idempotente: dispara recordatorios elegibles (`pending`/`confirmed`), garantiza único envío por `idempotency_key` (`RN-RC-03`) y cancela/reprograma recordatorios `scheduled` cuando un turno cambia (`RN-RC-02`)
  - Endpoints: `GET /api/v1/appointments/{id}/reminders`, `POST /api/v1/webhooks/whatsapp` (verificación de `WHATSAPP_VERIFY_TOKEN` y firma HMAC `WHATSAPP_APP_SECRET`)
  - Migración 006: tabla `reminders` con índice único sobre `idempotency_key` e índice `(status, scheduled_for)`
  - Tests: idempotencia ante doble ejecución, cancelación automática al cancelar turno, fallback a email ante falla de WhatsApp, verificación de firma webhook (con mocks de Meta)
- **Dependencias**: `C-06`
- **Governance**: ALTO
- **Leer antes**:
  - `knowledge-base/02_descripcion_general.md` §Integraciones externas
  - `knowledge-base/04_modelo_de_datos.md` §`Reminder`
  - `knowledge-base/05_reglas_de_negocio.md` §RN-RC-01 a §RN-RC-03
  - `knowledge-base/07_flujos_principales.md` §Flujo 3

---

## FASE 5 — Interfaces Web del MVP

### [C-09] `staff-agenda-ui`
- **Estado**: `[ ]` pendiente
- **Scope**: Interfaz web responsive autenticada para operación diaria del consultorio
  - Vistas: login staff, agenda diaria/semanal multi-profesional y multi-sillón/box con estados visuales, modal de creación/reprogramación de turno con manejo explícito de conflictos `409`
  - Vistas de gestión: listado/búsqueda y alta/edición de ficha básica de pacientes (`C-04`), configuración de profesionales, sillones/boxes, prestaciones y horarios (`C-05`), visualización de estado de recordatorios del turno
  - Manejo de zona horaria `America/Argentina/Buenos_Aires` y permisos UI según rol (`admin`, `dentist`, `receptionist`)
  - Tests: flujos UI críticos de login, alta de turno, visualización de conflicto de solapamiento y filtrado por profesional/sillón
- **Dependencias**: `C-04, C-05, C-06`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §RBAC — Matriz de permisos
  - `knowledge-base/06_funcionalidades.md` §Épica 1, §Épica 2
  - `knowledge-base/08_arquitectura_propuesta.md` §Estructura de directorios
  - `knowledge-base/09_decisiones_y_supuestos.md` §SU-05 (referencias UX)

---

### [C-10] `public-booking-ui`
- **Estado**: `[ ]` pendiente
- **Scope**: Interfaz web pública 24/7 para reserva autónoma y confirmación/cancelación por enlace
  - Rutas públicas: `/book/{clinicSlug}` (pasos: selección de prestación → profesional o cualquiera disponible → fecha y slot libre → datos mínimos de contacto → pantalla de confirmación) y `/appointments/action/{token}`
  - Manejo amigable de conflicto `409` por concurrencia (recarga automática de horarios disponibles)
  - Diseño mobile-first responsive sin requerir registro ni contraseña
  - Tests: recorrido completo de reserva pública, manejo de slot tomado concurrentemente y pantalla de confirmación/cancelación por token
- **Dependencias**: `C-07`
- **Governance**: BAJO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas
  - `knowledge-base/06_funcionalidades.md` §Épica 3 (`US-006`, `US-007`)
  - `knowledge-base/07_flujos_principales.md` §Flujo 2, §Flujo 4

---

## FASE 6 — Extensión v1.1 (Post-MVP Núcleo — Discovery Imprescindibles)

> *Fase posterior al MVP núcleo acordado (`IN-01`).* Agrupa los 4 módulos imprescindibles adicionales de `docs/discovery/informe-discovery.md`.

### [C-11] `mercadopago-deposits` *(v1.1)*
- **Estado**: `[ ]` pendiente
- **Scope**: Seña online vía Mercado Pago a cuenta propia de la clínica y presupuestos base (`US-010`)
  - Modelos: `Budget`, `Payment` (`clinic_id`, `appointment_id`, `amount_ars`, `status`, `mp_preference_id`, `mp_payment_id`)
  - Adaptador Mercado Pago + endpoint webhook `POST /api/v1/webhooks/mercadopago` con validación de firma e idempotencia
  - Migración 007: tablas `budgets`, `payments`
  - Tests: generación de preferencia, webhook aprobado/rechazado, firma inválida `401` e idempotencia
- **Dependencias**: `C-07`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Alcance v1.1
  - `knowledge-base/02_descripcion_general.md` §Integraciones externas
  - `knowledge-base/06_funcionalidades.md` §`US-010`
  - `knowledge-base/07_flujos_principales.md` §Flujo 5

---

### [C-12] `clinical-odontogram-fdi` *(v1.1)*
- **Estado**: `[ ]` pendiente
- **Scope**: Historia clínica electrónica y odontograma FDI con versionado inmutable (`US-011`, Ley 26.529)
  - Modelos: `ClinicalRecord`, `OdontogramVersion` (nomenclatura FDI 52 piezas/caras, snapshots append-only con autor `dentist` y timestamp)
  - Endpoints: `/api/v1/patients/{id}/clinical-records`, `/api/v1/patients/{id}/odontograms` con restricción RBAC estricta a rol `dentist` (`RN-AU-02`, `RN-LG-02`)
  - Migración 008: tablas `clinical_records`, `odontogram_versions`
  - Tests: versionado no destructivo, comparación entre versiones, rechazo `403` para rol `receptionist`
- **Dependencias**: `C-04, C-06`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/03_actores_y_roles.md` §RBAC — Matriz de permisos
  - `knowledge-base/04_modelo_de_datos.md` §Entidades diferidas a v1.1
  - `knowledge-base/05_reglas_de_negocio.md` §RN-LG-02
  - `knowledge-base/06_funcionalidades.md` §`US-011`

---

### [C-13] `billing-arca-cashbox` *(v1.1)*
- **Estado**: `[ ]` pendiente
- **Scope**: Caja diaria en ARS y facturación electrónica integrada con ARCA (emisión de CAE) (`US-012`)
  - Modelos: `Invoice` (`clinic_id`, `payment_id`, `cae`, `cae_due_date`, `invoice_type`, `amount_ars`, `status`) y movimientos de caja diaria
  - Adaptador ARCA (WebService con certificado vía `ARCA_CERT_PATH`) + endpoints `/api/v1/cashbox`, `/api/v1/invoices`
  - Migración 009: tablas `cashbox_movements`, `invoices`
  - Tests: emisión de CAE exitosa (mock ARCA), tolerancia a error ARCA sin perder registro de cobro en caja, aislamiento multi-tenant
- **Dependencias**: `C-11`
- **Governance**: CRITICO
- **Leer antes**:
  - `knowledge-base/02_descripcion_general.md` §Integraciones externas
  - `knowledge-base/05_reglas_de_negocio.md` §RN-LG-03, §RN-LG-04
  - `knowledge-base/07_flujos_principales.md` §Flujo 5
  - `knowledge-base/08_arquitectura_propuesta.md` §Variables de entorno

---

### [C-14] `patient-portal` *(v1.1)*
- **Estado**: `[ ]` pendiente
- **Scope**: Portal del paciente sin contraseña para consulta de turnos, señas y comprobantes (`US-012`)
  - Ruta y API: `/portal/{token}` y `GET /api/v1/public/portal/{token}` con token seguro temporal por paciente/clínica
  - Visualización de próximos turnos, estado de seña Mercado Pago y descarga de comprobante fiscal ARCA
  - Tests: acceso válido por token, expiración/revocación de token, aislamiento estricto al paciente propietario del token
- **Dependencias**: `C-07, C-11`
- **Governance**: MEDIO
- **Leer antes**:
  - `knowledge-base/01_vision_y_objetivos.md` §Alcance v1.1
  - `knowledge-base/03_actores_y_roles.md` §Rutas públicas
  - `knowledge-base/06_funcionalidades.md` §`US-012`

