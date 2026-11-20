# Informe consolidado de Discovery — Turnos Odontología

**Fecha de elaboración:** 19/11/2026
**Proyecto:** turnos-odontologia
**Responsable:** Analista de mercado y producto SaaS (salud digital / odontología, Argentina y LATAM)

---

## 1. Resumen ejecutivo

El mercado argentino de software odontológico es competitivo y fragmentado. Existen soluciones locales consolidadas (Bilog, DentalSoft, Dentidad, Denteo, FLAP, DrApp, Odonto.ar, ClínIA) con fuerte foco en cumplimiento normativo (ARCA, Ley 25.326, ReNaPDiS) y pagos locales (Mercado Pago), además de competidores regionales (AgendaPro, Dentalink) e internacionales de referencia (Dentrix, CareStack, Adit) que marcan el estándar en IA y RCM.

La oportunidad diferencial reside en combinar: (a) gestión de turnos con automatización real (WhatsApp, recordatorios, señas, recuperación de ausencias), (b) funcionalidad clínica odontológica comprobable (odontograma versionado, historia clínica, presupuestos), (c) integración nativa con ecosistema argentino (ARCA, PUCO, Mercado Pago, WhatsApp Business con plantillas Meta), y (d) experiencia de paciente superior (portal sin contraseña, reservas 24/7, check-in QR). Los vacíos más frecuentes en el mercado local son: IA aplicada a clínica (no solo front-office), facturación ARCA integrada de fábrica, trazabilidad/versionado del odontograma, y pricing transparente por institución.

**Competidores prioritarios para demo:** DentalSoft, Dentidad, Bilog, Denteo, FLAP.
**Productos de referencia UX:** DentalSoft, Dentidad, AgendaPro.

---

## 2. Metodología y fuentes

- Relevamiento de 21 sistemas odontológicos/médicos y herramientas de scheduling (fuentes en `discovery/sources/*.md`).
- Cada fuente registra URL y fecha de consulta 19/11/2026.
- Se diferenció funcionalidad comprobada públicamente vs afirmación comercial del proveedor; características no demostradas se consignan como "No evidenciado".
- Puntuación 0-5 con pesos definidos en Sección B.

Fuentes consultadas (URLs y fecha 19/11/2026):

| Sistema | URL |
|---|---|
| Adit | https://www.adit.com |
| AgendaPro | https://agendapro.com/ar/dental/software-odontologico |
| Bilog | https://bilog.com.ar |
| Cal.com | https://cal.com/blog/best-dental-scheduling-software |
| CareStack | https://www.carestack.com |
| ClinIA | https://clinia.com.ar/odontologia |
| DenPro | https://denpro.ar |
| Dentalink | https://www.dentalink.com |
| DentalSoft | https://dentalsoft.com.ar |
| Denteo | https://denteo.com.ar |
| Dentidad | https://dentidad.com |
| Dentimax | https://www.dentimax.com (fetch falló 403) |
| Dentrix | https://www.dentrix.com |
| DrApp | https://www.drapp.com.ar |
| FLAP | https://flap.com.ar/odontologos |
| Guideflow | https://www.guideflow.com/blog/dental-practice-management-software |
| Medilink | https://www.medilink.com.ar |
| Odonto.ar | https://odonto.ar |
| Reservo | https://reservo.cl/blog/profesionales/dental/guia-para-elegir-el-mejor-software-dental-en-argentina |
| TurnosWeb | https://www.turnosweb.com |
| Zoho Bookings | https://www.zoho.com/bookings/explore/best-dental-scheduling-software.html |

---

## 3. Perfil del producto

### Problema
Consultorios y clínicas odontológicas argentinas operan con procesos fragmentados (agenda en papel/Excel, recordatorios manuales, cobros dispersos, historia clínica en papel), generando ausencias, pérdida de pacientes y falta de trazabilidad clínica y financiera.

### Usuarios
- Odontólogos (generalistas y especialistas)
- Recepcionistas/asistentes
- Administradores/dueños de clínica
- Pacientes (reserva online, portal, recordatorios)
- Laboratorios dentales (integración, opcional)

### Casos de uso MVP
1. Reserva de turno online 24/7 por paciente (link propio).
2. Agenda multi-profesional/sillón con estados.
3. Recordatorios automáticos por WhatsApp/email.
4. Seña online (Mercado Pago).
5. Historia clínica + odontograma (FDI, versionado).
6. Presupuestos y cobros, caja diaria.
7. Facturación electrónica ARCA.
8. Portal del paciente sin contraseña.

### Reglas de negocio
- Pricing en pesos argentinos, sin permanencia.
- Cumplimiento Ley 25.326 (datos personales) y Ley 26.529 (historia clínica).
- Facturación ARCA integrada (CAE).
- Receta electrónica opcional (ReNaPDiS) — postergada.

### Integraciones
- WhatsApp Business (plantillas Meta aprobadas)
- Mercado Pago (señas, cobros)
- ARCA (facturación electrónica)
- Google Calendar
- PUCO (obras sociales) — futuro

### Restricciones
- Equipo pequeño; presupuesto acotado; mercado AR prioritario.
- No inventar funcionalidades no comprobadas.

### Riesgos
- Competidores locales consolidados con base instalada (Bilog +1.500 clínicas).
- Dependencia de WhatsApp Business API y costos por mensaje (Meta cobra).
- Adopción por profesionales habituados a software instalado.
- Cambios regulatorios (ARCA, Ley 25.326).

### Preguntas abiertas
- ¿Se incluirá módulo de laboratorio dental en MVP?
- ¿Cobertura de obras sociales en MVP o postergado?
- ¿Modelo de pricing: por institución o por usuario?
- ¿Teleconsulta en MVP?

---

## 4. Sección A — Tabla comparativa de sistemas

| # | Nombre | Proveedor | País/origen | URL | Segmento | Modalidad | Agenda | Turnos digitales | Automatización | Clínica | Administración | Integraciones | Operación | Seguridad | Modelo comercial | Fortalezas | Limitaciones |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | DentalSoft | DentalSoft (AR) | Argentina | dentalsoft.com.ar | Consultorios/clínicas AR | Cloud SaaS | Vista semanal/diaria/mensual, drag&drop, Google Calendar | Turnos online 24/7 desde web propia | Recordatorios WA/email, IA recepcionista 24h, campañas recuperación, reseñas Google | HC + odontograma 18 estados FDI, ortodoncia | Caja, cobros, MercadoPago, liquidaciones, OS, reportes KPIs | WA, email, Google Calendar, MercadoPago, web propia | Soporte WA/email español, migración asistida | Cloud, sin detalle certificaciones | Freemium + $30.000/$60.000 ARS/mes | Automatización completa, plan gratis 3 meses, web incluida | Costo Meta por mensaje, plan base recordatorios manuales |
| 2 | Dentidad | Dentidad (AR) | Argentina | dentidad.com | Consultorios, multi-sede | Cloud SaaS | Agenda por profesional | Reserva online, turnos online | Recordatorios WA/email, seña MercadoPago | HC + odontograma doble vista 5 caras 8 proc, evoluciones ancladas | Cobros, presupuestos, factura ARCA, OS precargadas >70, comisiones | MercadoPago, ARCA, WA/email | Migración CSV, soporte fundador | Cloud | $25.000/$42.500/$150.000 ARS/mes | ARCA integrado, seña a cuenta propia, OS precargadas | Plan básico limitado (1 dentista) |
| 3 | Bilog | Bilog (AR) | Argentina | bilog.com.ar | Consultorios/clínicas AR | Cloud SaaS | Turnos, estados, recordatorios | Turnos online renovados con IA | iAngela IA (gestión y lectura Rx), recordatorios | HC digital, odontograma, adjuntos | Facturación, cobros, liquidaciones OS, reportes KPIs | App mobile, turnos online, iAngela IA | Migración sin costo, soporte personalizado | Cloud | No publicado (mensual, sin permanencia) | +20 años, +1.500 clínicas, IA radiografías | Pricing no público |
| 4 | Denteo | Denteo (AR) | Argentina | denteo.com.ar | Consultorios/clínicas/labs | Cloud SaaS multi-tenant | Agenda visual con estados | (No evidenciado portal paciente) | WA con plantillas Meta aprobadas | HC + odontograma | Facturación ARCA integrada (~3 min CAE) | ARCA, Google Calendar, WA Business, MercadoPago | App Android nativa, backup diario, servidor AR | Ley 25.326, servidor AR | No publicado (15 días gratis) | Módulo laboratorio integrado, ARCA de fábrica | Pricing no público, app solo Android |
| 5 | FLAP | FLAP (AR) | Argentina | flap.com.ar/odontologos | Odontólogos/clínicas | Cloud | Agenda multi-profesional | Turnero 24/7, reservas online | Avisos email (WA paquetes extra), reputación Google auto, recuperación turnos | HC odontológica, odontograma FDI versionado, ortodoncia | Finanzas, liquidaciones, inventario | MercadoPago, Google | Check-in DNI/QR, pacientes familiares | Cloud | Plan gratis + planes (precios no visibles) | Check-in QR, pacientes familiares (odontopediatría) | WA no incluido en base |
| 6 | ClínIA | Emprinet (AR) | Argentina | clinia.com.ar/odontologia | Consultorios/clínicas/público | Cloud, instancia personalizada | Agenda por profesional/especialidad/consultorio | Turnos con IA por WhatsApp | IA en HC y turnos, recordatorios auto | Odontograma FDI 52 piezas versionado, plan tratamiento CIE-10 | Facturación ARCA, PUCO, caja ARS/USD/EUR | PUCO, ARCA, ReNaPDiS, WA | Migración y capacitación incluidas, backups 10 min | Cloud, subdominio propio | Cotiza por institución (no por usuario) | Pricing por institución, receta electrónica oficial | Precio no público |
| 7 | DrApp | DrApp (AR) | Argentina | drapp.com.ar | Profesionales salud (incl. odontología) | Cloud | Agenda inteligente | Turnos online (marketplace Crontu) | IA: resúmenes, dictado, asistente, odontograma por voz, copiloto ausencias | HC electrónica, odontograma por dictado | Cobros MercadoPago, facturación ARCA, reportes | MercadoPago, ARCA, Farmalink/Innovamed | App móvil, multi-sede, roles, API pública | Cloud | Desde $33.999/agenda/mes | IA avanzada, usuarios ilimitados | Orientado general, verificar plan dental |
| 8 | Odonto.ar | Odonto.ar (AR) | Argentina | odonto.ar | Odontólogos independientes/clínicas | Cloud | Agenda equipo | Turnos online (paciente elige horario) | (No evidenciado automatización WA) | HC, odontograma con auditoría de cambios | Panel finanzas, presupuestos, OS y coberturas | Importación Excel, MercadoPago | Multi-dispositivo | Cloud | $29/$49/$99 USD/mes | Todos los planes incluyen todas las funciones | Pricing en USD, sin WA automático, sin ARCA |
| 9 | AgendaPro | AgendaPro (CL) | Chile/LATAM | agendapro.com/ar/... | Clínicas dentales | Cloud | Agenda por odontólogo/sillón/sede | Turnos online 24/7 | IA "Alex" (WA/IG/Messenger), recordatorios WA, campañas | HC, odontograma, consentimiento firma electrónica | Honorarios, caja diaria, reportes | MercadoPago, directorio Google | App pacientes, migración 24h, soporte 24/7 | Certificación CENS, Ley 25.326/26.529 | Desde $13.900 ARS/mes | IA conversacional fuerte, directorio 2M pacientes | IA es complemento opcional (costo extra) |
| 10 | Dentalink | Dentalink (LATAM) | Latinoamérica | dentalink.com | Clínicas dentales | Cloud 100% | Agenda online | Turnos online + WhatsApp | Recordatorios WA/email, Contact Center IA | HC, odontograma, recetas | Facturación, reportes | WA, email | App, sin permanencia | Cloud | Planes Esencial/Pro/Titanium (sin precios públicos) | IA integrada (dictado, simulador sonrisa) | Precios no públicos |
| 11 | DenPro | Elite Digital Services (UE) | Multinacional (.ar) | denpro.ar | Consultorios | Cloud | Turnos, calendario | Turnos online / reserva online | Recordatorios SMS | HC, odontograma FDI | Facturación, exportaciones seguros, inventario (plan Team) | (No evidenciado) | App iOS/Android, migración gratuita | RGPD | $19.900/$29.900 ARS/mes | Prueba 30 días sin tarjeta, pricing transparente | Orientado genérico, pocos detalles clínicos |
| 12 | Medilink | Medilink (LATAM) | Latinoamérica | medilink.com.ar | Clínicas/consultorios médicos | Cloud | Agenda 360°, sobreagendamiento | Agendamiento online web/WA/IG | Recordatorios email/WA, Contact Center IA | Ficha clínica personalizable | Cobros, facturación ARCA, +80 reportes | ARCA, WA, email | Multi-sede, roles, inventario (planes superiores) | Cloud | No público (según terceros 1.5x promedio) | Facturación OS fuerte | Orientado medicina, precios altos |
| 13 | Adit | Adit (USA) | USA | adit.com | Prácticas dentales (USA) | Cloud | Online scheduling | Online scheduling | AI Front Desk, AI Call Intelligence, texting, reminders | No es PMS clínico (se integra) | Adit Pay, claims, verificaciones | VoIP, texting HIPAA, email, eFax, PMS (Dentrix, Open Dental) | App móvil | HIPAA | Quote-based, demo | IA telefonía avanzada, sin contratos | Mercado USA, no PMS clínico, precio no público |
| 14 | CareStack | CareStack (USA) | USA/UK/AU | carestack.com | Prácticas, DSOs multi-sede | Cloud | Multi-location scheduling | Online self-scheduling | AI teammates (confirmación, cobranzas, recall, tratamiento, cancelaciones), VoiceStack | Charting general/periodontal, notas templates, imaging, e-prescriptions | RCM completo, claims, pagos, membership plans | 150+ integraciones | App móvil, teledentistry | HIPAA, SOC2, ISO 27001, GDPR | Essentials $829/mes, Intelligence $1.299/mes (fuentes secundarias) | Certificaciones enterprise, IA por función | Mercado USA/UK/AU, precio alto |
| 15 | Dentrix | Henry Schein One (USA) | USA/Canadá | dentrix.com | Prácticas de todos los tamaños | Cloud (Ascend) o on-premise | Agenda | Online scheduling | Reminders, reputation management, patient communication | Charting, imaging con AI, auto-coding claims | Billing/insurance/collections, analytics | 150+ partners, API Exchange | IT management, backups, training | Cybersecurity | Quote-based | Líder histórico 30+ años, imaging AI | Mercado USA/CA, precio no público, on-premise legado |
| 16 | Cal.com | Cal.com | Global | cal.com | Scheduling para prácticas | Cloud | Booking online brandeable | Booking online embebible | Reminders email/SMS, Cal AI phone agent | No PMS clínico | Pagos (Stripe/PayPal), analytics | 100+ integraciones, API/webhooks | (No evidenciado operación clínica) | HIPAA + BAA (planes superiores) | Free / $16/usuario/mes | Free plan generoso, pricing transparente, API | No es PMS odontológico |
| 17 | Zoho Bookings | Zoho | Global | zoho.com/bookings/... | Scheduling | Cloud | Booking online | Self-scheduling | Reminders, confirmaciones, reprogramación | No PMS clínico | Pagos/depositos | Zoho ecosystem, APIs | Multi-provider/multi-location | HIPAA | 15 días gratis, planes no detallados | Scheduling-only, se integra con PMS | No reemplaza PMS clínico |
| 18 | TurnosWeb | TurnosWeb (AR) | Argentina | turnosweb.com | Negocios/profesionales | Cloud | Agenda centralizada | Reservas online desde link | Recordatorios email, lista de espera | No PMS clínico dental (genérico) | Caja, pagos a profesionales, estadísticas + IA | MercadoPago | Roles (recepción, admin), multi-sede | Cloud | Plan Pro prueba sin tarjeta, precios no públicos | Simplicidad, URL propia | Genérico, sin clínica dental |
| 19 | Guideflow | Guideflow (blog) | Global | guideflow.com/blog/... | Comparativa PMS | — | — | — | — | Panorama PMS internacionales | Pricing y ratings | — | — | — | Rango $0–$1.399/mes | Referencia de pricing USA | No es vendor dental |
| 20 | Reservo | Reservo (blog) | Chile | reservo.cl/blog/... | Guía software dental AR | — | — | — | — | Referencia | Referencia | — | — | — | No publicado | Referencia argentina | Contenido no extraído |
| 21 | Dentimax | Dentimax (USA) | USA | dentimax.com | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | (No evidenciado) | URL registrada como fallo de fetch | Fetch falló (403) |

---

## 5. Sección B — Matriz de puntuación (0-5)

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
| TurnosWeb | 3.0 | 1.5 | 3.0 | 2.5 | 3.0 | 2.5 | 3.5 | **2.68** |
| Cal.com | 3.5 | 1.0 | 3.0 | 3.0 | 3.5 | 3.5 | 4.5 | **2.98** |
| Zoho Bookings | 3.5 | 1.0 | 3.0 | 2.5 | 3.5 | 3.5 | 4.0 | **2.83** |

**Ranking (top):** DentalSoft/ClínIA (4.13) → Dentidad (4.10) → CareStack (4.05) → AgendaPro (3.95) → Bilog (3.83).

---

## 6. Sección C — Análisis competitivo

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

## 7. Sección D — Recomendación final

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

*Informe consolidado de Discovery — Turnos Odontología. Fuentes en discovery/sources/*.md (consulta 19/11/2026).*
