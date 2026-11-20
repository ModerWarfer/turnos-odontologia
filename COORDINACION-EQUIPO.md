# Coordinación de equipo — Turnos Odontología (SaaS)

**Repositorio oficial:** https://github.com/ModerWarfer/turnos-odontologia\
**Rama principal:** `main`\
**Producto:** Sistema SaaS de gestión de turnos y agenda de pacientes para consultorios odontológicos (Argentina).\
**Metodología:** I — TUP (trabajo universitario por etapas, asíncrono, un único repositorio).

---

## 1. Estado actual del proyecto (qué ya está hecho y dónde está en el repo)

### Entregables versionados en `main`

| Etapa | Estado | Artefactos en el repo |
| --- | --- | --- |
| Etapa 0 — Preparación del entorno | ✅ Completada | Go, Git, Node.js, Active Stack (modo Full), repo inicializado |
| Etapa 1 — Fundación | ✅ Completada | `openspec/` (init con `--tools opencode`), `openspec/config.yaml` (schema `spec-driven`), `.active-orchestrator-state.json` (v5, foundation v1) |
| Etapa 2 — Discovery (investigación de mercado) | ✅ Completada y subida (commit `cabef66`) | `discovery/sources/` (21 fichas de sistemas odontológicos), `discovery/discovery.md`, `docs/discovery/informe-discovery.md` |

### Reglas de trabajo asíncrono (obligatorias)

- **Un único repositorio.** Todo el trabajo se integra en `main` vía Pull Request. No se crean repos paralelos ni forks para el proyecto.
- **Ramas propias por integrante/etapa.** Cada integrante trabaja en su rama (`feat/<etapa>-<nombre>`, `docs/<etapa>-<nombre>`) y abre PR hacia `main`.
- **Revisión obligatoria entre etapas.** Toda etapa se cierra con una decisión explícita **Continuar / Ajustar / Parar acá** (el responsable documenta la decisión tomada antes de pasar a la etapa siguiente) antes de pasar a la siguiente. Ningún integrante avanza si la etapa anterior no está validada.
- **Prohibición de datos reales de pacientes.** Ningún dato clínico, personal o de salud real se commitea. Solo datos ficticios/anónimos y ejemplos.
- **Commits atómicos y descriptivos.** Un commit = un cambio coherente. Mensajes con prefijo (`docs:`, `chore:`, `feat:`, `test:`).

### MVP definido en Discovery (no cambiar sin consenso del equipo)

- Ficha básica de paciente.
- Agenda multi-profesional y multi-sillón/box con prevención estricta de solapamientos y duración variable por prestación.
- Reserva de turnos online 24/7.
- Recordatorios automáticos por WhatsApp.

---

## 2. División de roles y responsabilidades

| Integrante | Rol | Etapas ya completadas | Tareas pendientes |
| --- | --- | --- | --- |
| **A — Líder de Discovery** | Investigación y evidencias | 0, 1, 2 | Revisar coherencia de la KB (Etapa 3) y del spec OPSX (Etapa 6); aportar documento de evidencias/verificación de fuentes para la entrega final; presentar su parte en el video de defensa. |
| **B — Fundación del proyecto** | KB, Roadmap, Skills/Agents | — (SIGUIENTE EN ACTUAR) | Etapa 3: Knowledge Base (10 archivos canónicos en `knowledge-base/` con `kb-creator` en modo import sobre `docs/discovery/informe-discovery.md`). <br>Etapa 4: Roadmap (`CHANGES.md` alineado al MVP). <br>Etapa 5: Skills (`.atl/skill-registry.md`), `AGENTS.md` y `CLAUDE.md` con reglas propias del dominio odontológico. |
| **C — Ciclo OPSX, Memoria y Cierre** | Implementación y cierre | — | Etapa 6: ciclo completo Explore → Propose → Apply → Verify → Archive sobre un único change acotado del MVP (recomendado: *"Crear un turno evitando solapamientos por profesional y por sillón/box"*, con ≥3 escenarios verificables y tests en verde). <br>Etapa 7: evidencia y consulta de recuperación de contexto en Engram. Armado del `README` reproducible. |

### Tareas grupales de cierre (los 3)

- Redacción conjunta de la reflexión escrita (1–2 páginas): hallazgos del Discovery, uso real de "Ajustar", valor de la fundación, reparto de tareas.
- Grabación del video de defensa (8–12 minutos) con participación de los 3 integrantes.

---

## 3. Qué falta por hacer (checklist secuencial hasta la entrega)

| # | Entregable | Responsable | Criterio de aceptación (rúbrica) |
| --- | --- | --- | --- |
| 1 | Knowledge Base (10 archivos canónicos en `knowledge-base/`) | B | Generada con `kb-creator` en modo import a partir de `docs/discovery/informe-discovery.md`; coherente con el Discovery; sin datos reales de pacientes. |
| 2 | Roadmap `CHANGES.md` alineado al MVP | B | Lista de changes con dependencias, gobernanza y "Leer antes" apuntando a la KB. |
| 3 | Skills y registro (`.atl/skill-registry.md`) | B | **Paso 1 obligatorio: ejecutar** **`find-skill`** **y documentar/justificar en una línea qué skills recomendadas se instalan y cuáles se descartan.** Luego generar `.atl/skill-registry.md`, `AGENTS.md` y `CLAUDE.md`. Índice reproducible. |
| 4 | `AGENTS.md` / `CLAUDE.md` con reglas del dominio | B | Reglas propias del dominio odontológico; referencia a KB y roadmap; sin repetir instrucciones globales del cliente. |
| 5 | Ciclo OPSX completo sobre un change acotado | C | **Explore:** relevamiento del problema y estado del código + resumen guardado. **Propose:** `proposal.md` (justificación 2–3 líneas), `design.md`, `specs/` (≥3 escenarios verificables Dado/Cuando/Entonces: feliz, error de negocio y borde) y `tasks.md` + registro de revisión con **Ajustar** antes de aprobar. **Apply:** implementación fiel al spec aprobado sin improvisar alcance + commits propios. **Verify:** tests automatizados cubriendo cada escenario del spec y health checks en verde (evidencia de corrida pasando). **Archive:** cierre del change movido a `openspec/changes/archive/AAAA-MM-DD-...` y actualización de `.active-orchestrator-state.json`. |
| 6 | Evidencia de Engram (recuperación de contexto) | C | Captura/consulta que demuestre recuperación de contexto persistido. |
| 7 | `README` reproducible | C | Pasos claros para clonar, instalar y correr; sin secretos. |
| 8 | Reflexión escrita (1–2 páginas) | A+B+C | Hallazgos, uso de "Ajustar", valor de la fundación, reparto de tareas. |
| 9 | Video de defensa (8–12 min) | A+B+C | Participación de los 3; demo del flujo. |
| 10 | Documento de evidencias/verificación de fuentes | A | ≥5 fuentes verificadas con URL y fecha; datos no respaldados marcados "No evidenciado". |

### Criterios de verificación — Etapa 2 (Discovery, ya completada)

- Relevamiento de **al menos 15 sistemas** (en nuestro caso **21** completados).
- Matriz de puntuación ponderada de **0 a 5** (Sección B del informe).
- Celdas sin respaldo público consignadas como **"No evidenciado"**.
- Auditoría manual personal de **al menos 5 fuentes** (una de cada tipo: sitio oficial, documentación, precios, ayuda/reseñas).

**Orden obligatorio:** 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8/9/10. No saltear etapas.

---

## 4. Guía técnica paso a paso (Antigravity / agente compatible con Active Stack / OpenSpec)

### 4.1 Cómo arranca el Integrante B (siguiente en actuar)

1. Clonar el repositorio:\
   git clone https://github.com/ModerWarfer/turnos-odontologia.git\
   cd turnos-odontologia
2. Abrir la carpeta del proyecto en **Antigravity** (IDE agéntico de Google) o en cualquier cliente compatible con Active Stack / OpenSpec.
3. Verificar que el agente lea el estado actual:
    - `.active-orchestrator-state.json` (fase `discovery` = `completed`).
    - `docs/discovery/informe-discovery.md` (insumo principal para la KB).
4. Confirmar que OpenSpec está inicializado (`openspec/` y `openspec/config.yaml` existen).

### 4.2 Prompts listos para copiar y pegar en Antigravity

**Arrancar Etapa 3 — Knowledge Base (kb-creator en modo import):**

> "Usá la skill `kb-creator` en modo **import** sobre `docs/discovery/informe-discovery.md`. Generá los 10 archivos canónicos en `knowledge-base/` (project root) sin repetir preguntas ya resueltas por el Discovery. Leé `.active-orchestrator-state.json` para no duplicar trabajo. El producto es un SaaS de gestión de turnos y agenda para consultorios odontológicos en Argentina. No inventes datos no respaldados por el informe."

**Etapa 4 — Roadmap:**

> "Usá la skill `roadmap-generator` para generar `CHANGES.md` (local-markdown) alineado al MVP definido en el Discovery: ficha básica de paciente, agenda multi-profesional/multi-sillón con prevención de solapamientos y duración variable, reserva online 24/7 y recordatorios WhatsApp. Incluí dependencias, gobernanza y 'Leer antes' apuntando a `knowledge-base/`."

**Etapa 5 — Skills, registro y agents:**

> "Ejecutá `/active-orchestrator:registry` para indexar skills en `.atl/skill-registry.md` y luego `/active-orchestrator:agents` (agent-instruction) para generar `AGENTS.md` y `CLAUDE.md` con reglas propias del dominio odontológico, referenciando KB y roadmap, sin repetir instrucciones globales del cliente."

**Cierre de etapa (B):**

> "Marcá en `.active-orchestrator-state.json` las fases `kb`, `roadmap`, `registry` y `agents` como `completed` con sus variantes. Mostrá un resumen de archivos creados y cualquier blocker."

---

## 5. Buenas prácticas de sincronización en GitHub

### Comandos esenciales

```
# Antes de empezar a trabajar (siempre)
git pull origin main

# Crear rama por etapa/integrante
git checkout -b feat/etapa3-kb-integranteB

# Trabajo y commits
git add .
git commit -m "docs: generar Knowledge Base (10 archivos canónicos)"

# Subir rama y abrir PR
git push -u origin feat/etapa3-kb-integranteB
```

### Convención de commits

| Prefijo | Uso |
| --- | --- |
| `docs:` | Documentación, KB, informes, README |
| `chore:` | Configuración, tooling, estado, scaffolding |
| `feat:` | Código de funcionalidad |
| `test:` | Tests |

### Flujo de revisión asíncrona

1. Cada integrante abre **Pull Request** hacia `main` con descripción clara de la etapa y archivos tocados.
2. El resto revisa (comentarios en el PR) antes de mergear.
3. Solo se hace merge a `main` cuando la etapa está validada (decisión **Continuar**).
4. Si hay ajustes, se corrige en la misma rama y se re-pide revisión (**Ajustar**).
5. Nunca pushear directo a `main` sin PR.

### Checklist antes de mergear

- \[ \] La rama está actualizada con `main` (`git pull origin main`).
- \[ \] No hay datos reales de pacientes.
- \[ \] Los archivos esperados de la etapa están presentes.
- \[ \] El estado (`.active-orchestrator-state.json`) refleja la etapa completada.
- \[ \] Al menos un compañero aprobó el PR.

---

*Documento de coordinación — Turnos Odontología. Compartir por WhatsApp/Discord o subir a Google Docs. Actualizar este archivo si cambian roles o alcance del MVP.*
