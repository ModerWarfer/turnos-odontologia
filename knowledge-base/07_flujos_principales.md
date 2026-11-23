# Flujos Principales

Cada flujo documenta la interacción extremo a extremo entre actor, frontend, API, dominio/persistencia e integraciones externas.

---

## Flujo 1: Creación de turno desde agenda (prevención de solapamientos)
**Disparador**: El staff selecciona un bloque horario en la agenda o presiona "Nuevo turno".
**Actor**: Recepcionista / Asistente u Odontólogo (autenticado).

**Pasos**:
1. El frontend solicita el catálogo de prestaciones (`duration_minutes`), profesionales y sillones/boxes del `clinic_id`.
2. El usuario selecciona paciente, profesional, sillón/box, prestación y fecha/hora de inicio (`starts_at`).
3. La API valida permisos RBAC (`RN-AU-02`) y pertenencia de todas las entidades al mismo `clinic_id` (`RN-AU-01`).
4. El dominio calcula `ends_at = starts_at + service.duration_minutes` (`RN-AG-04`).
5. Dentro de una transacción atómica, la API verifica que `starts_at < ends_at`, que el horario esté dentro de `AvailabilityRule` del profesional (`RN-AG-06`), y que no existan turnos activos (`pending | confirmed | checked_in`) solapados ni para el `professional_id` ni para el `chair_id` (`RN-AG-01`, `RN-AG-02`, `RN-AG-03`, `RN-AG-05`).
6. Se persiste el turno y se programan los registros `Reminder` correspondientes.
7. La API responde `201 Created` con el turno creado y el frontend actualiza la grilla.

**Diagrama de secuencia**:
```text
Staff → Frontend → API (Auth/Tenant) → Dominio Agenda → DB (Tx Atómica)
                                                           ├─ check horario laboral
                                                           ├─ check solapamiento profesional
                                                           ├─ check solapamiento sillón/box
                                                           └─ insert Appointment + Reminders
                                      ← 201 Created ←
```

**Casos de error**:
- Profesional o sillón/box ocupado en `[starts_at, ends_at)` → `409 Conflict` indicando qué recurso tiene solapamiento.
- Horario fuera de disponibilidad del profesional o prestación inactiva → `422 Unprocessable Entity`.
- Alguna entidad pertenece a otro `clinic_id` → `404 Not Found` / `403 Forbidden`.

---

## Flujo 2: Reserva de turno online 24/7 por paciente
**Disparador**: El paciente abre el link propio del consultorio (`/book/{clinicSlug}`).
**Actor**: Paciente (sin contraseña).

**Pasos**:
1. El frontend público carga las prestaciones habilitadas (`allow_online_booking = true`) y profesionales disponibles de la clínica.
2. El paciente elige prestación y profesional (o "cualquier disponible") y fecha.
3. La API calcula los bloques disponibles cruzando `AvailabilityRule`, duración de la prestación, turnos activos del profesional y ocupación de sillones/boxes, devolviendo solo horarios libres (`RN-AU-03`).
4. El paciente selecciona un bloque horario e ingresa sus datos mínimos de ficha básica (nombre completo y WhatsApp/email).
5. La API inicia una transacción atómica, asigna sillón/box disponible si no se eligió uno explícito, crea o vincula al paciente en la clínica, revalida ausencia de solapamientos (`RN-RO-02`), crea el turno con `source = online_24_7` y programa recordatorios.
6. La API devuelve confirmación con token de acción (`public_action_token`) para confirmar o cancelar sin contraseña.

**Diagrama de secuencia**:
```text
Paciente → Portal /book/{slug} → API Pública → Motor Disponibilidad → DB
   │                                                                   │
   ├── GET availability ───────────────────────────────────────────────┤
   │   ← slots libres (sin datos de otros pacientes) ──────────────────┤
   │                                                                   │
   └── POST bookings (datos mínimos + slot) ──→ Tx Atómica ────────────┤
                                                  ├─ lock/re-check slot│
                                                  └─ insert Patient/Appt
       ← 201 Confirmación + link acción ───────────────────────────────┘
```

**Casos de error**:
- Condición de carrera (otro paciente o recepción tomó el bloque milisegundos antes) → `409 Conflict` invitando a seleccionar otro horario disponible.
- Horario en el pasado o clínica con reserva online deshabilitada → `400/403`.
- Falta teléfono WhatsApp y email → `422 Unprocessable Entity`.

---

## Flujo 3: Envío automático de recordatorio por WhatsApp Business
**Disparador**: Job periódico del scheduler detecta recordatorios en estado `scheduled` con `scheduled_for <= now()`.
**Actor**: Scheduler / Worker del sistema (en nombre de la clínica).

**Pasos**:
1. El worker consulta recordatorios pendientes verificando que el turno siga en estado elegible (`pending` o `confirmed`).
2. Verifica `idempotency_key` para asegurar un único envío por ventana (`RN-RC-03`).
3. Si el paciente tiene `phone_whatsapp` y la clínica tiene WhatsApp Business configurado, invoca el adaptador de Meta usando una plantilla aprobada (`RN-RC-01`) con variables de fecha, hora, profesional y enlace de confirmación/cancelación.
4. Si no aplica WhatsApp o falla de forma definitiva según política de reintento, dispara el respaldo por email transaccional si el paciente posee correo.
5. Persiste `status = sent` (y `external_message_id`) o `failed` con detalle del error.
6. Cuando Meta notifica entrega o respuesta vía webhook, la API valida la firma y actualiza `Reminder.status` (y el estado del turno si corresponde).

**Diagrama de secuencia**:
```text
Scheduler → Worker Recordatorios → DB (Reminder + Appointment)
                     │
                     ├─► WhatsApp Business API (plantilla Meta)
                     │        └─ webhook estado / respuesta ──► API ──► DB
                     └─► [fallback] Email Transaccional
```

**Casos de error**:
- Turno fue cancelado antes del disparo → se marca `Reminder.status = cancelled` y no se consume mensaje Meta.
- Error transitorio de API Meta → reintento acotado respetando `idempotency_key`; si agota reintentos, marca `failed` y activa fallback email.

---

## Flujo 4: Cancelación y reprogramación de turno
**Disparador**: El staff cancela/reprograma desde agenda o el paciente usa su enlace de acción (`/appointments/action/{token}`).
**Actor**: Recepcionista, Odontólogo o Paciente (vía token).

**Pasos**:
1. En **cancelación**, la API valida permisos o `public_action_token`, cambia `Appointment.status = cancelled` y registra motivo opcional.
2. En el mismo flujo transaccional, pasa a `cancelled` todos los `Reminder` futuros en estado `scheduled` (`RN-RC-02`).
3. El intervalo del profesional y del sillón/box queda inmediatamente libre para nuevas consultas de disponibilidad (`RN-AG-05`).
4. En **reprogramación** (staff), la API revalida `RN-AG-01` a `RN-AG-07` sobre los nuevos `starts_at`, `professional_id` y `chair_id` excluyendo el turno actual, actualiza el turno y regenera los recordatorios.

**Diagrama de secuencia**:
```text
Actor → API → Tx Atómica DB:
                ├─ Cancelar: status=cancelled + cancelar Reminders pendientes
                └─ Reprogramar: validar no solapamiento (excl. id) + update + reprogramar Reminders
```

**Casos de error**:
- Token expirado o inválido en acción pública → `401/404`.
- Intento de reprogramar a un horario con conflicto de profesional o sillón → `409 Conflict` sin modificar el turno original.

---

## Flujo 5 (v1.1): Seña online (Mercado Pago) y facturación electrónica ARCA
**Disparador**: Reserva con seña obligatoria o cierre de cobro en caja diaria (alcance v1.1).
**Actor**: Paciente (seña) / Administrador o Recepcionista (cobro y factura ARCA).

**Pasos**:
1. En reserva con seña, la API crea preferencia de pago en Mercado Pago hacia la cuenta propia de la clínica; al recibir el webhook firmado de pago aprobado, consolida la seña y confirma el turno.
2. Al registrar un cobro en caja diaria y solicitar comprobante fiscal, el adaptador de ARCA envía los datos fiscales de la clínica y obtiene el `CAE`, persistiendo el comprobante vinculado al pago y habilitándolo en el portal sin contraseña del paciente.

**Casos de error**:
- Webhook de Mercado Pago con firma inválida → `401 Unauthorized` y rechazo sin mutar estado.
- Falla o rechazo de ARCA → el cobro queda registrado como pendiente de facturación fiscal para reintento sin pérdida del movimiento de caja.

