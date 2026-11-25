# Spec Delta

## Purpose

Define el contrato de comportamiento para la creación de turnos odontológicos en un consultorio multi-profesional y multi-sillón/box, calculando la duración del turno a partir de la prestación odontológica, previniendo estrictamente solapamientos por profesional y por sillón/box, liberando bloques ante cancelación/ausencia y garantizando aislamiento multi-tenant por clínica.

## ADDED Requirements

### Requirement: Calculo automatico de duracion segun la prestacion odontologica
El sistema SHALL calcular la fecha y hora de fin del turno (`ends_at`) sumando `service.duration_minutes` (que MUST ser estrictamente mayor a cero) a la fecha y hora de inicio solicitada (`starts_at`) (`CA-1`, `RN-AG-04`).

#### Scenario: Escenario 1 (Feliz) — Crear turno con duracion variable cuando profesional y sillon estan libres
- **GIVEN** un consultorio activo (`"Consultorio Demo Sonrisa"`) con la profesional `"Dra. Laura Gómez"`, el sillón `"Sillón 1"`, la prestación `"Limpieza dental"` de `45` minutos de duración y el paciente ficticio `"Paciente Ficticio A"`, sin turnos superpuestos
- **WHEN** se solicita crear un turno para el `"Paciente Ficticio A"` con la `"Dra. Laura Gómez"` en el `"Sillón 1"` para `"Limpieza dental"` con inicio `"2026-11-25T10:00:00-03:00"`
- **THEN** el sistema crea y persiste el turno en estado activo (`confirmed`), asigna `duration_minutes = 45` y calcula exactamente `ends_at = "2026-11-25T10:45:00-03:00"`

### Requirement: Prevencion estricta de solapamiento por profesional
El sistema SHALL rechazar cualquier solicitud de creación de turno si el profesional asignado ya posee un turno en estado activo (`pending`, `confirmed`, `checked_in`) cuyo intervalo semiabierto `[starts_at, ends_at)` se superponga con el intervalo solicitado (`nuevo.starts_at < existente.ends_at AND nuevo.ends_at > existente.starts_at`), incluso cuando se seleccione un sillón/box diferente (`CA-2`, `RN-AG-01`).

#### Scenario: Escenario 2 (Error de negocio) — Rechazar turno por solapamiento del mismo profesional en otro sillon
- **GIVEN** que la `"Dra. Laura Gómez"` ya tiene un turno activo de `"2026-11-25T10:00:00-03:00"` a `"2026-11-25T10:45:00-03:00"` en el `"Sillón 1"`
- **WHEN** se solicita crear un segundo turno para la misma `"Dra. Laura Gómez"` en el `"Box 2"` (libre) con inicio `"2026-11-25T10:30:00-03:00"` y una prestación de `30` minutos (`ends_at = "2026-11-25T11:00:00-03:00"`)
- **THEN** el sistema rechaza la creación del turno con error de conflicto de disponibilidad por profesional (`PROFESSIONAL_OVERLAP`) y no persiste el turno

### Requirement: Prevencion estricta de solapamiento por sillon o box
El sistema SHALL rechazar cualquier solicitud de creación de turno si el sillón o box asignado ya posee un turno en estado activo cuyo intervalo semiabierto `[starts_at, ends_at)` se superponga con el intervalo solicitado, incluso cuando se asigne a un profesional diferente (`CA-3`, `RN-AG-02`).

#### Scenario: Escenario 3 (Error de negocio) — Rechazar turno por solapamiento del mismo sillon con otro profesional
- **GIVEN** que el `"Sillón 1"` ya está ocupado por un turno activo de la `"Dra. Laura Gómez"` de `"2026-11-25T10:00:00-03:00"` a `"2026-11-25T10:45:00-03:00"`
- **WHEN** se solicita crear un turno para otro profesional libre (`"Dr. Martín Pérez"`) en el mismo `"Sillón 1"` con inicio `"2026-11-25T10:15:00-03:00"` y una prestación de `30` minutos (`ends_at = "2026-11-25T10:45:00-03:00"`)
- **THEN** el sistema rechaza la creación del turno con error de conflicto de disponibilidad por sillón/box (`CHAIR_OVERLAP`) y no persiste el turno

### Requirement: Validez de turnos estrictamente contiguos
El sistema SHALL permitir la creación de un turno cuya fecha y hora de inicio coincida exactamente con la fecha y hora de fin de otro turno activo (`existente.ends_at == nuevo.starts_at`, o `nuevo.ends_at == existente.starts_at`) para el mismo profesional y/o el mismo sillón/box (`CA-4`, `RN-AG-03`).

#### Scenario: Escenario 4 (Caso de borde) — Permitir turno contiguo que inicia exactamente cuando termina el anterior
- **GIVEN** que la `"Dra. Laura Gómez"` tiene un turno activo en el `"Sillón 1"` de `"2026-11-25T10:00:00-03:00"` a `"2026-11-25T10:30:00-03:00"` (`30` minutos)
- **WHEN** se solicita crear un nuevo turno para la misma `"Dra. Laura Gómez"` en el mismo `"Sillón 1"` con inicio exactamente en `"2026-11-25T10:30:00-03:00"` y una prestación de `30` minutos (`ends_at = "2026-11-25T11:00:00-03:00"`)
- **THEN** el sistema considera que los intervalos semiabiertos `[10:00, 10:30)` y `[10:30, 11:00)` no se solapan y crea el segundo turno exitosamente

### Requirement: Liberacion de disponibilidad ante turnos cancelados o ausentes
El sistema SHALL considerar ocupados únicamente los turnos en estado activo (`pending`, `confirmed`, `checked_in`) y MUST permitir agendar un nuevo turno sobre un bloque horario cuyo turno previo se encuentre en estado `cancelled` o `no_show` (`CA-5`, `RN-AG-05`).

#### Scenario: Escenario 5 (Caso de borde) — Permitir agendar sobre un bloque cuyo turno previo fue cancelado o marcado ausente
- **GIVEN** que existía un turno para la `"Dra. Laura Gómez"` en el `"Sillón 1"` de `"2026-11-25T10:00:00-03:00"` a `"2026-11-25T10:45:00-03:00"` cuyo estado actual es `cancelled` (o `no_show`)
- **WHEN** se solicita crear un nuevo turno para el `"Paciente Ficticio B"` con la `"Dra. Laura Gómez"` en el `"Sillón 1"` en el mismo horario `"2026-11-25T10:00:00-03:00"` (`45` minutos)
- **THEN** el sistema ignora el turno inactivo (`cancelled`/`no_show`), considera libres tanto a la profesional como al sillón/box y crea el nuevo turno exitosamente

### Requirement: Aislamiento multi-tenant y consistencia de clinica
El sistema SHALL validar que el paciente, el profesional, el sillón/box y la prestación pertenezcan exactamente al mismo `clinic_id` del turno solicitado, rechazando cualquier cruce de recursos entre clínicas distintas (`CA-6`, `RN-AU-01`, `RN-AG-06`).

#### Scenario: Escenario 6 (Error de negocio / Seguridad) — Rechazar creacion de turno cuando una entidad pertenece a otro clinic_id
- **GIVEN** el `"Consultorio Demo Sonrisa"` con `clinic_id = "clinic-demo-sonrisa"` y un recurso (`Chair`, `Professional`, `Patient` o `Service`) registrado bajo otro `clinic_id` distinto (`"other-clinic-id"`)
- **WHEN** se solicita crear un turno en `"Consultorio Demo Sonrisa"` (`"clinic-demo-sonrisa"`) referenciando ese recurso que posee `"other-clinic-id"`
- **THEN** el sistema detecta que no todas las entidades pertenecen al mismo `clinic_id`, rechaza la creación con error de aislamiento multi-tenant (`TENANT_MISMATCH`) y no persiste el turno
