# Preguntas Abiertas

## Inconsistencias detectadas

### IN-01 — Alcance del MVP entre `COORDINACION-EQUIPO.md` y `docs/discovery/informe-discovery.md`
**Documento A dice** (`COORDINACION-EQUIPO.md`): Define el MVP en 4 puntos acotados: ficha básica de paciente, agenda multi-profesional/multi-sillón sin solapamientos y duración variable, reserva online 24/7 y recordatorios automáticos por WhatsApp.
**Documento B dice** (`docs/discovery/informe-discovery.md`, Secciones 3 y 7): Lista 8 "Casos de uso MVP / Imprescindibles", sumando seña online (Mercado Pago), HC + odontograma FDI versionado, presupuestos/cobros/caja diaria, facturación ARCA y portal sin contraseña.
**Impacto**: Sin una separación explícita, el roadmap (`CHANGES.md`) y los specs OPSX podrían sobredimensionar la primera entrega académica.
**Resolución propuesta**: Mantener los 4 pilares de `COORDINACION-EQUIPO.md` como **v1.0 (MVP Núcleo)** y los 4 módulos adicionales como **v1.1 (Extensión Imprescindibles)**, tal como se estructuró en esta KB, y confirmarlo en la revisión de cierre de Etapa 3.

### IN-02 — Rol de Laboratorio dental en el informe de Discovery
**Documento A dice** (`docs/discovery/informe-discovery.md` §3 Usuarios): Incluye "Laboratorios dentales (integración, opcional)".
**Documento B dice** (`docs/discovery/informe-discovery.md` §7 Postergados): Clasifica "Módulo de laboratorio dental" explícitamente como **Postergado**.
**Impacto**: Podría generar dudas sobre si modelar entidades o permisos de laboratorio en v1.0.
**Resolución propuesta**: Mantener el actor documentado como referencia en `03_actores_y_roles.md` sin permisos ni tablas en v1.0/v1.1 (postergado a v2+).

### IN-03 — Desalineación de esquema y encoding en `.active-orchestrator-state.json`
**Documento A dice** (`.active-orchestrator-state.json`): Tiene `"version": 5` con estructura `foundation.phases` (y textos con caracteres mal decodificados en el bloque `discovery`, ej. `clnicas`).
**Documento B dice** (`kb-creator/assets/state-contract.md`): El contrato automático de `kb-creator` espera `"version": 2` y escribe en `state.kb`.
**Impacto**: La actualización automática de `state.kb` se omitió por incompatibilidad de versión (`version != 2`) para evitar corromper el estado v5 existente.
**Resolución propuesta**: En el checkpoint con el usuario/equipo, actualizar manualmente (o mediante el paso de cierre documentado en `COORDINACION-EQUIPO.md`) el estado de la fase `kb` en `.active-orchestrator-state.json` y corregir los caracteres corruptos si corresponde.

---

## Incertidumbres de Discovery (Mode A)

- **[DISCOVERY] `stack` could not be inferred with confidence from the source docs.**
  En `docs/discovery/informe-discovery.md` se define modalidad Cloud SaaS, pero no se eligió lenguaje backend, framework frontend ni motor de base de datos (en Etapa 0 solo consta que el entorno tiene instalados Go, Node.js y Git). **Please confirm:** ¿Qué stack exacto usará el equipo (ej. Go + PostgreSQL + React/Next.js, o Node.js/TypeScript + PostgreSQL + React)?
- **[DISCOVERY] `needs_infra` inferred as `true` (medium confidence).**
  Se infiere `true` por ser Cloud SaaS multi-tenant con base de datos, scheduler de recordatorios y webhooks externos (WhatsApp/Mercado Pago), pero no está definido el proveedor de hosting/DB/cola ni si en desarrollo local se usará Docker o SQLite/Postgres nativo. **Please confirm:** ¿Infraestructura target y estrategia de persistencia local para Etapa 6?

---

## Preguntas abiertas (priorizadas)

| Prioridad | Pregunta | Bloquea | Decisor |
|---|---|---|---|
| **Alta** | ¿Cuál será el stack tecnológico oficial del proyecto (lenguaje backend, framework frontend, motor de base de datos y runner de tests)? | Etapa 4 (`CHANGES.md`), Etapa 5 (`AGENTS.md` / `find-skill`) y Etapa 6 (OPSX) | Equipo (A+B+C) |
| **Alta** | ¿Se confirma la división **v1.0 (4 pilares de `COORDINACION-EQUIPO.md`)** vs **v1.1 (otros 4 imprescindibles del Discovery)** para el roadmap? | Etapa 4 (`CHANGES.md`) | Equipo (A+B+C) |
| **Alta** | Reglas de borde de agenda para el primer change OPSX: ¿el consultorio puede habilitar sobreagendamiento excepcional (por recepción, nunca online)? ¿Existe algún tipo de turno que no ocupe sillón/box? ¿Cuál es la anticipación mínima para reservar/cancelar online? | Etapa 6 (`Explore` / `Propose`) | Integrante C + Equipo |
| **Media** | Política de recordatorios WhatsApp: ¿cuántas ventanas previas (ej. 24h y 2h antes) se enviarán por defecto y cuál es el tope de gasto por plantillas Meta? | Épica 4 (Recordatorios) | Product Owner / Equipo |
| **Media** | ¿Cómo se concilia un paciente que reserva online 24/7 si ya existía en la clínica (por DNI, teléfono WhatsApp o email)? | Épica 1 y Épica 3 | Equipo técnico |
| **Media** | ¿El modelo de pricing en ARS será por institución (como ClínIA) o por profesional/agenda (como Dentidad/DrApp)? | Módulo comercial / planes SaaS | Equipo (A+B+C) |
| **Baja** | ¿Cuáles son los umbrales numéricos objetivo para las métricas de éxito (ej. % reducción de no-show, % adopción online)? | Métricas de producto | Equipo (A+B+C) |
| **Baja** | Confirmación final post-MVP de: módulo de laboratorio dental, cobertura de obras sociales (PUCO) y teleconsulta (preguntas heredadas de `discovery.md` §3). | Roadmap v2+ | Equipo (A+B+C) |

