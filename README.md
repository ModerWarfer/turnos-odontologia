# Turnos Odontología — Sistema SaaS de Gestión de Turnos y Agenda Odontológica

Trabajo Integrador de **Desarrollo de Software** — Metodología **Spec-Driven Development (SDD)** con **OpenSpec (OPSX)** y **Active Stack**.

El producto es un sistema Cloud SaaS multi-tenant para la gestión de turnos y agenda de pacientes en consultorios y clínicas odontológicas de Argentina, diseñado a partir de evidencia verificable de mercado (Discovery), fundado con una Base de Conocimiento de 10 documentos canónicos, un Roadmap operativo (`CHANGES.md`), reglas de agente (`AGENTS.md` / `CLAUDE.md`) y un ciclo completo **OPSX** (`Explore → Propose → Ajustar → Apply → Verify → Archive`) sobre el change **`C-06: appointments-no-overlap`** (*"Crear un turno evitando solapamientos por profesional y por sillón/box"*).

---

## Requisitos previos

- **Node.js** `v20+` (incluye `npm`)
- **Git**

*(No se requiere servidor de base de datos externo ni variables secretas para ejecutar la suite de verificación: el módulo de dominio utiliza el patrón Repository con un adaptador transaccional en memoria precargado con datos 100% ficticios conforme a la Ley 25.326).*

---

## Cómo clonar, instalar y ejecutar los tests (Reproducibilidad)

```bash
# 1. Clonar el repositorio
git clone https://github.com/ModerWarfer/turnos-odontologia.git
cd turnos-odontologia

# 2. Instalar dependencias (TypeScript + Vitest)
npm install

# 3. Ejecutar la suite automatizada de tests de todos los escenarios del spec
npm test
```

Para verificar además el chequeo estático de tipos de TypeScript:

```bash
npm run typecheck
```

---

## Escenarios verificados en el Change OPSX (`C-06: appointments-no-overlap`)

La especificación vigente en [`openspec/specs/appointments/spec.md`](openspec/specs/appointments/spec.md) (y archivada en [`openspec/changes/archive/2026-11-25-appointments-no-overlap/`](openspec/changes/archive/2026-11-25-appointments-no-overlap/)) define **6 requisitos (`CA-1` a `CA-6` de `US-004`)**, verificados mediante **12 tests automatizados** en [`tests/appointments-no-overlap.test.ts`](tests/appointments-no-overlap.test.ts):

1. **Escenario 1 (Feliz — `CA-1` / `RN-AG-04`):** Creación exitosa de turno calculando automáticamente `ends_at = starts_at + service.duration_minutes` (`30`, `45` y `60` minutos) cuando profesional y sillón/box están libres.
2. **Escenario 2 (Error de negocio — `CA-2` / `RN-AG-01`):** Rechazo con código `PROFESSIONAL_OVERLAP` cuando el profesional ya posee un turno activo cuyo intervalo `[starts_at, ends_at)` se superpone, incluso si se selecciona otro sillón/box libre.
3. **Escenario 3 (Error de negocio — `CA-3` / `RN-AG-02`):** Rechazo con código `CHAIR_OVERLAP` cuando el sillón/box ya está ocupado por otro turno activo en un intervalo que se superpone, incluso si se asigna a otro profesional distinto.
4. **Escenario 4 (Caso de borde — `CA-4` / `RN-AG-03`):** Validez de turnos estrictamente contiguos donde el nuevo turno comienza exactamente cuando termina otro (`existente.ends_at == nuevo.starts_at`, ej. `10:00–10:30` y `10:30–11:00`).
5. **Escenario 5 (Caso de borde agregado con *Ajustar* — `CA-5` / `RN-AG-05`):** Liberación inmediata del bloque horario (profesional y sillón/box) cuando el turno previo en ese horario se encuentra en estado `cancelled` o `no_show`.
6. **Escenario 6 (Seguridad / Multi-tenancy agregado con *Ajustar* — `CA-6` / `RN-AU-01`):** Rechazo con código `TENANT_MISMATCH` cuando alguna entidad referenciada (`Professional`, `Chair`, `Service`, `Patient`) pertenece a un `clinic_id` distinto al del consultorio del turno.

---

## Estructura del repositorio

```text
turnos-odontologia/
├── AGENTS.md                        # Instrucciones canónicas y reglas duras del dominio odontológico
├── CLAUDE.md                        # Copia sincronizada de AGENTS.md
├── CHANGES.md                       # Roadmap de 14 changes, dependencias, gates y camino crítico
├── .active-orchestrator-state.json  # Estado de las etapas de fundación y cierre OPSX
├── .atl/
│   └── skill-registry.md            # Registro de skills, reglas compactas y evaluación find-skill
├── docs/
│   ├── discovery/
│   │   └── informe-discovery.md     # Informe consolidado de Discovery (Secciones A, B, C y D)
│   └── opsx/
│       └── explore-appointments-no-overlap.md # Relevamiento de la fase Explore (C-06)
├── discovery/
│   ├── discovery.md                 # Checklist de 11 puntos de discovery-research
│   └── sources/                     # 21 fichas individuales de competidores relevados
├── knowledge-base/                  # Los 10 archivos canónicos de la Base de Conocimiento
│   ├── 01_vision_y_objetivos.md
│   ├── 02_descripcion_general.md
│   ├── 03_actores_y_roles.md
│   ├── 04_modelo_de_datos.md
│   ├── 05_reglas_de_negocio.md
│   ├── 06_funcionalidades.md
│   ├── 07_flujos_principales.md
│   ├── 08_arquitectura_propuesta.md
│   ├── 09_decisiones_y_supuestos.md
│   └── 10_preguntas_abiertas.md
├── openspec/
│   ├── config.yaml
│   ├── specs/
│   │   └── appointments/
│   │       └── spec.md              # Especificación vigente sincronizada tras Archive
│   └── changes/
│       └── archive/
│           └── 2026-11-25-appointments-no-overlap/
│               ├── proposal.md      # Justificación y alcance del change C-06
│               ├── design.md        # Diseño técnico y decisiones de arquitectura
│               ├── tasks.md         # Checklist de 9 tareas TDD completadas [x]
│               └── specs/
│                   └── appointments/
│                       └── spec.md  # Spec delta aprobada tras aplicar Ajustar
├── src/
│   ├── domain/
│   │   ├── types.ts                 # Entidades y contratos tipados del dominio
│   │   ├── errors.ts                # Errores de dominio tipados (DomainError)
│   │   ├── appointment-repository.ts# Puerto de repositorio del dominio
│   │   └── appointment-service.ts   # Lógica de creación de turnos sin solapamientos
│   └── infrastructure/
│       └── in-memory-appointment-repository.ts # Adaptador en memoria con seed ficticio
├── tests/
│   └── appointments-no-overlap.test.ts         # Suite Vitest (12 tests en verde)
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## Privacidad y cumplimiento normativo

En cumplimiento de la **Ley 25.326 (Protección de Datos Personales)** y las reglas duras de [`AGENTS.md`](AGENTS.md), este repositorio no contiene ningún dato real de pacientes, DNI, teléfonos reales ni credenciales o secretos de API. Todos los seeds y casos de prueba utilizan entidades 100% sintéticas (`"Consultorio Demo Sonrisa"`, `"Dra. Laura Gómez"`, `"Dr. Martín Pérez"`, `"Sillón 1"`, `"Box 2"`, `"Paciente Ficticio A/B"`).
