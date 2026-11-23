# Funcionalidades

Organizadas por **épica** y **historia de usuario** (`US-NNN`). Las Épicas 1 a 4 corresponden al **MVP v1.0** acordado en `COORDINACION-EQUIPO.md`; la Épica 5 agrupa las extensiones **v1.1** del Discovery.

---

## Épica 1 (MVP v1.0): Ficha básica de paciente

### US-001 — Registrar ficha básica de paciente
**Como** recepcionista u odontólogo
**Quiero** dar de alta la ficha básica de un paciente con nombre completo, teléfono WhatsApp, email y DNI opcional
**Para** asociarlo a turnos y poder enviarle recordatorios automáticos

**Criterios de aceptación**:
- [ ] CA-1: Valida que exista nombre completo y al menos un medio de contacto (teléfono WhatsApp o email).
- [ ] CA-2: Si se informa DNI, impide duplicar el mismo DNI dentro de la misma clínica (`clinic_id`).
- [ ] CA-3: Almacena el registro aislado al `clinic_id` del usuario autenticado.

**Reglas relacionadas**: RN-AU-01, RN-AU-02, RN-LG-01

### US-002 — Buscar y actualizar ficha básica de paciente
**Como** recepcionista u odontólogo
**Quiero** buscar pacientes por nombre, DNI o teléfono y actualizar sus datos de contacto
**Para** mantener vigente el canal de recordatorios y agilizar la asignación de turnos

**Criterios de aceptación**:
- [ ] CA-1: La búsqueda filtra estrictamente por el `clinic_id` de la sesión.
- [ ] CA-2: Permite editar teléfono/email sin perder historial de turnos asociados.

**Reglas relacionadas**: RN-AU-01, RN-LG-01

---

## Épica 2 (MVP v1.0): Agenda multi-profesional y multi-sillón/box

### US-003 — Configurar profesionales, sillones/boxes y prestaciones
**Como** administrador de la clínica
**Quiero** gestionar odontólogos (con sus horarios laborales), sillones/boxes y prestaciones con su duración en minutos
**Para** habilitar la agenda operativa del consultorio y la disponibilidad online

**Criterios de aceptación**:
- [ ] CA-1: Cada prestación requiere `duration_minutes > 0`.
- [ ] CA-2: Cada sillón/box tiene nombre único dentro de la clínica y puede activarse/desactivarse.
- [ ] CA-3: Cada profesional tiene horarios semanales y puede tener excepciones o bloqueos puntuales.

**Reglas relacionadas**: RN-AU-01, RN-AU-02, RN-AG-04

### US-004 — Crear turno evitando solapamientos por profesional y por sillón/box
> *Nota:* esta historia corresponde al change acotado recomendado en `COORDINACION-EQUIPO.md` para el ciclo OPSX de Etapa 6.

**Como** recepcionista u odontólogo
**Quiero** crear un turno seleccionando paciente, profesional, sillón/box, prestación y fecha/hora de inicio
**Para** agendar la atención calculando la duración según la prestación y garantizando que no existan superposiciones

**Criterios de aceptación**:
- [ ] CA-1: Calcula `ends_at = starts_at + service.duration_minutes` automáticamente según la prestación elegida.
- [ ] CA-2: Rechaza el turno si el profesional ya tiene otro turno activo que se solape en `[starts_at, ends_at)`.
- [ ] CA-3: Rechaza el turno si el sillón/box ya está ocupado por otro turno activo en `[starts_at, ends_at)` (aunque sea con otro profesional).
- [ ] CA-4: Permite crear turnos estrictamente contiguos (`A.ends_at == B.starts_at`) sin marcarlos como conflicto.
- [ ] CA-5: Permite ocupar el mismo bloque horario si el turno previo en ese horario fue `cancelled` o `no_show`.
- [ ] CA-6: Valida que todas las entidades pertenezcan al mismo `clinic_id` y respeten el horario laboral del profesional.

**Reglas relacionadas**: RN-AU-01, RN-AG-01, RN-AG-02, RN-AG-03, RN-AG-04, RN-AG-05, RN-AG-06

### US-005 — Gestionar estados, reprogramación y cancelación de turnos
**Como** recepcionista u odontólogo
**Quiero** cambiar el estado de un turno (`confirmed`, `checked_in`, `completed`, `cancelled`, `no_show`) o reprogramarlo
**Para** reflejar la operación real de sala de espera y liberar horarios ante cancelaciones

**Criterios de aceptación**:
- [ ] CA-1: Al pasar a `cancelled` o `no_show`, el bloque de profesional y sillón/box queda disponible inmediatamente y se cancelan los recordatorios `scheduled`.
- [ ] CA-2: Al reprogramar horario, profesional o sillón/box, se ejecutan todas las validaciones de no solapamiento excluyendo el turno actual y se reprograman sus recordatorios.

**Reglas relacionadas**: RN-AG-05, RN-AG-07, RN-RC-02

---

## Épica 3 (MVP v1.0): Reserva de turnos online 24/7

### US-006 — Consultar disponibilidad pública por link propio
**Como** paciente
**Quiero** ingresar al link público del consultorio, elegir una prestación y profesional (o cualquiera disponible) y ver horarios libres
**Para** elegir el momento que mejor me convenga las 24 horas sin llamar por teléfono

**Criterios de aceptación**:
- [ ] CA-1: La consulta solo muestra franjas libres donde tanto el profesional como un sillón/box estén disponibles durante toda la duración de la prestación.
- [ ] CA-2: No expone ningún dato de pacientes ni detalles internos de la agenda en la respuesta pública.

**Reglas relacionadas**: RN-AU-03, RN-AG-01, RN-AG-02, RN-AG-04, RN-RO-01

### US-007 — Reservar turno online 24/7 con control de concurrencia
**Como** paciente
**Quiero** confirmar mi reserva online ingresando mis datos básicos de contacto sin crear contraseña
**Para** asegurar mi turno de inmediato y recibir confirmación

**Criterios de aceptación**:
- [ ] CA-1: Crea o vincula la ficha básica del paciente dentro del `clinic_id` del `clinicSlug`.
- [ ] CA-2: Verifica atómicamente disponibilidad de profesional y sillón/box al confirmar; ante doble reserva simultánea, rechaza la segunda con mensaje claro para elegir otro horario.
- [ ] CA-3: Programa automáticamente los recordatorios configurados para el turno.

**Reglas relacionadas**: RN-RO-01, RN-RO-02, RN-RO-03, RN-AG-06, RN-RC-01

---

## Épica 4 (MVP v1.0): Recordatorios automáticos por WhatsApp

### US-008 — Programar y enviar recordatorios automáticos
**Como** administrador o recepcionista
**Quiero** que el sistema programe y envíe recordatorios automáticos por WhatsApp (y email como complemento) antes de cada turno
**Para** reducir el ausentismo sin hacer envíos manuales uno por uno

**Criterios de aceptación**:
- [ ] CA-1: Utiliza plantillas aprobadas por Meta para WhatsApp Business API.
- [ ] CA-2: Garantiza idempotencia para evitar envíos duplicados y sobrecostos de Meta.
- [ ] CA-3: Registra estado (`scheduled`, `sent`, `delivered`, `failed`, `cancelled`) visible en el detalle del turno.

**Reglas relacionadas**: RN-RC-01, RN-RC-02, RN-RC-03

### US-009 — Confirmar o cancelar turno desde el recordatorio
**Como** paciente
**Quiero** confirmar asistencia o cancelar mi turno directamente desde el enlace o respuesta del recordatorio
**Para** avisar sin fricción y permitir que el consultorio reasigne el horario si no puedo asistir

**Criterios de aceptación**:
- [ ] CA-1: La confirmación actualiza el estado del turno a `confirmed`.
- [ ] CA-2: La cancelación actualiza el estado a `cancelled`, libera profesional y sillón/box, y detiene recordatorios posteriores.

**Reglas relacionadas**: RN-AG-05, RN-RC-02

---

## Épica 5 (v1.1 — Extensión Imprescindibles Discovery)

### US-010 — Cobrar seña online por Mercado Pago *(v1.1)*
**Como** administrador o paciente
**Quiero** exigir/abonar una seña online vía Mercado Pago a cuenta propia de la clínica al reservar
**Para** reducir cancelaciones de último momento y ausencias

**Criterios de aceptación**:
- [ ] CA-1: La integración procesa webhooks firmados de Mercado Pago y confirma el turno/seña automáticamente.

**Reglas relacionadas**: RN-AG-05

### US-011 — Gestionar historia clínica y odontograma FDI versionado *(v1.1)*
**Como** odontólogo
**Quiero** registrar evoluciones clínicas ancladas y actualizar el odontograma FDI manteniendo historial de versiones
**Para** contar con trazabilidad clínica completa conforme a la Ley 26.529

**Criterios de aceptación**:
- [ ] CA-1: Cada modificación del odontograma genera una nueva versión con autor y timestamp sin destruir versiones previas.
- [ ] CA-2: Solo usuarios con rol `dentist` pueden escribir registros clínicos.

**Reglas relacionadas**: RN-AU-02, RN-LG-02

### US-012 — Presupuestos, caja diaria, facturación ARCA y portal sin contraseña *(v1.1)*
**Como** administrador y paciente
**Quiero** generar presupuestos, registrar cobros en caja diaria, emitir factura electrónica ARCA (CAE) y consultar turnos/comprobantes en un portal sin contraseña
**Para** unificar la gestión administrativa y fiscal del consultorio en Argentina

**Criterios de aceptación**:
- [ ] CA-1: La emisión fiscal obtiene y persiste el CAE de ARCA asociado al cobro.
- [ ] CA-2: El portal del paciente opera por enlace seguro sin contraseña.

**Reglas relacionadas**: RN-LG-04

