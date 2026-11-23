# Arquitectura Propuesta

> **Nota sobre stack:** dado que el Discovery no definió lenguaje ni framework de aplicación (ver `02_descripcion_general.md` y `10_preguntas_abiertas.md`), la arquitectura propuesta se expresa de forma **agnóstica al stack**, compatible con las herramientas disponibles en Etapa 0 (Go o Node.js) y alineada a los requisitos de aislamiento, concurrencia y testabilidad del ciclo OPSX.

---

## Patrones aplicados

| Patrón | Dónde se usa | Por qué |
|---|---|---|
| **Multi-tenancy lógico (`clinic_id`)** | Todas las tablas operativas, repositorios y middlewares de API | Permite SaaS cloud compartido económico y escalable con aislamiento estricto por consultorio/clínica |
| **Arquitectura por capas / Dominio puro** | Motor de agenda (`domain/`), casos de uso (`application/`) e integraciones (`infrastructure/`) | Permite testear reglas críticas (`RN-AG-*`) con tests unitarios rápidos y desacoplar adaptadores externos |
| **Control transaccional de concurrencia** | Creación y reprogramación de turnos (`Appointment`) | Evita condiciones de carrera / dobles reservas simultáneas en profesional o sillón/box (`RN-RO-02`) |
| **Ports & Adapters (puertos y adaptadores)** | WhatsApp Business, Email, y en v1.1 Mercado Pago / ARCA / Google Calendar | Facilita mocks en testing automatizado y reemplazo de proveedores sin tocar lógica de negocio |
| **Outbox / Scheduler idempotente** | Envío de recordatorios (`Reminder`) | Garantiza exactamente un envío por ventana (`idempotency_key`) evitando sobrecostos de Meta |

---

## Estructura de directorios

```text
turnos-odontologia/
├── docs/                       # Documentos fuente (ej. discovery/informe-discovery.md)
├── discovery/                  # Fichas individuales de competidores (21 fuentes)
├── knowledge-base/             # Base de conocimiento canónica (este directorio)
├── openspec/                   # Especificaciones y changes OPSX (spec-driven)
├── backend/                    # [A crear al iniciar implementación]
│   ├── domain/                 # Entidades, value objects, reglas puras (no solapamiento)
│   ├── application/            # Casos de uso (crear turno, reservar online, recordatorios)
│   ├── infrastructure/         # Persistencia, HTTP/REST, adaptadores WhatsApp/Email/ARCA/MP
│   └── tests/                  # Tests unitarios, integración y escenarios Dado/Cuando/Entonces
└── frontend/                   # [A crear al iniciar implementación]
    └── src/
        ├── features/           # Agenda, pacientes, configuración, reserva pública 24/7
        ├── shared/             # Componentes UI, cliente HTTP, utilidades de fecha/zona horaria
        └── pages/              # Rutas privadas (staff) y rutas públicas (/book/:slug)
```

---

## Seguridad

- **Autenticación:** sesiones o tokens firmados (JWT/cookie `HttpOnly`) para el personal de la clínica; acceso público sin contraseña para reserva 24/7 y acciones puntuales protegido mediante `public_action_token` criptográficamente aleatorio.
- **Autorización:** middleware obligatorio de extracción de `clinic_id` desde la sesión autenticada (nunca confiar en un `clinic_id` enviado libremente por el cliente) + verificación RBAC por rol (`admin`, `dentist`, `receptionist`).
- **Validación de input:** validación estricta de esquemas en entrada HTTP (formatos de fecha ISO-8601 con zona horaria, teléfonos E.164, duraciones `> 0`, saneamiento de strings) y verificación de firmas HMAC en webhooks externos (WhatsApp / Mercado Pago).
- **Cumplimiento normativo (Ley 25.326 y Ley 26.529):** cifrado en tránsito (HTTPS/TLS), mínimo privilegio en rutas públicas, backups diarios (referencia Denteo/ClínIA en Discovery) y **prohibición absoluta** de commitear datos reales de pacientes en código, logs o fixtures.
- **Secrets management:** credenciales de base de datos, tokens de WhatsApp Business, claves de Mercado Pago y certificados fiscales ARCA exclusivamente mediante variables de entorno o gestor de secretos; nunca versionados en Git.

---

## Variables de entorno

| Variable | Descripción | Ejemplo | Sensible (Y/N) |
|---|---|---|---|
| `APP_ENV` | Entorno de ejecución | `development` | N |
| `PORT` | Puerto HTTP del servidor backend | `8080` | N |
| `APP_TIMEZONE` | Zona horaria operativa por defecto | `America/Argentina/Buenos_Aires` | N |
| `DATABASE_URL` | Cadena de conexión a la base de datos | `postgres://user:pass@localhost:5432/turnos_demo` | Y |
| `AUTH_JWT_SECRET` | Clave de firma para tokens/sesiones del staff | `cambiar-en-entorno-real` | Y |
| `PUBLIC_BASE_URL` | URL base para generar links de reserva y confirmación | `https://app.ejemplo.local` | N |
| `WHATSAPP_API_URL` | Endpoint base de WhatsApp Business Cloud API | `https://graph.facebook.com/v20.0` | N |
| `WHATSAPP_ACCESS_TOKEN` | Token de acceso Meta WhatsApp Business | `wa-token-ejemplo` | Y |
| `WHATSAPP_VERIFY_TOKEN` | Token de verificación del webhook Meta | `wa-verify-ejemplo` | Y |
| `WHATSAPP_APP_SECRET` | Secreto para validar firma HMAC de webhooks Meta | `wa-secret-ejemplo` | Y |
| `EMAIL_SMTP_HOST` | Host SMTP o proveedor de email transaccional | `smtp.ejemplo.local` | N |
| `EMAIL_API_KEY` | Credencial del proveedor de email | `email-key-ejemplo` | Y |
| `MP_ACCESS_TOKEN` *(v1.1)* | Credencial Mercado Pago (o flujo OAuth multi-cuenta) | `mp-token-ejemplo` | Y |
| `ARCA_CERT_PATH` *(v1.1)* | Ruta segura al certificado digital para facturación ARCA | `/secrets/arca/cert.pem` | Y |

