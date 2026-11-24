# OPSX Explore — Relevamiento para `C-06: appointments-no-overlap`

**Fecha:** 24/11/2026  
**Fase OPSX:** `Explore` (`/opsx:explore appointments-no-overlap`)  
**Change seleccionado de `CHANGES.md`:** `C-06 — appointments-no-overlap` (*"Crear un turno evitando solapamientos por profesional y por sillón/box"*)  
**Responsable:** Integrante C (Ameni)

---

## 1. Selección del Change y justificación preliminar

Siguiendo los criterios de la Etapa 6, se selecciona el change **`C-06 (appointments-no-overlap)`** de [CHANGES.md](../../CHANGES.md) porque:
1. Pertenece al núcleo del **MVP v1.0** recomendado en la Sección D del informe de Discovery ([docs/discovery/informe-discovery.md](../discovery/informe-discovery.md)).
2. Contiene reglas de negocio críticas y deterministas del dominio odontológico (multi-profesional, multi-sillón/box, duración variable por prestación y prevención estricta de solapamientos).
3. Tiene un alcance acotado a una funcionalidad atómica de dominio, ideal para especificarse con escenarios `Dado / Cuando / Entonces` y verificarse con tests automatizados bajo **Strict TDD**.

---

## 2. Estado actual del repositorio y del código

Se inspeccionó el repositorio mediante `openspec list --json` y el árbol de archivos:

- **OpenSpec (`openspec/`):** Inicializado con esquema `spec-driven` (`openspec/config.yaml`). Actualmente no hay changes abiertos (`"changes": []`) ni especificaciones consolidadas en `openspec/specs/`.
- **Fundación (`knowledge-base/`, `CHANGES.md`, `AGENTS.md`, `CLAUDE.md`, `.atl/skill-registry.md`):** 100% completada en las Etapas 3, 4 y 5, con el stack tecnológico confirmado (**TypeScript + Node.js + MySQL 8 + Vitest**).
- **Código de aplicación (`src/` y `tests/`):** No existe código productivo ni suite de tests creada aún. Dado que `C-06` depende conceptualmente de las entidades base (`Clinic`, `Professional`, `Chair`, `Service`, `Patient` definidas en `C-02`, `C-04` y `C-05`), el módulo de dominio de `C-06` deberá incluir los contratos/tipos mínimos de dichas entidades y un puerto `AppointmentRepository` para ser 100% autónomo y verificable mediante tests sin requerir infraestructura externa.

---

## 3. Relevamiento de la Knowledge Base ("Leer antes" de `C-06`)

De acuerdo con los punteros de `CHANGES.md` para `C-06`, se relevaron los siguientes documentos de `knowledge-base/`:

### 3.1 Modelo de Datos ([04_modelo_de_datos.md](../../knowledge-base/04_modelo_de_datos.md))
- **`Appointment` (Turno):**
  - Atributos clave: `id`, `clinic_id`, `patient_id`, `professional_id`, `chair_id`, `service_id`, `starts_at`, `ends_at`, `duration_minutes`, `status` (`pending | confirmed | checked_in | completed | cancelled | no_show`), `source` (`internal | online_24_7`).
- **`Service` (Prestación):** aporta `duration_minutes > 0` (ej. Consulta `30` min, Limpieza `45` min, Endodoncia `60` min) y `active`.
- **`Professional` y `Chair` (Sillón/Box):** recursos físicos y humanos que pertenecen a un `clinic_id` y no pueden ser asignados simultáneamente a dos turnos activos en el mismo intervalo.
- **Seed y datos de prueba:** obligación estricta (Ley 25.326 / Regla Dura #1 de `AGENTS.md`) de utilizar únicamente datos sintéticos/ficticios (ej. `"Consultorio Demo Sonrisa"`, `"Dra. Laura Gómez"`, `"Dr. Martín Pérez"`, `"Sillón 1"`, `"Box 2"`, `"Paciente Ficticio A"`).

### 3.2 Reglas de Negocio ([05_reglas_de_negocio.md](../../knowledge-base/05_reglas_de_negocio.md))
| Código | Regla | Impacto directo en el diseño de `C-06` |
|---|---|---|
| **`RN-AU-01`** | Aislamiento estricto por clínica (`clinic_id`) | Validar que `patient`, `professional`, `chair` y `service` pertenezcan al mismo `clinic_id` del turno. Turnos de otra clínica nunca interfieren ni pueden cruzarse. |
| **`RN-AG-01`** | No solapamiento por profesional | Para igual `(clinic_id, professional_id)`, ningún turno activo puede cumplir `nuevo.starts_at < existente.ends_at && nuevo.ends_at > existente.starts_at`. |
| **`RN-AG-02`** | No solapamiento por sillón/box | Para igual `(clinic_id, chair_id)`, ningún turno activo puede superponerse en `[starts_at, ends_at)`, incluso si se trata de profesionales distintos. |
| **`RN-AG-03`** | Validez de turnos contiguos | Intervalos semiabiertos `[starts_at, ends_at)`: si `existente.ends_at == nuevo.starts_at` (o `nuevo.ends_at == existente.starts_at`), **no** hay solapamiento y el turno es válido. |
| **`RN-AG-04`** | Duración variable por prestación | `ends_at` se calcula automáticamente como `starts_at + service.duration_minutes` (con `service.duration_minutes > 0`). |
| **`RN-AG-05`** | Estados que bloquean vs. estados que liberan | Solo los turnos activos (`pending`, `confirmed`, `checked_in`) bloquean la disponibilidad; los turnos en `cancelled` o `no_show` liberan de inmediato tanto al profesional como al sillón/box. |
| **`RN-AG-06`** | Consistencia temporal | `starts_at < ends_at`, `duration_minutes > 0` y recursos activos dentro de la clínica. |

### 3.3 Historia de Usuario y Flujo Principal ([06_funcionalidades.md](../../knowledge-base/06_funcionalidades.md) y [07_flujos_principales.md](../../knowledge-base/07_flujos_principales.md))
- **`US-004`:** Cubre los 6 criterios de aceptación (`CA-1` a `CA-6`) para crear un turno calculando la duración desde la prestación y rechazando superposiciones por profesional o por sillón/box.
- **Flujo 1:** Define los casos de éxito (creación atómica del turno) y de error (`409 Conflict` / error de dominio tipado diferenciando conflicto por profesional vs. conflicto por sillón/box, y `422` / `403` ante inconsistencia de tenant o datos inválidos).

---

## 4. Conclusión del Explore y recomendación para `Propose`

- **Viabilidad:** Alta. Las reglas de negocio están completamente especificadas y sin ambigüedades tras el cierre de las preguntas de prioridad Alta en `10_preguntas_abiertas.md`.
- **Fronteras (seams) para TDD identificadas:** Servicio de dominio `AppointmentService.createAppointment(...)` operando sobre el puerto `AppointmentRepository` con validación atómica de tenant, cálculo de `ends_at` y control de intersección de intervalos `[starts_at, ends_at)`.
- **Próximo paso:** Pasar a la fase **`Propose` (`/opsx:propose appointments-no-overlap`)** para generar `proposal.md`, `specs/appointments/spec.md`, `design.md` y `tasks.md`.
