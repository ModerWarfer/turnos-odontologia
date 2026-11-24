# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Foco en el mercado argentino y cumplimiento normativo local
**Decisión**: Diseñar el producto priorizando necesidades regulatorias y comerciales de consultorios y clínicas odontológicas en Argentina.
**Contexto**: El Discovery analizó 21 sistemas y mostró que los competidores extranjeros (CareStack, Dentrix, Adit) no cubren pagos/facturación ni pricing local, mientras los líderes locales (DentalSoft, Dentidad, ClínIA, Denteo, FLAP) compiten en WhatsApp, Mercado Pago, ARCA y cumplimiento de las Leyes 25.326 y 26.529.
**Alternativas consideradas**: Producto genérico multi-país desde el día uno (estilo Cal.com o TurnosWeb).
**Justificación**: El diferencial real en Argentina requiere integraciones y reglas locales nativas y pricing en ARS sin permanencia.
**Trade-offs aceptados**: Mayor esfuerzo en adaptadores locales específicos (Meta WhatsApp, Mercado Pago, ARCA) en lugar de expansión internacional temprana.

### DD-02 — Modalidad Cloud SaaS multi-tenant
**Decisión**: Construir una aplicación web Cloud SaaS multi-tenant accesible desde múltiples dispositivos, sin instalación local.
**Contexto**: La mayoría de soluciones modernas relevadas operan en la nube (DentalSoft, Dentidad, Denteo, AgendaPro), evitando fricción de mantenimiento on-premise.
**Alternativas consideradas**: Software de escritorio instalado en cada consultorio.
**Justificación**: Habilita reserva online 24/7, recordatorios automáticos en segundo plano y actualización continua centralizada.
**Trade-offs aceptados**: Dependencia de conectividad a internet en el consultorio y necesidad de aislamiento estricto por `clinic_id` y backups confiables.

### DD-03 — Segmentación en MVP v1.0 (4 pilares) y v1.1 (8 imprescindibles del informe)
**Decisión**: Acotar la primera etapa implementable (v1.0) a ficha básica de paciente, agenda multi-profesional/multi-sillón sin solapamientos y con duración variable, reserva online 24/7 y recordatorios automáticos por WhatsApp, dejando seña Mercado Pago, HC/odontograma FDI, caja/ARCA y portal sin contraseña para v1.1.
**Contexto**: `COORDINACION-EQUIPO.md` establece explícitamente este MVP de 4 pilares y recomienda ejecutar el ciclo OPSX sobre un change acotado de agenda sin solapamientos; el informe de Discovery enumera 8 imprescindibles completos de producto.
**Alternativas consideradas**: Intentar construir los 8 módulos completos en la primera iteración.
**Justificación**: Equipo pequeño, presupuesto acotado y metodología académica TUP por etapas; validar primero el núcleo de agenda evita complejidad prematura.
**Trade-offs aceptados**: El ciclo financiero/clínico completo (señas, ARCA, odontograma FDI) queda documentado en la KB pero diferido a iteraciones v1.1. *(Registrado también en `10_preguntas_abiertas.md` como `IN-01` para validación formal).*

### DD-04 — Postergación de módulos complejos y diferenciadores secundarios
**Decisión**: Postergar fuera del MVP/v1.1: receta electrónica (ReNaPDiS), teleconsulta, módulo de laboratorio dental, cobertura avanzada de obras sociales (PUCO) e imaging con IA.
**Contexto**: Sección D del informe consolidado de Discovery (`docs/discovery/informe-discovery.md`).
**Alternativas consideradas**: Incluir módulo de laboratorio o PUCO desde el inicio (como Denteo o ClínIA).
**Justificación**: Evitar dispersión de alcance y dependencias regulatorias complejas antes de consolidar turnos y operación base.
**Trade-offs aceptados**: Clínicas con alta dependencia de obras sociales o laboratorio integrado deberán esperar versiones posteriores.

### DD-05 — Política estricta de veracidad y prohibición de datos reales
**Decisión**: Ningún dato clínico o personal real de pacientes puede subirse al repositorio, y toda afirmación funcional debe estar respaldada por fuentes o quedar marcada como pendiente/"No evidenciado".
**Contexto**: Reglas obligatorias de `COORDINACION-EQUIPO.md` y metodología del Discovery.
**Alternativas consideradas**: Usar datos de prueba realistas tomados de casos reales o completar huecos técnicos arbitrariamente.
**Justificación**: Cumplimiento Ley 25.326, buenas prácticas académicas/profesionales y trazabilidad real de especificaciones.
**Trade-offs aceptados**: Las decisiones técnicas no definidas en Discovery (ej. stack backend/frontend/DB) quedan abiertas explícitamente en `10_preguntas_abiertas.md`.

---

## Supuestos inferidos

### SU-01 — Persistencia relacional transaccional con aislamiento por `clinic_id`
**Supuesto**: Se utilizará una base de datos relacional con soporte ACID para garantizar exclusión mutua ante reservas simultáneas y consultas multi-tenant.
**Origen**: Requisito estricto de prevención de solapamientos (`COORDINACION-EQUIPO.md` + `docs/discovery/informe-discovery.md`).
**Riesgo si es falso**: Si se eligiera un almacenamiento sin transacciones/locks adecuados, podrían producirse dobles reservas en reserva online 24/7.
**Cómo validar**: Confirmar motor de base de datos al definir el stack técnico antes de Etapa 6 (`Propose`).

### SU-02 — Todo turno presencial asigna exactamente un profesional y un sillón/box
**Supuesto**: En v1.0 cada turno bloquea 1 profesional y 1 sillón/box durante `[starts_at, ends_at)`.
**Origen**: Definición del MVP en `COORDINACION-EQUIPO.md`: *"Agenda multi-profesional y multi-sillón/box con prevención estricta de solapamientos"*.
**Riesgo si es falso**: Si existieran turnos sin sillón (ej. consultas rápidas o administrativas) o con múltiples profesionales, el constraint rígido de `chair_id NOT NULL` requeriría ajuste.
**Cómo validar**: Confirmar con el equipo en `10_preguntas_abiertas.md`.

### SU-03 — Duración tomada de la prestación con posibilidad de ajuste en agenda interna
**Supuesto**: La duración del turno proviene de `Service.duration_minutes` en reserva online y por defecto en agenda interna, pudiendo el staff ajustarla manualmente si la clínica lo habilita (manteniendo validación de no solapamiento).
**Origen**: "Duración variable por prestación" en `COORDINACION-EQUIPO.md`.
**Riesgo si es falso**: Si la duración fuera estrictamente inmutable incluso para recepción, se restringirían casos especiales clínicos.
**Cómo validar**: Confirmar regla exacta en `Propose` del change de agenda.

### SU-04 — Email transaccional como complemento/respaldo de WhatsApp
**Supuesto**: Aunque el MVP destaca recordatorios por WhatsApp, se incluye email como respaldo/complemento dado que Meta cobra por mensaje en WhatsApp Business API y no todos los pacientes responden por el mismo canal.
**Origen**: Riesgos y casos de uso en `docs/discovery/informe-discovery.md` ("Recordatorios automáticos por WhatsApp/email", "Meta cobra").
**Riesgo si es falso**: Costo adicional mínimo de configuración SMTP si se decidiera usar solo WhatsApp en v1.0.
**Cómo validar**: Definir política de canales y ventanas de envío antes de implementar la épica de recordatorios.

### SU-05 — Referentes UX del producto
**Supuesto**: Los flujos de interfaz y experiencia se inspirarán en las fortalezas observadas en DentalSoft (automatización), Dentidad (integración clínica/financiera) y AgendaPro (reserva 24/7).
**Origen**: Sección 7 ("3 productos de referencia UX") de `docs/discovery/informe-discovery.md`.
**Riesgo si es falso**: Bajo; son referencias de diseño y no restricciones técnicas.
**Cómo validar**: Revisar prototipos/flujos antes de implementar frontend.

