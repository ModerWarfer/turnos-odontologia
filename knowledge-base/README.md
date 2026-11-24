# Turnos Odontología — Base de Conocimiento

Base de conocimiento canónica generada en modo `import` (`ingest`) a partir del informe consolidado de Discovery (`docs/discovery/informe-discovery.md`) y los lineamientos de `COORDINACION-EQUIPO.md`.

## Índice de Archivos

| Archivo | Contenido |
|---|---|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito del SaaS, objetivos por actor, alcance v1.0 (MVP núcleo), extensión v1.1 y fuera de alcance |
| [02_descripcion_general.md](02_descripcion_general.md) | Estado del stack tecnológico, arquitectura general, integraciones externas (WhatsApp, MP, ARCA) y API preliminar |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Actores del consultorio/clínica, matriz de permisos RBAC y rutas públicas sin contraseña |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Dominios, ERD multi-tenant, entidades, constraints anti-solapamiento y seed data ficticio |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas codificadas (`RN-*`) de multi-tenancy, agenda, reserva 24/7, recordatorios y normativa AR |
| [06_funcionalidades.md](06_funcionalidades.md) | Épicas e historias de usuario (`US-001` a `US-012`) con criterios de aceptación y trazabilidad a reglas |
| [07_flujos_principales.md](07_flujos_principales.md) | Flujos extremo a extremo con diagramas de secuencia ASCII y manejo de errores |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones recomendados, estructura de directorios, seguridad (Ley 25.326/26.529) y variables de entorno |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | Decisiones documentadas (`DD-*`) y supuestos inferidos (`SU-*`) con validación asociada |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Inconsistencias detectadas (`IN-*`), incertidumbres `[DISCOVERY]` y preguntas priorizadas |

## Quick Start para Desarrolladores

1. Entender el dominio → [01_vision_y_objetivos.md](01_vision_y_objetivos.md), [03_actores_y_roles.md](03_actores_y_roles.md)
2. Entender los datos → [04_modelo_de_datos.md](04_modelo_de_datos.md)
3. Entender las reglas → [05_reglas_de_negocio.md](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02_descripcion_general.md](02_descripcion_general.md), [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md)
5. Implementar → [07_flujos_principales.md](07_flujos_principales.md), [06_funcionalidades.md](06_funcionalidades.md)
6. Antes de codificar → [10_preguntas_abiertas.md](10_preguntas_abiertas.md)

## Resumen Ejecutivo

**Turnos Odontología** es un SaaS Cloud multi-tenant para consultorios y clínicas odontológicas en Argentina orientado a reemplazar procesos fragmentados en papel o Excel. Su **MVP v1.0** prioriza ficha básica de paciente, agenda multi-profesional y multi-sillón/box con prevención estricta de solapamientos y duración variable por prestación, reserva online 24/7 y recordatorios automáticos por WhatsApp, dejando en **v1.1** las extensiones del Discovery (seña Mercado Pago, historia clínica/odontograma FDI versionado, caja diaria, facturación ARCA y portal sin contraseña).

