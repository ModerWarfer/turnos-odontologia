# Turnos Odontología — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

---

## Stack Tecnológico

> El proyecto permanece **agnóstico al stack** hasta que el equipo resuelva la selección técnica en `knowledge-base/10_preguntas_abiertas.md`. Entorno base preparado en Etapa 0: Go, Node.js y Git.

| Capa | Tecnologías | Versión mínima / Estado |
|------|-------------|-------------------------|
| **Modalidad y plataforma** | Cloud SaaS multi-tenant, aplicación web responsive multi-dispositivo | Definido en Discovery |
| **Backend / API** | Por definir (no especificado en Discovery; entorno base con Go y Node.js disponibles) | Pendiente de decisión técnica |
| **Frontend Web** | Por definir (no especificado en Discovery; entorno base con Node.js disponible) | Pendiente de decisión técnica |
| **Base de datos** | Por definir (requiere soporte transaccional ACID para prevención estricta de solapamientos) | Pendiente de decisión técnica |
| **Cola / Scheduler** | Por definir (para programación y envío idempotente de recordatorios) | Pendiente de decisión técnica |
| **Testing** | Tests automatizados cubriendo escenarios Dado/Cuando/Entonces y health checks | Requerido por Etapa 6 OPSX |
| **Integraciones v1.0** | WhatsApp Business API (plantillas Meta aprobadas), Email transaccional | MVP núcleo |
| **Integraciones v1.1** | Mercado Pago (señas), ARCA (facturación CAE), Google Calendar | Post-MVP núcleo |

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---------|---------------|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Entender propósito, actores y división MVP v1.0 vs v1.1 |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack, arquitectura general, integraciones y API preliminar |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Auth, matriz RBAC y rutas públicas sin contraseña |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, ERD multi-tenant, constraints y seed ficticio |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas (`RN-AU`, `RN-AG`, `RN-RO`, `RN-RC`, `RN-LG`, `RN-GL`) |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Épicas e historias de usuario (`US-001` a `US-012`) |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos extremo a extremo y casos de error |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, estructura de directorios, seguridad y env vars |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones documentadas (`DD-*`) y supuestos (`SU-*`) |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Inconsistencias (`IN-*`) y decisiones técnicas pendientes ANTES de codear |

> ⚠️ Resolver las preguntas de prioridad **Alta** de `knowledge-base/10_preguntas_abiertas.md` (en particular el stack concreto) antes de arrancar la implementación de `C-01` o la Etapa 6.

---

## Skills Disponibles

| Agente | Rol | Skills que carga |
|--------|-----|------------------|
| **Backend Core / Dominio** | Motor de agenda anti-solapamientos, modelos core, transacciones y migraciones | `tdd`, `security-and-hardening` |
| **Backend Aux / Integraciones** | Reserva online 24/7, recordatorios WhatsApp/Email, webhooks | `tdd`, `security-and-hardening` |
| **Frontend / Portal Público** | Agenda web staff y portal de reserva pública 24/7 | `tdd`, `security-and-hardening` |
| **OPSX / Implementación SDD** | Ciclo Explore → Propose → Apply → Verify → Archive sobre changes | `openspec-explore`, `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-sync-specs`, `openspec-update-change` |
| **Fundación / Documentación** | Orquestación de etapas, KB, roadmap y skills | `active-orchestrator`, `kb-creator`, `roadmap-generator`, `find-skill`, `agent-instruction`, `skill-creator` |

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`). Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 14 changes en 7 fases (10 del **MVP v1.0** `C-01`..`C-10` + 4 de extensión **v1.1** `C-11`..`C-14`).
- **Camino crítico MVP v1.0 (7)**: `C-01 → C-02 → C-03 → C-05 → C-06 → C-07 → C-10*`.
- **Primer change técnico**: `C-01` (`foundation-setup`).
- **Change acotado recomendado para Etapa 6 (ciclo OPSX)**: `C-06` (`appointments-no-overlap` — creación de turno evitando solapamientos por profesional y por sillón/box).

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras (específicas del proyecto)

> En este equipo no existe `~/.claude/CLAUDE.md` global (la configuración de `sdd-orchestrator` vive solo en OpenCode). Estas reglas consolidan las restricciones obligatorias del dominio odontológico, seguridad y flujo de trabajo del repositorio. Son contrato; romperlas es un defecto.

1. **Privacidad clínica (Ley 25.326):** `NUNCA` commitear datos reales de pacientes, DNI, teléfonos reales ni historias clínicas en código, seeds, fixtures o documentación → usar exclusivamente datos ficticios/anónimos.
2. **Aislamiento multi-tenant (`RN-AU-01`):** `NUNCA` ejecutar lecturas o escrituras autenticadas sin filtrar por el `clinic_id` de la sesión ni confiar en un `clinic_id` enviado libremente por el cliente → derivar el tenant del token/sesión (o del `clinicSlug` en rutas públicas).
3. **Prevención estricta de solapamientos (`RN-AG-01` a `RN-AG-05`):** `NUNCA` validar disponibilidad solo en frontend ni omitir el control por sillón/box → validar atómicamente en transacción de dominio/BD que `[starts_at, ends_at)` no se solape ni por profesional ni por sillón/box (turnos contiguos `A.ends_at == B.starts_at` son válidos; estados `cancelled`/`no_show` liberan el bloque).
4. **Privacidad en reserva online 24/7 (`RN-AU-03`):** `NUNCA` exponer nombres, datos de contacto ni turnos de otros pacientes en endpoints públicos → devolver únicamente franjas horarias libres.
5. **Recordatorios WhatsApp y costos Meta (`RN-RC-01` a `RN-RC-03`):** `NUNCA` enviar mensajes proactivos fuera de plantillas aprobadas por Meta ni sin `idempotency_key` → garantizar unicidad de envío y cancelar recordatorios `scheduled` ante cancelación o reprogramación.
6. **Zona horaria y veracidad (`RN-GL-01`, `RN-GL-02`):** `NUNCA` asumir UTC sin conversión ni inventar capacidades no respaldadas por `knowledge-base/` → operar horarios de agenda en `America/Argentina/Buenos_Aires` y registrar dudas en `knowledge-base/10_preguntas_abiertas.md`.
7. **Flujo Git, secretos y alcance OPSX:** `NUNCA` pushear directo a `main`, hardcodear secretos ni improvisar código fuera de un change aprobado → trabajar en rama propia con commits atómicos (`docs:`, `chore:`, `feat:`, `test:`), PR revisado, variables en `.env.example` y tests automatizados en verde para cada escenario de la spec.

---

## Flujo de Trabajo

```text
1. Leer la KB relevante (knowledge-base/)        → entender el dominio y reglas RN-*
2. Identificar el change en CHANGES.md           → respetar dependencias y gates
3. /opsx:propose <nombre-del-change>             → proposal + specs + design + tasks
4. Implementar las tasks (cargando skills)       → respetando TDD, seguridad y reglas duras
5. /opsx:archive <nombre-del-change> + marcar [x]→ cerrar el change y actualizar specs
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.

