# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| **Administrador / Dueño de clínica** | Responsable de la gestión general, configuración institucional y operación comercial del consultorio o clínica | Panel web autenticado: configura profesionales, sillones/boxes, prestaciones, horarios, link público, usuarios y reglas de recordatorios (y caja/facturación ARCA en v1.1) |
| **Odontólogo** (generalista o especialista) | Profesional clínico que atiende pacientes en uno o más sillones/boxes según su agenda | Panel web autenticado: visualiza su agenda, actualiza estado de atención de sus turnos y bloquea disponibilidad; en v1.1 registra historia clínica, odontograma FDI y presupuestos |
| **Recepcionista / Asistente** | Personal operativo encargado de la atención al paciente, coordinación de agenda y seguimiento diario | Panel web autenticado: da de alta/edita fichas básicas de pacientes, crea/reprograma/cancela turnos multi-profesional y multi-sillón, gestiona confirmaciones y verifica envíos de recordatorios |
| **Paciente** | Persona que solicita o asiste a una prestación odontológica en el consultorio | Sin usuario ni contraseña: usa el **link público de reserva 24/7** para agendar, recibe recordatorios por WhatsApp/email para confirmar o cancelar, y en v1.1 accede al portal sin contraseña |
| **Laboratorio dental** *(opcional / postergado)* | Proveedor externo de prótesis y trabajos dentales para la clínica | Sin acceso en MVP v1.0 ni v1.1 (marcado como postergado en `docs/discovery/informe-discovery.md` Sección D) |

---

## RBAC — Matriz de permisos

> **Convención:** `C` = Crear, `R` = Leer/Listar, `U` = Actualizar, `D` = Desactivar/Eliminar lógico. Todo acceso autenticado está estrictamente acotado al tenant (`clinic_id`) del usuario.

| Rol | Recurso | Permisos (CRUD) | Notas y restricciones |
|---|---|---|---|
| **Administrador / Dueño** | Configuración de clínica y usuarios | `C, R, U, D` | Administra sede, sillones/boxes, usuarios y link público |
| **Administrador / Dueño** | Profesionales y prestaciones | `C, R, U, D` | Define duraciones por prestación y disponibilidad base |
| **Administrador / Dueño** | Pacientes (ficha básica) | `C, R, U, D` | Acceso total administrativo dentro de su clínica (Ley 25.326) |
| **Administrador / Dueño** | Agenda, turnos y recordatorios | `C, R, U, D` | Puede crear, reprogramar, cancelar y auditar recordatorios |
| **Administrador / Dueño** | Finanzas / Caja / ARCA *(v1.1)* | `C, R, U` | Emisión de comprobantes CAE y reportes de caja |
| **Odontólogo** | Configuración de clínica / usuarios | `R` (propia) | No administra otros usuarios ni facturación institucional |
| **Odontólogo** | Su disponibilidad y prestaciones | `R, U` (propias) | Consulta prestaciones y ajusta sus bloqueos horarios si está habilitado |
| **Odontólogo** | Pacientes (ficha básica) | `C, R, U` | Consulta y actualiza datos necesarios para atención |
| **Odontólogo** | Agenda y turnos | `C, R, U` (propios / clínica lectura) | Ve su agenda; marca estado (`checked_in`, `completed`, `no_show`); crea/reprograma según política del consultorio |
| **Odontólogo** | Historia clínica y odontograma *(v1.1)* | `C, R, U` | Único rol habilitado para registrar/versionar actos clínicos (Ley 26.529) |
| **Recepcionista / Asistente** | Profesionales, sillones y prestaciones | `R` | Consulta catálogo y disponibilidad para asignar turnos |
| **Recepcionista / Asistente** | Pacientes (ficha básica) | `C, R, U` | Alta, búsqueda y edición administrativa; sin borrado definitivo |
| **Recepcionista / Asistente** | Agenda, turnos y recordatorios | `C, R, U` | Operación completa de turnos multi-profesional y multi-sillón |
| **Recepcionista / Asistente** | Historia clínica y odontograma *(v1.1)* | Sin acceso de escritura | Separación clínica/administrativa (solo odontólogos editan HC) |
| **Paciente** *(no autenticado / token)* | Catálogo y disponibilidad pública | `R` (anonimizada) | Solo ve bloques horarios libres, nunca nombres ni turnos de otros pacientes |
| **Paciente** *(no autenticado / token)* | Turno propio (vía link o token) | `C` (reserva), `R / U` (confirmar/cancelar propio) | Limitado exclusivamente al turno asociado a su token firmado |

---

## Rutas públicas

Rutas accesibles sin login ni contraseña, protegidas contra enumeración y exposición de datos sensibles:

- **`GET /book/{clinicSlug}` (UI) y `/api/v1/public/{clinicSlug}/catalog`:** página de reserva online 24/7 del consultorio con prestaciones habilitadas y profesionales disponibles.
- **`GET /api/v1/public/{clinicSlug}/availability`:** consulta de franjas horarias libres por prestación/profesional, devolviendo únicamente horarios disponibles (sin datos de otros pacientes ni asignaciones internas).
- **`POST /api/v1/public/{clinicSlug}/bookings`:** creación de turno por el paciente ingresando los datos mínimos de ficha básica.
- **`GET/POST /appointments/action/{token}`:** confirmación o cancelación de un turno específico desde enlaces enviados en recordatorios (token opaco con expiración).
- **`POST /api/v1/webhooks/whatsapp`:** endpoint público receptor de notificaciones de Meta WhatsApp Business API (validado por firma HMAC/verify token).
- *(v1.1)* **`/portal/{token}`** (portal del paciente sin contraseña) y **`POST /api/v1/webhooks/mercadopago`** (notificaciones IPN/Webhook firmadas).

