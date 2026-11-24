# Skill Registry

**Solo para delegadores / orquestadores.** Cualquier agente que lance sub-agentes lee este registro para resolver reglas compactas e inyectarlas en los prompts de delegación (`## Project Standards (auto-resolved)`). Los sub-agentes no necesitan leer este archivo ni cada `SKILL.md` completo.

---

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Build features/fixes test-first, "red-green-refactor", integration tests | `tdd` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/tdd/SKILL.md` |
| Input handlers, auth/sessions, personal data (Ley 25.326), webhooks, OWASP, audit | `security-and-hardening` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/security-and-hardening/SKILL.md` |
| `/active-orchestrator:init`, foundation flow orchestration | `active-orchestrator` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/active-orchestrator/SKILL.md` |
| Create/update `AGENTS.md` and `CLAUDE.md`, "armar las reglas del proyecto" | `agent-instruction` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/agent-instruction/SKILL.md` |
| Search/evaluate installable skills (`npx skills find`) | `find-skill` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/find-skill/SKILL.md` |
| Build/import 10-file canonical Knowledge Base in `knowledge-base/` | `kb-creator` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/kb-creator/SKILL.md` |
| Generate `CHANGES.md` operational change roadmap | `roadmap-generator` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/roadmap-generator/SKILL.md` |
| Create, edit, or evaluate skills (`evals.json`) | `skill-creator` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/skill-creator/SKILL.md` |
| "openspec explore" / "opsx explore" — problem investigation | `openspec-explore` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/openspec-explore/SKILL.md` |
| "openspec propose" / "opsx propose" — scaffold change + all planning artifacts | `openspec-propose` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/openspec-propose/SKILL.md` |
| "openspec apply" / "opsx apply" — implement tasks from an OpenSpec change | `openspec-apply-change` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/openspec-apply-change/SKILL.md` |
| "openspec archive" / "opsx archive" — finalize and archive completed change | `openspec-archive-change` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/openspec-archive-change/SKILL.md` |
| "openspec sync" / "opsx sync" — sync delta specs to main specs | `openspec-sync-specs` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/openspec-sync-specs/SKILL.md` |
| "openspec update change" / "opsx update" — reconcile existing planning artifacts | `openspec-update-change` | `C:/Users/Nicolás/.gemini/config/plugins/active-stack-opencode/skills/openspec-update-change/SKILL.md` |

---

## Compact Rules

Pre-digested actionable rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### tdd
- Write tests at public interfaces (**seams**), never against private methods or internal implementation details.
- Agree and list the seams under test before writing the first test; note what each seam catches and misses.
- Follow strict **Red → Green** vertical slices: one seam, one failing test, one minimal implementation per cycle.
- Never write horizontal test suites up front before understanding the implementation.
- Avoid tautological assertions (recomputing expected values with production formulas); derive expected values from specs or independent worked literals.
- Never assert through internal side channels or mock internal collaborators unnecessarily.
- Keep refactoring separate from the red → green cycle; verify tests remain green after every change.

### security-and-hardening
- Map trust boundaries, assets, and STRIDE threats + abuse cases before writing security-sensitive code.
- Validate all external inputs at API/form/webhook boundaries with allowlist schemas and return 422 on invalid payloads.
- Parameterize every DB query (never string-concatenate SQL) and auto-escape rendered output (never `eval` or raw `innerHTML`).
- Check resource-level authorization (`clinic_id` + role RBAC) on every request to prevent IDOR/BOLA, not authentication alone.
- Hash passwords with bcrypt (>=12), scrypt, or argon2; store sessions in `httpOnly`, `secure`, `sameSite` cookies (never `localStorage`).
- Enforce explicit CORS allowlists (never `*` with credentials), security headers, and strict rate limiting on auth/public routes.
- Never commit secrets, log PII/tokens, or return stack traces; treat LLM/webhook payloads as untrusted input and run dependency audits.
- Minimize personal data collection (Ley 25.326), define retention/deletion paths, and allowlist URLs/resolved IPs against SSRF.

### active-orchestrator
- Act as a thin coordinator: never reimplement phase logic inline; always delegate to the dedicated sub-skill.
- Never invent or ask strategic discovery questions directly (belongs to `kb-creator`).
- Hold an explicit user checkpoint (`Continuar / Ajustar / Parar`) between phases; never chain foundation phases silently.
- Never install external skills autonomously without presenting recommendations and receiving explicit user approval.
- Only own `step` advancement in `.active-orchestrator-state.json`; let sub-skills own their respective slices.

### agent-instruction
- Generate identical `AGENTS.md` and `CLAUDE.md` files at the repository root (never inside `.claude/` or `openspec/`).
- Read stack from `knowledge-base/02_descripcion_general.md` and skills from `.atl/skill-registry.md` without inventing missing stack details.
- Check global instruction files first and reference inherited universal rules instead of duplicating them; include uncovered project essentials.
- Confirm stack- and domain-derived hard rules (`NUNCA X → hacer Y`) interactively with the user before writing.
- Keep the skill→role table DRY: never copy compact rules into `AGENTS.md`/`CLAUDE.md`; point to `.atl/skill-registry.md`.

### find-skill
- Search `skills.sh` via `npx.cmd --yes skills find <query>` (never raw `npx` under restricted PowerShell execution policy) and check leaderboard quality.
- Verify install count (prefer 1K+), source reputation, and repo legitimacy before recommending any skill.
- Always present install vs. discard recommendations with a 1-line justification and wait for user confirmation before `skills add`.
- Install approved global skills non-interactively with `-g -y` and migrate copies into the Antigravity plugin if needed.

### kb-creator
- Write all 10 canonical KB files (`01_vision_y_objetivos.md` .. `10_preguntas_abiertas.md`) + `README.md` inside `knowledge-base/` at project root; never mix into `docs/`.
- Use Mode A (silent ingest) when `docs/` has source files; never invent unbacked facts or stack choices.
- Log ambiguities, cross-doc inconsistencies (`IN-XX`), and uninferred discovery fields (`[DISCOVERY]`) in `10_preguntas_abiertas.md`.
- Never include real patient data in seed data or examples; use clearly fictional/anonymous fixtures only.
- Respect `assets/state-contract.md`: skip automatic `state.kb` overwrite if `.active-orchestrator-state.json` version != 2.

### roadmap-generator
- Verify `knowledge-base/` (10 canonicals) and `openspec/` exist before generating `CHANGES.md` at project root.
- Preserve all mandatory top-level sections: `Cómo usar este documento`, `Árbol de dependencias` ASCII, `Paralelismo por fase` (`GATE N`), `Camino crítico`, `Plan óptimo con 3 agentes`, and semantic `FASE` blocks.
- Assign sequential `C-NN` kebab-case IDs (never `us-NNN-`), exact 5 fields (`Estado`, `Scope`, `Dependencias`, `Governance`, `Leer antes`), and operational Scope bullets.
- Enforce dependency order: infra → core models → auth/RBAC → referenced entities → core domain → channels/integrations → UI.
- Mark unconfirmed stack details as agnostic until resolved in `knowledge-base/10_preguntas_abiertas.md`.

### skill-creator
- Use `SKILL.md` under 500 lines with required `name` (matching folder name) and pushy trigger `description` in YAML frontmatter.
- Move bulky docs to `references/`, reusable templates to `assets/`, and deterministic helpers to `scripts/`.
- Use imperative instructions explaining *why* constraints matter; include concrete examples and output templates.
- When evaluating/iterating skills, save prompts in `evals/evals.json` and compare with-skill vs. baseline outputs.

### openspec-explore
- Thinking partner stance only: read files, investigate code, and draw ASCII diagrams; never implement production code in explore mode.
- Run `openspec list --json` and `openspec list --specs` first to inspect active changes, durable specs, and `openspec/config.yaml`.
- Ask focused dependency-ordered questions one thread at a time; never create `openspec/` root as a side effect.
- Only scaffold or update artifacts after explicit user confirmation naming the target change/artifacts.

### openspec-propose
- Planning boundary strictly enforced: generate planning artifacts only (`proposal.md`, `specs/*/spec.md`, `design.md`, `tasks.md`), never edit application code.
- Check root via `openspec context --json` and scaffold via `openspec new change "<name>"` (never create change folders manually).
- Follow `openspec status --change "<name>" --json` and `openspec instructions <artifact> --change "<name>" --json` in dependency order.
- Inspect actual codebase/KB before drafting; never copy `<context>` or `<rules>` blocks verbatim into generated artifacts.
- Stop after all required planning artifacts exist and wait for an explicit `apply` request.

### openspec-apply-change
- Verify change status and instructions via `openspec instructions apply --change "<name>" --json`; pause immediately if `state: "blocked"`.
- Read all `contextFiles` from disk (`proposal`, `specs`, `design`, `tasks`) before implementing any task.
- Work through tasks minimally and strictly within spec scope; surface scope expansion instead of silently dropping or narrowing requirements.
- Mark `- [ ]` → `- [x]` at exact `sourcePath` and `line` only when the specified behavior is fully implemented and verified.

### openspec-archive-change
- Check artifact completion (`openspec status`) and task counts (`openspec list --json`) before archiving; confirm with user if incomplete.
- Assess delta specs (`artifactPaths.specs.existingOutputPaths`) against `<root>/openspec/specs/` and sync via `openspec-sync-specs` when needed.
- Never archive if a selected sync fails or leaves capabilities out of sync.
- Move `changeRoot` into `openspec/changes/archive/YYYY-MM-DD-<name>` (never duplicate date prefix) and report final summary.

### openspec-sync-specs
- Treat main specs merge intelligently (`ADDED`, `MODIFIED`, `REMOVED`, `RENAMED`) using `artifactPaths.specs.existingOutputPaths` as the only delta source.
- For new capabilities, allow only `ADDED` requirements (copying `## Purpose` verbatim); never leave delta headers (`## ADDED Requirements`) in main specs.
- Preserve untouched `## Purpose` and unrelated requirements/scenarios; retire empty specs only when `.openspec.yaml` declares `retire_capabilities: true`.
- Run `openspec validate --specs` after writing and report any failure instead of claiming success.

### openspec-update-change
- Planning-only coherence tool: revise existing artifacts (`existingOutputPaths`) and never edit application code or write to glob `resolvedOutputPath`.
- Reconcile edits bidirectionally across `proposal.md`, `specs/`, `design.md`, and `tasks.md` in conversation before writing.
- Confirm every proposed artifact edit with the user before applying changes one artifact at a time.
- Recommend `openspec new change` instead of updating if the change's core intent has shifted.

---

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| `AGENTS.md` | `AGENTS.md` | Index — canon de instrucciones del proyecto; referencia los archivos abajo |
| `CLAUDE.md` | `CLAUDE.md` | Copia sincronizada idéntica de `AGENTS.md` |
| `CHANGES.md` | `CHANGES.md` | Roadmap operativo de 14 changes (`C-01`..`C-14`), camino crítico y gates |
| `COORDINACION-EQUIPO.md` | `COORDINACION-EQUIPO.md` | Reglas de equipo, roles A/B/C, ramas y checklist de entrega |
| `01_vision_y_objetivos.md` | `knowledge-base/01_vision_y_objetivos.md` | Referenced by `AGENTS.md` — Propósito, actores, MVP v1.0 vs v1.1 |
| `02_descripcion_general.md` | `knowledge-base/02_descripcion_general.md` | Referenced by `AGENTS.md` — Stack (pendiente), arquitectura e integraciones |
| `03_actores_y_roles.md` | `knowledge-base/03_actores_y_roles.md` | Referenced by `AGENTS.md` — Actores, matriz RBAC y rutas públicas |
| `04_modelo_de_datos.md` | `knowledge-base/04_modelo_de_datos.md` | Referenced by `AGENTS.md` — Entidades, ERD multi-tenant y seed ficticio |
| `05_reglas_de_negocio.md` | `knowledge-base/05_reglas_de_negocio.md` | Referenced by `AGENTS.md` — Reglas `RN-*` (solapamientos, WA, Ley 25.326/26.529) |
| `06_funcionalidades.md` | `knowledge-base/06_funcionalidades.md` | Referenced by `AGENTS.md` — Épicas e historias `US-001`..`US-012` |
| `07_flujos_principales.md` | `knowledge-base/07_flujos_principales.md` | Referenced by `AGENTS.md` — 5 flujos E2E y casos de error |
| `08_arquitectura_propuesta.md` | `knowledge-base/08_arquitectura_propuesta.md` | Referenced by `AGENTS.md` — Patrones, estructura de carpetas, seguridad y env vars |
| `09_decisiones_y_supuestos.md` | `knowledge-base/09_decisiones_y_supuestos.md` | Referenced by `AGENTS.md` — Decisiones `DD-*` y supuestos `SU-*` |
| `10_preguntas_abiertas.md` | `knowledge-base/10_preguntas_abiertas.md` | Referenced by `AGENTS.md` — Inconsistencias `IN-*` y stack pendiente |

---

## Registro de evaluación `find-skill` (Etapa 5)

| Skill evaluada (`skills.sh`) | Decisión | Justificación (1 línea) |
|------------------------------|----------|-------------------------|
| `mattpocock/skills@tdd` (1.3M installs) | **Instalada** | Agnóstica al stack y clave para guiar pruebas vertical-slice en el ciclo OPSX de Etapa 6. |
| `addyosmani/agent-skills@security-and-hardening` (91K installs) | **Instalada** | Refuerza aislamiento multi-tenant, rutas públicas 24/7 y cumplimiento Ley 25.326 sin depender de un framework. |
| `addyosmani/agent-skills@api-and-interface-design` (81.1K installs) | **Descartada** | Contratos REST preliminares ya documentados en la KB; re-evaluar solo si hace falta al diseñar APIs. |
| `wondelai/skills@clean-architecture` (8.1K installs) | **Descartada** | Patrones de dominio/puertos ya cubiertos en `knowledge-base/08_arquitectura_propuesta.md`. |
| `samber/cc-skills-golang@golang-testing` (46.6K installs) | **Descartada (por ahora)** | Específica de Go; el stack backend aún está pendiente de decisión en `10_preguntas_abiertas.md`. |
| `wshobson/agents@nodejs-backend-patterns` (51K installs) | **Descartada (por ahora)** | Específica de Node.js; se re-evaluará si el equipo elige Node.js/TypeScript. |
| `supabase/agent-skills@supabase-postgres-best-practices` (495.7K) | **Descartada (por ahora)** | Específica de Supabase/Postgres; motor de persistencia aún por definir. |
| `prisma/skills@prisma-database-setup` (444K installs) | **Descartada (por ahora)** | Específica de Prisma ORM; depende de elegir Node.js y ORM antes de `C-01`. |
| `anthropics/skills@webapp-testing` (212.5K installs) | **Descartada (por ahora)** | Orientada a tests E2E de UI/browser; recién aplica en `C-09`/`C-10` tras definir stack frontend. |

