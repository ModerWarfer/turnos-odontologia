# Proposal

## Why

**Justificación de elección del change (`C-06 — appointments-no-overlap`):** Se eligió este change del roadmap (`CHANGES.md`) porque pertenece al corazón del MVP v1.0 recomendado en la Sección D del informe de Discovery, resuelve el problema crítico de prevención estricta de solapamientos multi-profesional y multi-sillón/box en consultorios odontológicos, y posee reglas de negocio deterministas (`RN-AG-01` a `RN-AG-06` y `RN-AU-01`) ideales para especificarse y verificarse con tests automatizados en una funcionalidad acotada.

Los consultorios odontológicos argentinos con múltiples profesionales y múltiples sillones/boxes sufren superposiciones de agenda cuando dos recepcionistas o canales asignan el mismo odontólogo o el mismo sillón físico en horarios que se intersecan, o cuando no se contempla la duración variable de cada prestación odontológica (`30`, `45`, `60` minutos). Implementar el motor de creación de turnos con validación atómica de disponibilidad es indispensable para habilitar toda la operación de agenda y los canales posteriores del MVP (reserva online 24/7 y recordatorios automáticos).

## What Changes

- Introducción del módulo de dominio de creación de turnos odontológicos (`AppointmentService`) con cálculo automático de `ends_at = starts_at + service.duration_minutes` (`CA-1`, `RN-AG-04`).
- Validación estricta de no solapamiento por profesional (`CA-2`, `RN-AG-01`): impide que un mismo odontólogo tenga dos turnos activos cuyos intervalos semiabiertos `[starts_at, ends_at)` se superpongan (`nuevo.starts_at < existente.ends_at && nuevo.ends_at > existente.starts_at`).
- Validación estricta de no solapamiento por sillón/box (`CA-3`, `RN-AG-02`): impide que un mismo sillón físico sea ocupado por dos turnos activos en intervalos que se intersecan, incluso cuando se asignen a profesionales distintos.
- Soporte para turnos estrictamente contiguos (`CA-4`, `RN-AG-03`): permite que un nuevo turno comience exactamente en el instante en que finaliza otro (`existente.ends_at == nuevo.starts_at`).
- Liberación inmediata de disponibilidad ante estados inactivos (`CA-5`, `RN-AG-05`): los turnos en estado `cancelled` o `no_show` no bloquean al profesional ni al sillón/box.
- Validación estricta de aislamiento multi-tenant (`CA-6`, `RN-AU-01`, `RN-AG-06`): verifica que paciente, profesional, sillón/box y prestación pertenezcan al mismo `clinic_id`.
- Contratos de tipos base del dominio (`Clinic`, `Professional`, `Chair`, `Service`, `Patient`, `Appointment`), errores tipados de dominio y puerto `AppointmentRepository` con adaptador transaccional en memoria para verificación autónoma con Vitest.

## Capabilities

### New Capabilities
- `appointments`: Creación de turnos odontológicos con cálculo de duración variable por prestación, prevención estricta de solapamientos por profesional y por sillón/box, liberación por cancelación/ausencia y aislamiento multi-tenant por clínica.

### Modified Capabilities
<!-- No existing capabilities are modified in this initial change. -->

## Impact

- **Código afectado (`src/`):**
  - `src/domain/types.ts` (entidades y tipos del dominio odontológico).
  - `src/domain/errors.ts` (errores tipados de conflicto de profesional, sillón, aislamiento multi-tenant y validación).
  - `src/domain/appointment-repository.ts` (puerto de persistencia del dominio).
  - `src/domain/appointment-service.ts` (servicio de creación de turnos y validación de solapamientos).
  - `src/infrastructure/in-memory-appointment-repository.ts` (adaptador transaccional determinista para pruebas).
- **Tests (`tests/`):**
  - `tests/appointments-no-overlap.test.ts` (suite automatizada en Vitest cubriendo los 6 escenarios `CA-1` a `CA-6` de `specs/appointments/spec.md` con datos 100% ficticios conforme a la Ley 25.326).
