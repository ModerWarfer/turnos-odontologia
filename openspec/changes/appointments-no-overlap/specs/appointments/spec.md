# Spec Delta

## Purpose

Defines the behavioral contract for scheduling dental appointments in a multi-professional, multi-chair clinic, calculating appointment duration from the dental service and strictly preventing time overlaps per professional and per dental chair/box.

## ADDED Requirements

### Requirement: Automatic duration calculation from dental service
The system SHALL calculate the appointment end timestamp (`ends_at`) by adding the selected dental service's `duration_minutes` (which MUST be strictly greater than zero) to the requested `starts_at` timestamp (`RN-AG-04`).

#### Scenario: Escenario 1 (Feliz) — Crear turno con duracion variable cuando profesional y sillon estan libres
- **GIVEN** un consultorio activo con la profesional `"Dra. Laura Gómez"`, el sillón `"Sillón 1"`, la prestación `"Limpieza dental"` de `45` minutos de duración y el paciente ficticio `"Paciente Ficticio A"`, sin turnos superpuestos
- **WHEN** se solicita crear un turno para el `"Paciente Ficticio A"` con la `"Dra. Laura Gómez"` en el `"Sillón 1"` para `"Limpieza dental"` con inicio `"2026-11-25T10:00:00-03:00"`
- **THEN** el sistema crea y persiste el turno en estado activo (`confirmed`), asigna `duration_minutes = 45` y calcula exactamente `ends_at = "2026-11-25T10:45:00-03:00"`

### Requirement: Prevent time overlap for the same professional
The system SHALL reject any appointment creation request if the assigned professional already has an active appointment whose half-open time interval `[starts_at, ends_at)` overlaps with the requested interval (`nuevo.starts_at < existente.ends_at AND nuevo.ends_at > existente.starts_at`), even when a different chair/box is selected (`RN-AG-01`).

#### Scenario: Escenario 2 (Error de negocio) — Rechazar turno por solapamiento del mismo profesional en otro sillon
- **GIVEN** que la `"Dra. Laura Gómez"` ya tiene un turno activo de `"2026-11-25T10:00:00-03:00"` a `"2026-11-25T10:45:00-03:00"` en el `"Sillón 1"`
- **WHEN** se solicita crear un segundo turno para la misma `"Dra. Laura Gómez"` en el `"Box 2"` (libre) con inicio `"2026-11-25T10:30:00-03:00"` y una prestación de `30` minutos (`ends_at = "2026-11-25T11:00:00-03:00"`)
- **THEN** el sistema rechaza la creación del turno con error de conflicto de disponibilidad por profesional (`PROFESSIONAL_OVERLAP`) y no persiste el turno

### Requirement: Prevent time overlap for the same dental chair or box
The system SHALL reject any appointment creation request if the assigned dental chair/box already has an active appointment whose half-open time interval `[starts_at, ends_at)` overlaps with the requested interval, even when a different professional is assigned (`RN-AG-02`).

#### Scenario: Escenario 3 (Error de negocio) — Rechazar turno por solapamiento del mismo sillon con otro profesional
- **GIVEN** que el `"Sillón 1"` ya está ocupado por un turno activo de la `"Dra. Laura Gómez"` de `"2026-11-25T10:00:00-03:00"` a `"2026-11-25T10:45:00-03:00"`
- **WHEN** se solicita crear un turno para otro profesional libre (`"Dr. Martín Pérez"`) en el mismo `"Sillón 1"` con inicio `"2026-11-25T10:15:00-03:00"` y una prestación de `30` minutos (`ends_at = "2026-11-25T10:45:00-03:00"`)
- **THEN** el sistema rechaza la creación del turno con error de conflicto de disponibilidad por sillón/box (`CHAIR_OVERLAP`) y no persiste el turno

### Requirement: Allow strictly contiguous appointments
The system SHALL allow creating an appointment whose start timestamp equals the exact end timestamp of an existing active appointment (`existente.ends_at == nuevo.starts_at`, or `nuevo.ends_at == existente.starts_at`) for the same professional and/or the same dental chair/box (`RN-AG-03`).

#### Scenario: Escenario 4 (Caso de borde) — Permitir turno contiguo que inicia exactamente cuando termina el anterior
- **GIVEN** que la `"Dra. Laura Gómez"` tiene un turno activo en el `"Sillón 1"` de `"2026-11-25T10:00:00-03:00"` a `"2026-11-25T10:30:00-03:00"` (`30` minutos)
- **WHEN** se solicita crear un nuevo turno para la misma `"Dra. Laura Gómez"` en el mismo `"Sillón 1"` con inicio exactamente en `"2026-11-25T10:30:00-03:00"` y una prestación de `30` minutos (`ends_at = "2026-11-25T11:00:00-03:00"`)
- **THEN** el sistema considera que los intervalos semiabiertos `[10:00, 10:30)` y `[10:30, 11:00)` no se solapan y crea el segundo turno exitosamente
