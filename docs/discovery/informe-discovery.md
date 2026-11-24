# Informe consolidado de Discovery — Turnos Odontología

**Fecha de elaboración:** 19/11/2026  
**Fecha de auditoría:** 2026-11-24  
**Proyecto:** turnos-odontologia  
**Responsable:** Analista de mercado y producto SaaS (salud digital / odontología, Argentina y LATAM)

---

## 1. Resumen ejecutivo

El mercado argentino de software odontológico es competitivo y fragmentado. Existen soluciones locales consolidadas (Bilog, DentalSoft, Dentidad, Denteo, FLAP, DrApp, Odonto.ar, ClínIA) con fuerte foco en cumplimiento normativo (ARCA, Ley 25.326, ReNaPDiS) y pagos locales (Mercado Pago), además de competidores regionales (AgendaPro, Dentalink) e internacionales de referencia (Dentrix, CareStack, Adit) que marcan el estándar en IA y RCM.

La oportunidad diferencial reside en combinar: (a) gestión de turnos con automatización real (WhatsApp, recordatorios, señas, recuperación de ausencias), (b) funcionalidad clínica odontológica comprobable (odontograma versionado, historia clínica, presupuestos), (c) integración nativa con ecosistema argentino (ARCA, PUCO, Mercado Pago, WhatsApp Business con plantillas Meta), y (d) experiencia de paciente superior (portal sin contraseña, reservas 24/7, check-in QR). Los vacíos más frecuentes en el mercado local son: IA aplicada a clínica (no solo front-office), facturación ARCA integrada de fábrica, trazabilidad/versionado del odontograma, y pricing transparente por institución.

**Competidores prioritarios para demo:** DentalSoft, Dentidad, Bilog, Denteo, FLAP.  
**Productos de referencia UX:** DentalSoft, Dentidad, AgendaPro.

---

## 2. Sección A — Tabla comparativa de sistemas (auditoría 2026-11-24)

Convención por fila: **(C)** = Funcionalidad comprobada públicamente; **(A)** = Afirmación comercial del proveedor; **"No evidenciado"** = sin respaldo público.

| # | Nombre | Proveedor | País/origen | URL verificada | Segmento | Modalidad | Agenda | Turnos digitales | Automatización | Clínica | Administración | Integraciones | Operación | Seguridad | Modelo comercial | Fortalezas | Limitaciones | Evidencia (C/A) | URL exacta y fecha |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | DentalSoft | DentalSoft (AR) | Argentina | dentalsoft.com.ar | Consultorios/clínicas AR | Cloud SaaS | (C) Vista semanal/diaria/mensual, drag&drop | (C) Turnos online 24/7 desde web propia | (C) Recordatorios WA/email, IA recepcionista 24h, campañas | (C) HC + odontograma 18 estados FDI | (C) Caja, cobros, MercadoPago, liquidaciones, OS, reportes KPIs | (C) WA, email, Google Calendar, MercadoPago, web propia | (C) Soporte WA/email español, migración asistida | (A) Cloud, sin detalle certificaciones | (C) Freemium + $30.000/$60.000 ARS/mes | Automatización completa, plan gratis 3 meses, web incluida | Costo Meta por mensaje, plan base recordatorios manuales | C/A mixto | dentalsoft.com.ar — 2026-11-24 |
| 2 | Dentidad | Dentidad (AR) | Argentina | dentidad.com | Consultorios, multi-sede | Cloud SaaS | (C) Agenda por profesional | (C) Reserva online, turnos online | (C) Recordatorios WA/email, seña MercadoPago | (C) HC + odontograma doble vista 5 caras 8 proc | (C) Cobros, presupuestos, factura ARCA, OS precargadas >70 | (C) MercadoPago, ARCA, WA/email | (C) Migración CSV, soporte fundador | (A) Cloud | (C) Promo lanzamiento 50% por 3 meses: Esencial $25.000/mes, Clínica $42.500/mes, Multi-sede $150.000/mes. Precios regulares de lista: Esencial $50.000/mes, Clínica $85.000/mes, Multi-sede $300.000/mes (IVA incluido, 14 días gratis) | ARCA integrado, seña a cuenta propia, OS precargadas | Plan básico limitado (1 dentista) | C/A mixto | dentidad.com/#diferencias — 2026-11-24 |
| 3 | Bilog | Bilog (AR) | Argentina | bilog.com.ar | Consultorios/clínicas AR | Cloud SaaS | (C) Turnos, estados, recordatorios | (C) Turnos online renovados con IA | (C) iAngela IA (gestión y lectura Rx), recordatorios | (C) HC digital, odontograma, adjuntos | (C) Facturación, cobros, liquidaciones OS, reportes KPIs | (A) App mobile, turnos online, iAngela IA | (C) Migración sin costo, soporte personalizado | (A) Cloud | (A) No publicado (mensual, sin permanencia) | +20 años, +1.500 clínicas, IA radiografías | Pricing no público | C/A mixto | bilog.com.ar — 2026-11-24 |
| 4 | Denteo | Denteo (AR) | Argentina | denteo.com.ar | Consultorios/clínicas/labs | Cloud SaaS multi-tenant | (C) Agenda visual con estados | (No evidenciado) portal paciente | (C) WA con plantillas Meta aprobadas | (C) HC + odontograma | (C) Facturación ARCA integrada (~3 min CAE) | (C) ARCA, Google Calendar, WA Business, MercadoPago | (C) App Android nativa, backup diario, servidor AR | (C) Ley 25.326, servidor AR | (A) No publicado (15 días gratis) | Módulo laboratorio integrado, ARCA de fábrica | Pricing no público, app solo Android | C/A mixto | denteo.com.ar — 2026-11-24 |
| 5 | FLAP | FLAP (AR) | Argentina | flap.com.ar/odontologos | Odontólogos/clínicas | Cloud | (C) Agenda multi-profesional | (C) Turnero 24/7, reservas online | (C) Avisos email (WA paquetes extra), reputación Google auto, recuperación turnos | (C) HC odontológica, odontograma FDI versionado, ortodoncia | (C) Finanzas, liquidaciones, inventario | (C) MercadoPago, Google | (C) Check-in DNI/QR, pacientes familiares | (A) Cloud | (C) Plan gratis + planes (precios no visibles) | Check-in QR, pacientes familiares (odontopediatría) | WA no incluido en base | C/A mixto | flap.com.ar/odontologos — 2026-11-24 |
| 6 | ClínIA | Emprinet (AR) | Argentina | clinia.com.ar/odontologia | Consultorios/clínicas/público | Cloud, instancia personalizada | (C) Agenda por profesional/especialidad/consultorio | (C) Turnos con IA por WhatsApp | (C) IA en HC y turnos, recordatorios auto | (C) Odontograma FDI 52 piezas versionado, plan tratamiento CIE-10 | (C) Facturación ARCA, PUCO, caja ARS/USD/EUR | (C) PUCO, ARCA, ReNaPDiS, WA | (C) Migración y capacitación incluidas, backups 10 min | (A) Cloud, subdominio propio | (C) Cotiza por institución (no por usuario) | Pricing por institución, receta electrónica oficial | Precio no público | C/A mixto | clinia.com.ar/odontologia — 2026-11-24 |
| 7 | DrApp | DrApp (AR) | Argentina | drapp.com.ar | Profesionales salud (incl. odontología) | Cloud | (C) Agenda inteligente | (C) Turnos online (marketplace Crontu) | (C) IA: resúmenes, dictado, asistente, odontograma por voz, copiloto ausencias | (C) HC electrónica, odontograma por dictado | (C) Cobros MercadoPago, facturación ARCA, reportes | (C) MercadoPago, ARCA, Farmalink/Innovamed | (C) App móvil, multi-sede, roles, API pública | (A) Cloud | (C) Desde $33.999/agenda/mes | IA avanzada, usuarios ilimitados | Orientado general, verificar plan dental | C/A mixto | drapp.com.ar — 2026-11-24 |
| 8 | Odonto.ar | Odonto.ar (AR) | Argentina | odonto.ar | Odontólogos independientes/clínicas | Cloud | **Funcionalidad comprobada en demo interactiva:** vista Día/Semana/Mes, columnas simultáneas por profesional, 5 estados de turno por color (Agendado, Confirmado, Completado, Cancelado, No asistió) y bloques de duración variable según prestación | (C) Turnos online (paciente elige horario) | (No evidenciado) automatización WA | (C) HC, odontograma con auditoría de cambios | (C) Panel finanzas, presupuestos, OS y coberturas | (C) Importación Excel, MercadoPago | (C) Multi-dispositivo | (A) Cloud | (C) $29/$49/$99 USD/mes | Todos los planes incluyen todas las funciones | Pricing en USD, sin WA automático, sin ARCA | C/A mixto | odonto.ar/demo — 2026-11-24 |
| 9 | AgendaPro | AgendaPro (CL) | Chile/LATAM | agendapro.com/ar/... | Clínicas dentales | Cloud | (C) Agenda por odontólogo/sillón/sede | (C) Turnos online 24/7 | (C) IA "Alex" (WA/IG/Messenger), recordatorios WA, campañas | (C) HC, odontograma, consentimiento firma electrónica | (C) Honorarios, caja diaria, reportes | (C) MercadoPago, directorio Google | (C) App pacientes, migración 24h, soporte 24/7 | (C) Certificación CENS, Ley 25.326/26.529 | (C) Desde $13.900 ARS/mes | IA conversacional fuerte, directorio 2M pacientes | IA es complemento opcional (costo extra) | C/A mixto | agendapro.com/ar/dental/software-odontologico — 2026-11-24 |
| 10 | Dentalink | Dentalink (LATAM) | Latinoamérica | softwaredentalink.com | Clínicas dentales | Cloud 100% | (C) Agenda online | (C) Turnos online + WhatsApp | (C) Recordatorios WA/email, Contact Center IA | (C) HC, odontograma, recetas | (C) Facturación, reportes | (C) WA, email | (C) App, sin permanencia | (A) Cloud | (A) Planes Esencial/Pro/Titanium (sin precios públicos) | IA integrada (dictado, simulador sonrisa) | Precios no públicos | C/A mixto | softwaredentalink.com — 2026-11-24 |
| 11 | DenPro | Elite Digital Services (UE) | Multinacional (.ar) | denpro.ar | Consultorios | Cloud | (C) Turnos, calendario | (C) Turnos online / reserva online | (C) Recordatorios SMS | (C) HC, odontograma FDI | (C) Facturación, exportaciones seguros, inventario (plan Team) | (No evidenciado) | (C) App iOS/Android, migración gratuita | (A) RGPD | (C) $19.900/$29.900 ARS/mes | Prueba 30 días sin tarjeta, pricing transparente | Orientado genérico, pocos detalles clínicos | C/A mixto | denpro.ar — 2026-11-24 |
| 12 | Medilink | Medilink (LATAM) | Latinoamérica | softwaremedilink.com | Clínicas/consultorios médicos | Cloud | (C) Agenda 360°, sobreagendamiento | (C) Agendamiento online web/WA/IG | (C) Recordatorios email/WA, Contact Center IA | (C) Ficha clínica personalizable | (C) Cobros, facturación ARCA, +80 reportes | (C) ARCA, WA, email | (C) Multi-sede, roles, inventario (planes superiores) | (A) Cloud | (A) No público (según terceros 1.5x promedio) | Facturación OS fuerte | Orientado medicina, precios altos | C/A mixto | softwaremedilink.com — 2026-11-24 |
| 13 | Adit | Adit (USA) | USA | adit.com | Prácticas dentales (USA) | Cloud | (C) Online scheduling | (C) Online scheduling | (C) AI Front Desk, AI Call Intelligence, texting, reminders; **"Recare de IA" figura en su web oficial como "Próximamente" (no disponible hoy)** | (A) No es PMS clínico (se integra) | (C) Adit Pay, claims, verificaciones | (C) VoIP, texting HIPAA, email, eFax, PMS (Dentrix, Open Dental) | (C) App móvil | (C) HIPAA | (A) Quote-based, demo | IA telefonía avanzada, sin contratos | Mercado USA, no PMS clínico, precio no público | C/A mixto | adit.com — 2026-11-24 |
| 14 | CareStack | CareStack (USA) | USA/UK/AU | carestack.com | Prácticas, DSOs multi-sede | Cloud | (C) Multi-location scheduling | (C) Online self-scheduling | (C) AI teammates (confirmación, cobranzas, recall, tratamiento, cancelaciones), VoiceStack | (C) Charting general/periodontal, notas templates, imaging, e-prescriptions | (C) RCM completo, claims, pagos, membership plans | (C) 150+ integraciones | (C) App móvil, teledentistry | (C) HIPAA, SOC2, ISO 27001, GDPR | (A) Essentials $829/mes, Intelligence $1.299/mes (fuentes secundarias) | Certificaciones enterprise, IA por función | Mercado USA/UK/AU, precio alto | C/A mixto | carestack.com — 2026-11-24 |
| 15 | Dentrix | Henry Schein One (USA) | USA/Canadá | dentrix.com | Prácticas de todos los tamaños | Cloud (Ascend) o on-premise | (C) Agenda | (C) Online scheduling | (C) Reminders, reputation management, patient communication | (C) Charting, imaging con AI, auto-coding claims | (C) Billing/insurance/collections, analytics | (C) 150+ partners, API Exchange | (C) IT management, backups, training | (A) Cybersecurity | (A) Quote-based | Líder histórico 30+ años, imaging AI | Mercado USA/CA, precio no público, on-premise legado | C/A mixto | dentrix.com — 2026-11-24 |
| 16 | Cal.com | Cal.com | Global | cal.com/blog/best-dental-scheduling-software | Scheduling para prácticas | Cloud | (C) Booking online brandeable | (C) Booking online embebible | (C) Reminders email/SMS, Cal AI phone agent | (A) No PMS clínico | (C) Pagos (Stripe/PayPal), analytics | (C) 100+ integraciones, API/webhooks | (No evidenciado) operación clínica | (C) HIPAA + BAA (planes superiores) | (C) Free / $16/usuario/mes | Free plan generoso, pricing transparente, API | No es PMS odontológico | C/A mixto | cal.com/blog/best-dental-scheduling-software — 2026-11-24 |
| 17 | Zoho Bookings | Zoho | Global | zoho.com/bookings/explore/best-dental-scheduling-software.html | Scheduling | Cloud | (C) Booking online | (C) Self-scheduling | (C) Reminders, confirmaciones, reprogramación | (A) No PMS clínico | (C) Pagos/depositos | (C) Zoho ecosystem, APIs | (C) Multi-provider/multi-location | (C) HIPAA | (C) 15 días gratis, planes no detallados | Scheduling-only, se integra con PMS | No reemplaza PMS clínico | C/A mixto | zoho.com/bookings/... — 2026-11-24 |
| 18 | Dentimax | Dentimax (USA) | USA | dentimax.com (fetch falló 403) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | URL registrada como fallo de fetch | Fetch falló (403) | No evidenciado | dentimax.com — 2026-11-24 |

> Sistemas reales incluidos en Tabla A: **18** (≥15). Guías de blog (Guideflow, Reservo) se listan solo en Referencias.

---

## 3. Sección B — Matriz de puntuación (0-5)

Pesos: Turnos y automatización 25%; Funcionalidad clínica 20%; Integraciones locales y WhatsApp 15%; Administración/cobros/facturación 15%; Experiencia del paciente 10%; Seguridad/exportación/trazabilidad 10%; Precio y facilidad de adopción 5%.

| Sistema | Turnos/Auto (25%) | Clínica (20%) | Integraciones (15%) | Admin/Cobros (15%) | Exp. paciente (10%) | Seguridad/Trazab. (10%) | Precio/Adopción (5%) | **Score ponderado** |
|---|---|---|---|---|---|---|---|---|
| DentalSoft | 4.5 | 4.0 | 4.0 | 4.0 | 4.5 | 3.0 | 4.0 | **4.13** |
| Dentidad | 4.0 | 4.0 | 4.5 | 4.5 | 4.0 | 3.5 | 4.0 | **4.10** |
| ClínIA | 4.0 | 4.5 | 4.5 | 4.0 | 3.5 | 4.5 | 3.5 | **4.13** |
| Bilog | 4.0 | 4.0 | 3.5 | 4.0 | 3.5 | 3.5 | 3.5 | **3.83** |
| FLAP | 4.0 | 4.0 | 3.5 | 3.5 | 4.0 | 3.0 | 4.0 | **3.78** |
| Denteo | 3.5 | 3.5 | 4.0 | 4.0 | 3.0 | 4.0 | 3.5 | **3.65** |
| AgendaPro | 4.5 | 3.5 | 4.0 | 3.5 | 4.5 | 3.5 | 4.0 | **3.95** |
| Dentalink | 4.0 | 3.5 | 3.5 | 3.0 | 3.5 | 3.0 | 3.0 | **3.53** |
| DrApp | 4.0 | 3.5 | 3.5 | 3.5 | 3.5 | 3.0 | 3.5 | **3.63** |
| Odonto.ar | 3.0 | 3.5 | 2.5 | 3.0 | 3.0 | 3.0 | 4.0 | **3.18** |
| CareStack | 4.5 | 4.5 | 2.5 | 4.5 | 4.0 | 5.0 | 2.0 | **4.05** |
| Dentrix | 4.0 | 4.5 | 2.5 | 4.0 | 3.5 | 4.5 | 2.0 | **3.75** |
| Adit | 4.5 | 2.0 | 2.5 | 3.5 | 3.5 | 3.5 | 2.5 | **3.28** |
| DenPro | 3.0 | 3.0 | 2.5 | 3.0 | 3.0 | 3.0 | 4.0 | **3.03** |
| Medilink | 3.5 | 2.5 | 3.0 | 4.0 | 3.0 | 3.0 | 2.5 | **3.20** |
| Cal.com | 3.5 | 1.0 | 3.0 | 3.0 | 3.5 | 3.5 | 4.5 | **2.98** |
| Zoho Bookings | 3.5 | 1.0 | 3.0 | 2.5 | 3.5 | 3.5 | 4.0 | **2.83** |

**Ranking (top):** DentalSoft/ClínIA (4.13) → Dentidad (4.10) → CareStack (4.05) → AgendaPro (3.95) → Bilog (3.83).

> **Nota metodológica (escala 0-5):** 0 = no evidenciado / inexistente; 1 = mencionado sin detalle; 2 = básico; 3 = adecuado; 4 = robusto; 5 = líder/excelente. Los datos marcados como "No evidenciado" en Tabla A se puntuaron con 0 o 1 según corresponda, sin inventar capacidades. Puntuación basada únicamente en fuentes públicas verificables (sitios oficiales, docs, precios, centros de ayuda). Afirmaciones comerciales sin respaldo se penalizan en la columna correspondiente.

---

## 4. Sección C — Análisis competitivo

### Estándares de mercado
- Agenda multi-profesional con estados y recordatorios automáticos.
- Historia clínica electrónica + odontograma FDI.
- Turnos online 24/7 y reserva por link.
- Facturación y cobros (caja, reportes).
- Cloud SaaS, multi-dispositivo.

### Diferenciadores reales
- IA aplicada a front-office (AgendaPro Alex, DentalSoft recepcionista, Adit AI Front Desk, CareStack AI teammates).
- IA clínica (Bilog iAngela radiografías, ClínIA asistente HC, DrApp odontograma por voz).
- Facturación ARCA integrada de fábrica (Denteo, Dentidad, ClínIA).
- Odontograma versionado con auditoría (ClínIA, FLAP).
- Pricing por institución (ClínIA).

### Vacíos frecuentes en AR
- IA clínica real (no solo chatbot de turnos).
- Trazabilidad/versionado del odontograma con comparación.
- Facturación ARCA nativa (muchos la tienen como módulo aparte).
- Pricing transparente y en pesos (varios ocultan precios).
- Recuperación de pacientes inactivos y campañas automatizadas (solo DentalSoft evidenciado).
- Check-in por QR/DNI (solo FLAP).

### Oportunidades de innovación
- Combinar IA clínica + IA front-office en un solo producto local.
- Odontograma versionado con comparación temporal y anclaje de evoluciones.
- Seña online a cuenta propia del profesional (Mercado Pago) + recuperación automática de turnos cancelados.
- Pricing por institución con transparencia en pesos.
- Módulo de laboratorio dental integrado (poco común, solo Denteo).

---

## 5. Sección D — Recomendación final

### 5 competidores prioritarios para demo
1. DentalSoft (automatización completa, plan gratis).
2. Dentidad (ARCA + Mercado Pago + OS precargadas).
3. Bilog (base instalada, IA radiografías).
4. Denteo (ARCA de fábrica, módulo lab).
5. FLAP (odontograma versionado, check-in QR).

### 3 productos de referencia UX
1. DentalSoft — automatización y marketing.
2. Dentidad — clínica + financiero + portal paciente.
3. AgendaPro — IA conversacional y adquisición de pacientes.

### MVP sugerido

**Imprescindibles:**
- Agenda multi-profesional con estados.
- Turnos online 24/7 (link propio).
- Recordatorios automáticos WhatsApp/email.
- Seña online (Mercado Pago).
- HC + odontograma FDI (versionado básico).
- Presupuestos y cobros, caja diaria.
- Facturación electrónica ARCA.
- Portal del paciente sin contraseña.

**Diferenciadores:**
- IA recepcionista 24h (turnos por WhatsApp).
- Recuperación de pacientes inactivos / campañas.
- Odontograma versionado con comparación.
- Check-in por QR/DNI.
- Pricing por institución en pesos.

**Postergados:**
- Receta electrónica (ReNaPDiS).
- Teleconsulta.
- Módulo de laboratorio dental.
- Cobertura de obras sociales (PUCO) avanzada.
- Imaging con IA.

---

## 6. Verificación de fuentes (auditoría 2026-11-24)

### 1) dentidad.com/#diferencias
- **Original:** precios listados como $25.000 / $42.500 / $150.000 ARS/mes.
- **Verificado:** corresponden a promo de lanzamiento (50% por 3 meses). Precios regulares: Esencial $50.000/mes, Clínica $85.000/mes, Multi-sede $300.000/mes (IVA incluido, 14 días gratis).
- **Corrección:** columna Modelo comercial actualizada con promo y precios de lista.

### 2) turnosweb.com
- **Original:** incluido como sistema odontológico (TurnosWeb).
- **Verificado:** es un sistema exclusivo para gimnasios y centros deportivos, no odontológico.
- **Corrección:** eliminado de Tabla A y Matriz B.

### 3) odonto.ar/demo
- **Original:** agenda descrita sin detalle de vistas/estados.
- **Verificado:** demo interactiva muestra vista Día/Semana/Mes, columnas simultáneas por profesional, 5 estados por color y bloques de duración variable.
- **Corrección:** celda de Agenda actualizada con funcionalidad comprobada.

### 4) medilink.com.ar
- **Original:** URL arrojaba ERR_NAME_NOT_RESOLVED.
- **Verificado:** dominio oficial activo es https://softwaremedilink.com.
- **Corrección:** URL actualizada en Tabla A y Referencias.

### 5) adit.com
- **Original:** "Recare de IA" listado como disponible.
- **Verificado:** en su web oficial figura como "Próximamente" (no disponible hoy).
- **Corrección:** aclarado en fila de Adit.

Adicionales:
- **Dentalink:** URL oficial actualizada a https://www.softwaredentalink.com.
- **Guideflow y Reservo:** quitados de Tabla A (son artículos de blog), permanecen solo en Referencias. Quedan 18 sistemas reales (≥15).

---

## 7. Referencias completas

- Adit — https://www.adit.com — 2026-11-24
- AgendaPro — https://agendapro.com/ar/dental/software-odontologico — 2026-11-24
- Bilog — https://bilog.com.ar — 2026-11-24
- Cal.com — https://cal.com/blog/best-dental-scheduling-software — 2026-11-24
- CareStack — https://www.carestack.com — 2026-11-24
- ClinIA — https://clinia.com.ar/odontologia — 2026-11-24
- DenPro — https://denpro.ar — 2026-11-24
- Dentalink — https://www.softwaredentalink.com — 2026-11-24
- DentalSoft — https://dentalsoft.com.ar — 2026-11-24
- Denteo — https://denteo.com.ar — 2026-11-24
- Dentidad — https://dentidad.com/#diferencias — 2026-11-24
- Dentimax — https://www.dentimax.com (fetch falló 403) — 2026-11-24
- Dentrix — https://www.dentrix.com — 2026-11-24
- DrApp — https://www.drapp.com.ar — 2026-11-24
- FLAP — https://flap.com.ar/odontologos — 2026-11-24
- Guideflow — https://www.guideflow.com/blog/dental-practice-management-software — 2026-11-24 (blog, no SaaS)
- Medilink — https://softwaremedilink.com — 2026-11-24
- Odonto.ar — https://odonto.ar/demo — 2026-11-24
- Reservo — https://reservo.cl/blog/profesionales/dental/guia-para-elegir-el-mejor-software-dental-en-argentina — 2026-11-24 (blog, no SaaS)
- Zoho Bookings — https://www.zoho.com/bookings/explore/best-dental-scheduling-software.html — 2026-11-24

---

*Informe consolidado de Discovery — Turnos Odontología. Fuentes en discovery/sources/*.md (consulta original 19/11/2026; auditoría 2026-11-24).*
