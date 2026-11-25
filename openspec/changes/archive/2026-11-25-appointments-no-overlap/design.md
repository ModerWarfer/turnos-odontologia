# Design

## Context

El repositorio cuenta con la fundación completa (`knowledge-base/`, `CHANGES.md`, `AGENTS.md`, `CLAUDE.md`) y el stack confirmado (**TypeScript + Node.js + MySQL 8 + Vitest**), pero sin código fuente previo en `src/` ni `tests/`. Para implementar `C-06 (appointments-no-overlap)` como una unidad funcional verificable y autónoma (ver `proposal.md` — *Why*), el diseño sigue la arquitectura de **Dominio + Puertos y Adaptadores (Repository Pattern)** definida en `knowledge-base/08_arquitectura_propuesta.md`.

## Goals / Non-Goals

**Goals:**
- Proveer un servicio de dominio puro (`AppointmentService`) en TypeScript sin acoplamiento a frameworks HTTP ni motores externos para que los escenarios del spec puedan ejecutarse de forma determinista mediante `npm test` (Vitest).
- Garantizar la semántica matemática de intervalos semiabiertos `[starts_at, ends_at)` sobre timestamps ISO-8601 con zona horaria explícita (`America/Argentina/Buenos_Aires`, `-03:00`).
- Tipar errores de dominio explícitos (`DomainError` con códigos `PROFESSIONAL_OVERLAP`, `CHAIR_OVERLAP`, `INVALID_SERVICE_DURATION`, `TENANT_MISMATCH`, `RESOURCE_NOT_FOUND`) para que cada escenario de error pueda verificarse sin ambigüedad.

**Non-Goals:**
- No se implementa interfaz gráfica web (`C-09` / `C-10`), ni endpoints públicos 24/7 (`C-07`), ni workers de WhatsApp (`C-08`).
- No se requiere un servidor MySQL corriendo en la máquina del evaluador para ejecutar `npm test`; el contrato `AppointmentRepository` abstrae la transacción SQL y se provee un adaptador transaccional en memoria (`InMemoryAppointmentRepository`) para la suite de verificación.

## Decisions

1. **Representación de intervalos semiabiertos `[starts_at, ends_at)`:**
   - **Decisión:** Dos intervalos $[A_{\text{start}}, A_{\text{end}})$ y $[B_{\text{start}}, B_{\text{end}})$ se solapan si y solo si:
     $$A_{\text{start}} < B_{\text{end}} \;\land\; A_{\text{end}} > B_{\text{start}}$$
   - **Justificación:** Si $A_{\text{end}} = B_{\text{start}}$ (turnos contiguos, ej. `10:00–10:30` y `10:30–11:00`), la condición $A_{\text{end}} > B_{\text{start}}$ evalúa a `false`, cumpliendo de manera natural `RN-AG-03` sin ramas especiales propensas a bugs de un minuto.
   - **Alternativa descartada:** Usar intervalos cerrados `[starts_at, ends_at]` restando 1 segundo o 1 milisegundo al final; ensucia los timestamps almacenados y complica el cálculo de duración.

2. **Desacoplamiento de persistencia vía `AppointmentRepository`:**
   - **Decisión:** Definir el puerto `AppointmentRepository` en `src/domain/appointment-repository.ts` y un adaptador en memoria en `src/infrastructure/in-memory-appointment-repository.ts` que almacena clínicas, profesionales, sillones, prestaciones, pacientes y turnos.
   - **Justificación:** Permite verificar todos los escenarios de `specs/appointments/spec.md` clonando el repositorio y ejecutando únicamente `npm install && npm test` (requisito de reproducibilidad del `README.md`), manteniendo el contrato exacto que luego implementa el adaptador MySQL 8 en producción (`SELECT ... FOR UPDATE` dentro de una transacción ACID).

3. **Cálculo de `ends_at` a partir del catálogo de prestaciones (`Service`):**
   - **Decisión:** `createAppointment` recibe `serviceId` (no un `ends_at` arbitrario del cliente), recupera la entidad `Service` del repositorio, verifica `durationMinutes > 0` y calcula `endsAt = new Date(startsAt.getTime() + service.durationMinutes * 60_000)`.
   - **Justificación:** Evita que un cliente manipule la duración de una prestación odontológica para forzar huecos inexistentes (`RN-AG-04`).

## Risks / Trade-offs

- **[Riesgo] Concurrencia en entorno multi-proceso MySQL** → En producción sobre MySQL 8, la verificación de solapamientos y el `INSERT` deben ejecutarse dentro de la misma transacción con bloqueo de rango por `(clinic_id, professional_id)` y `(clinic_id, chair_id)`. El puerto `AppointmentRepository` expone la operación de verificación y guardado para mantener esa frontera atómica.
- **[Riesgo] Desfase de zona horaria** → Todos los fixtures y validaciones operan con fechas ISO-8601 con offset explícito `-03:00` (`America/Argentina/Buenos_Aires`, `RN-GL-01`) o instancias `Date` comparadas por epoch en milisegundos UTC equivalentes.
