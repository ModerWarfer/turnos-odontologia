import type { AppointmentRepository } from './appointment-repository.js';
import { DomainError } from './errors.js';
import {
  ACTIVE_BLOCKING_STATUSES,
  type Appointment,
  type CreateAppointmentInput,
} from './types.js';

/**
 * Servicio de dominio para creación de turnos odontológicos (`C-06: appointments-no-overlap`).
 *
 * Implementa las reglas:
 * - `RN-AU-01` (`CA-6`): Aislamiento estricto por `clinic_id`
 * - `RN-AG-01` (`CA-2`): Prevención de solapamiento por profesional
 * - `RN-AG-02` (`CA-3`): Prevención de solapamiento por sillón/box
 * - `RN-AG-03` (`CA-4`): Validez de turnos estrictamente contiguos (`A.ends_at == B.starts_at`)
 * - `RN-AG-04` (`CA-1`): Duración variable calculada desde `service.durationMinutes`
 * - `RN-AG-05` (`CA-5`): Bloqueo solo en estados activos (`pending`, `confirmed`, `checked_in`);
 *                        liberación inmediata en `cancelled` y `no_show`
 * - `RN-AG-06`: Consistencia temporal (`starts_at < ends_at`) y recursos activos
 */
export class AppointmentService {
  private sequence = 1;

  constructor(private readonly repository: AppointmentRepository) {}

  public createAppointment(input: CreateAppointmentInput): Appointment {
    const clinic = this.repository.getClinicById(input.clinicId);
    if (!clinic || !clinic.active) {
      throw new DomainError(
        'RESOURCE_NOT_FOUND',
        `La clínica '${input.clinicId}' no existe o está inactiva.`,
      );
    }

    const professional = this.repository.getProfessionalById(input.professionalId);
    if (!professional) {
      throw new DomainError(
        'RESOURCE_NOT_FOUND',
        `El profesional '${input.professionalId}' no existe.`,
      );
    }

    const chair = this.repository.getChairById(input.chairId);
    if (!chair) {
      throw new DomainError(
        'RESOURCE_NOT_FOUND',
        `El sillón/box '${input.chairId}' no existe.`,
      );
    }

    const service = this.repository.getServiceById(input.serviceId);
    if (!service) {
      throw new DomainError(
        'RESOURCE_NOT_FOUND',
        `La prestación '${input.serviceId}' no existe.`,
      );
    }

    const patient = this.repository.getPatientById(input.patientId);
    if (!patient) {
      throw new DomainError(
        'RESOURCE_NOT_FOUND',
        `El paciente '${input.patientId}' no existe.`,
      );
    }

    // CA-6 / RN-AU-01: Todas las entidades deben pertenecer exactamente al mismo clinic_id
    if (
      professional.clinicId !== input.clinicId ||
      chair.clinicId !== input.clinicId ||
      service.clinicId !== input.clinicId ||
      patient.clinicId !== input.clinicId
    ) {
      throw new DomainError(
        'TENANT_MISMATCH',
        'Aislamiento multi-tenant violado: todas las entidades del turno deben pertenecer al mismo clinic_id.',
      );
    }

    // CA-1 / RN-AG-04: Duración variable estrictamente mayor a 0
    if (!Number.isInteger(service.durationMinutes) || service.durationMinutes <= 0) {
      throw new DomainError(
        'INVALID_SERVICE_DURATION',
        `La prestación '${service.id}' tiene una duración inválida (${service.durationMinutes} min).`,
      );
    }

    const startMs = Date.parse(input.startsAt);
    if (Number.isNaN(startMs)) {
      throw new DomainError(
        'INVALID_TIME_RANGE',
        `La fecha/hora de inicio '${input.startsAt}' no es un timestamp ISO-8601 válido.`,
      );
    }

    const endMs = startMs + service.durationMinutes * 60_000;
    const endsAt = formatWithSameOffset(input.startsAt, endMs);

    // Filtrar turnos de la clínica que estén en estado activo bloqueante (CA-5 / RN-AG-05)
    const activeAppointments = this.repository
      .listAppointmentsByClinic(input.clinicId)
      .filter((existing) => ACTIVE_BLOCKING_STATUSES.has(existing.status));

    for (const existing of activeAppointments) {
      const existingStartMs = Date.parse(existing.startsAt);
      const existingEndMs = Date.parse(existing.endsAt);

      // Condición de intersección de intervalos semiabiertos [starts_at, ends_at) (CA-4 / RN-AG-03):
      // Si nuevo.starts_at == existente.ends_at o nuevo.ends_at == existente.starts_at -> overlaps es false
      const overlaps = startMs < existingEndMs && endMs > existingStartMs;
      if (!overlaps) {
        continue;
      }

      // CA-2 / RN-AG-01: No solapamiento por profesional
      if (existing.professionalId === input.professionalId) {
        throw new DomainError(
          'PROFESSIONAL_OVERLAP',
          `Solapamiento detectado para el profesional '${input.professionalId}' con el turno activo '${existing.id}' [${existing.startsAt} - ${existing.endsAt}).`,
        );
      }

      // CA-3 / RN-AG-02: No solapamiento por sillón/box
      if (existing.chairId === input.chairId) {
        throw new DomainError(
          'CHAIR_OVERLAP',
          `Solapamiento detectado para el sillón/box '${input.chairId}' con el turno activo '${existing.id}' [${existing.startsAt} - ${existing.endsAt}).`,
        );
      }
    }

    const nowIso = new Date().toISOString();
    const appointment: Appointment = {
      id: `appt-${this.sequence++}`,
      clinicId: input.clinicId,
      patientId: input.patientId,
      professionalId: input.professionalId,
      chairId: input.chairId,
      serviceId: input.serviceId,
      startsAt: input.startsAt,
      endsAt,
      durationMinutes: service.durationMinutes,
      status: input.status ?? 'confirmed',
      source: input.source ?? 'internal',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    return this.repository.saveAppointment(appointment);
  }
}

/**
 * Formatea `targetEpochMs` preservando el sufijo de zona horaria explícito del string ISO original
 * (ej. `-03:00` para `America/Argentina/Buenos_Aires`, `RN-GL-01`).
 */
function formatWithSameOffset(referenceIso: string, targetEpochMs: number): string {
  const offsetMatch = referenceIso.match(/([+-]\d{2}:\d{2}|Z)$/);
  if (!offsetMatch || offsetMatch[1] === 'Z') {
    return new Date(targetEpochMs).toISOString();
  }

  const offsetStr = offsetMatch[1];
  const sign = offsetStr.startsWith('-') ? -1 : 1;
  const [hoursStr, minutesStr] = offsetStr.slice(1).split(':');
  const offsetMinutes = sign * (Number(hoursStr) * 60 + Number(minutesStr));

  const localDate = new Date(targetEpochMs + offsetMinutes * 60_000);
  const yyyy = localDate.getUTCFullYear();
  const mm = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(localDate.getUTCDate()).padStart(2, '0');
  const hh = String(localDate.getUTCHours()).padStart(2, '0');
  const min = String(localDate.getUTCMinutes()).padStart(2, '0');
  const ss = String(localDate.getUTCSeconds()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}T${hh}:${min}:${ss}${offsetStr}`;
}
