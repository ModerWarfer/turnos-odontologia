# Descripción General

## Stack tecnológico

> **Nota de fidelidad al Discovery y resolución Pre-Etapa 6:** el informe de Discovery (`docs/discovery/informe-discovery.md`) definió el modelo Cloud SaaS, el dominio y las integraciones externas; al cierre de las preguntas abiertas de prioridad Alta en `10_preguntas_abiertas.md` (antes de iniciar la Etapa 6 OPSX), el equipo confirmó el stack concreto:

| Capa | Tecnologías | Versión mínima / Estado |
|---|---|---|
| **Modalidad y plataforma** | Cloud SaaS multi-tenant, aplicación web responsive multi-dispositivo | Definido en Discovery |
| **Backend / API y Dominio** | TypeScript sobre Node.js (arquitectura modular / puertos y adaptadores) | Node.js 20+ / TypeScript 5+ (Confirmado) |
| **Frontend Web** | React + TypeScript | Confirmado |
| **Base de datos** | MySQL 8 (soporte transaccional ACID; desacoplado vía patrón Repository en dominio) | MySQL 8.x (Confirmado) |
| **Cola / Scheduler** | Workers sobre Node.js / MySQL job table para recordatorios idempotentes | Confirmado para `C-08` |
| **Testing** | Vitest (`npm test`) cubriendo escenarios Dado/Cuando/Entonces y health checks | Vitest (Confirmado para Etapa 6 OPSX) |

---

## Arquitectura general

```text
+-----------------------------------+     +-----------------------------------+
|  Cliente Web Staff (Consultorio)  |     |  Portal Público Reserva 24/7      |
|  Admin / Odontólogo / Recepción   |     |  Paciente (link propio por sede)  |
+-----------------+-----------------+     +-----------------+-----------------+
                  | HTTPS / REST (JSON)                     | HTTPS / REST (JSON)
                  +--------------------+--------------------+
                                       v
                  +-----------------------------------------+
                  |      API SaaS Multi-tenant (Core)       |
                  |  - Auth & RBAC (por clinic_id)          |
                  |  - Gestión de Pacientes                 |
                  |  - Motor de Agenda (anti-solapamiento)  |
                  |  - Orquestación de Recordatorios        |
                  +----+-------------------------------+----+
                       |                               |
          +------------+------------+     +------------+------------+
          v                         v     v                         v
+-------------------+   +-------------------+   +---------------------------+
| Base de Datos     |   | Worker / Scheduler|   | Adaptadores Externos      |
| Multi-tenant      |   | Recordatorios     |   | - WhatsApp Business (Meta)|
| (clinic_id scope) |   | (Jobs idempotentes|   | - Email transaccional     |
+-------------------+   +-------------------+   | - [v1.1] Mercado Pago     |
                                                | - [v1.1] ARCA (CAE)       |
                                                | - [v1.1] Google Calendar  |
                                                +---------------------------+
```

**Justificación de decisiones de alto nivel:**
- **Cloud SaaS multi-tenant:** permite acceso multi-dispositivo sin instalación local (a diferencia de software legado on-premise), habilita backups centralizados y alinea el modelo comercial por institución en ARS sin permanencia.
- **Motor de agenda centralizado y transaccional:** la prevención estricta de solapamientos por profesional y por sillón/box no puede depender solo de validación en frontend; requiere verificación atómica en backend/persistencia.
- **Adaptadores desacoplados para integraciones:** WhatsApp Business (por costos y políticas de plantillas Meta), Mercado Pago y ARCA requieren interfaces intercambiables para pruebas aisladas y tolerancia a fallos externos.

---

## Integraciones externas

| Servicio | Propósito | Tipo (REST/webhook/SDK) | Alcance |
|---|---|---|---|
| **WhatsApp Business API** (plantillas Meta aprobadas) | Envío de recordatorios automáticos de turnos y recepción de confirmaciones/cancelaciones | REST API + Webhooks | **v1.0 (MVP)** |
| **Email transaccional** | Recordatorios complementarios y respaldo ante fallo o restricción de WhatsApp | SMTP / REST API | **v1.0 (MVP)** |
| **Mercado Pago** | Cobro de seña online a cuenta propia del consultorio/profesional y registro de pagos | REST API + Webhooks | **v1.1** |
| **ARCA** (ex AFIP) | Facturación electrónica integrada con obtención de CAE | WebService SOAP/REST | **v1.1** |
| **Google Calendar** | Sincronización de agenda por profesional | REST API (OAuth2) | **v1.1** |
| **PUCO** | Consulta de padrón / cobertura de obras sociales | API / Consulta externa | **Postergado (v2+)** |
| **ReNaPDiS** | Emisión de receta electrónica oficial | Integración oficial | **Postergado (v2+)** |

---

## API REST (contrato conceptual preliminar)

> Los endpoints siguientes representan el contrato conceptual derivado de los casos de uso del MVP y están sujetos a especificación formal durante la fase `Propose` de OpenSpec.

- **Autenticación y tenant**
  - `POST /api/v1/auth/login` — Inicio de sesión del personal de la clínica.
  - `POST /api/v1/auth/logout` — Cierre de sesión.
  - `GET /api/v1/clinic/settings` — Configuración general del consultorio (horarios, link público).
- **Pacientes (ficha básica)**
  - `GET /api/v1/patients` — Búsqueda y listado paginado dentro del tenant.
  - `POST /api/v1/patients` — Alta de ficha básica de paciente.
  - `GET /api/v1/patients/{id}` — Detalle de ficha básica.
  - `PATCH /api/v1/patients/{id}` — Actualización de datos de contacto/identificación.
- **Recursos de agenda (profesionales, sillones/boxes y prestaciones)**
  - `GET /api/v1/professionals` / `POST /api/v1/professionals` — Gestión de odontólogos y horarios laborales.
  - `GET /api/v1/chairs` / `POST /api/v1/chairs` — Gestión de sillones/boxes del consultorio.
  - `GET /api/v1/services` / `POST /api/v1/services` — Catálogo de prestaciones con duración variable en minutos.
- **Agenda y turnos**
  - `GET /api/v1/appointments` — Consulta filtrada por fecha, profesional, sillón/box y estado.
  - `GET /api/v1/availability` — Cálculo de bloques disponibles sin solapamiento.
  - `POST /api/v1/appointments` — Creación de turno con validación atómica de no solapamiento.
  - `PATCH /api/v1/appointments/{id}` — Reprogramación (revalida solapamientos) o cambio de estado.
  - `POST /api/v1/appointments/{id}/cancel` — Cancelación y liberación inmediata de profesional y sillón/box.
- **Reserva online 24/7 (rutas públicas por link propio)**
  - `GET /api/v1/public/{clinicSlug}/catalog` — Prestaciones reservables, profesionales y configuración pública.
  - `GET /api/v1/public/{clinicSlug}/availability` — Bloques horarios libres (sin exponer pacientes existentes).
  - `POST /api/v1/public/{clinicSlug}/bookings` — Reserva online autónoma del paciente.
  - `POST /api/v1/public/appointments/{token}/confirm` / `cancel` — Respuesta sin contraseña por enlace.
- **Recordatorios y webhooks**
  - `GET /api/v1/appointments/{id}/reminders` — Estado de recordatorios programados/enviados.
  - `POST /api/v1/webhooks/whatsapp` — Recepción de estados de entrega y respuestas de pacientes.
- **Extensión v1.1 (no incluida en v1.0):** `/api/v1/clinical-records`, `/api/v1/odontograms`, `/api/v1/budgets`, `/api/v1/payments`, `/api/v1/invoices` (ARCA), `/api/v1/public/portal/{token}`.

