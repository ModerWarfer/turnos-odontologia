# Tasks

## 1. Setup y Contratos de Dominio

- [ ] 1.1 Configurar `package.json`, `tsconfig.json` y `vitest.config.ts` y verificar que `npm test` inicialice Vitest sin errores de configuración.
- [ ] 1.2 Definir tipos y entidades de dominio (`Clinic`, `Professional`, `Chair`, `Service`, `Patient`, `Appointment`, `AppointmentStatus`) en `src/domain/types.ts` y errores tipados (`DomainError`) en `src/domain/errors.ts`, verificando compilación TypeScript limpia.
- [ ] 1.3 Definir el puerto `AppointmentRepository` en `src/domain/appointment-repository.ts` y su adaptador en memoria `InMemoryAppointmentRepository` en `src/infrastructure/in-memory-appointment-repository.ts` con seed de datos 100% ficticios (Ley 25.326).

## 2. Creacion de Turno y Calculo de Duracion (TDD)

- [ ] 2.1 Escribir test (RED) y luego implementar (GREEN) en `src/domain/appointment-service.ts` el Escenario 1 (creación feliz calculando `ends_at = starts_at + service.duration_minutes`), verificando que `npm test` pase en verde para dicho escenario.

## 3. Prevencion de Solapamientos y Casos de Borde (TDD)

- [ ] 3.1 Escribir test (RED) y luego implementar (GREEN) la validación de no solapamiento por profesional (`RN-AG-01` — Escenario 2: rechazo con código `PROFESSIONAL_OVERLAP` incluso en otro sillón/box), verificando que `npm test` pase en verde.
- [ ] 3.2 Escribir test (RED) y luego implementar (GREEN) la validación de no solapamiento por sillón/box (`RN-AG-02` — Escenario 3: rechazo con código `CHAIR_OVERLAP` incluso con otro profesional), verificando que `npm test` pase en verde.
- [ ] 3.3 Escribir test (RED) y verificar/ajustar (GREEN) el soporte de turnos estrictamente contiguos (`RN-AG-03` — Escenario 4: `existente.ends_at == nuevo.starts_at` permitido para mismo profesional y mismo sillón/box), verificando que `npm test` pase en verde.

## Workflow follow-up

- Ejecutar suite completa de tests (`npm test`) en la fase Verify confirmando 100% de escenarios en verde.
- Sincronizar `specs/appointments/spec.md` hacia `openspec/specs/appointments/spec.md` y archivar el change una vez aprobada la verificación.
