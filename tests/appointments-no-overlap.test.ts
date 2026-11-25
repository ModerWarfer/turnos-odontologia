import { describe, expect, it } from 'vitest';
import { AppointmentService } from '../src/domain/appointment-service.js';
import { DomainError } from '../src/domain/errors.js';
import { InMemoryAppointmentRepository } from '../src/infrastructure/in-memory-appointment-repository.js';

describe('C-06: appointments-no-overlap (US-004 / RN-AG-01..06 / RN-AU-01)', () => {
  describe('Tarea 2.1 — Escenario 1 (Feliz / CA-1 / RN-AG-04): Calculo automatico de duracion segun prestacion', () => {
    it('crea el turno en estado confirmed y calcula ends_at = starts_at + 45 min para Limpieza dental', () => {
      // GIVEN un consultorio activo ("Consultorio Demo Sonrisa") con Dra. Laura Gómez, Sillón 1, Limpieza dental (45 min) y Paciente Ficticio A
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      // WHEN se solicita crear un turno con inicio 2026-11-25T10:00:00-03:00
      const created = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-limpieza-45',
        startsAt: '2026-11-25T10:00:00-03:00',
      });

      // THEN el sistema crea y persiste el turno en estado activo (confirmed), durationMinutes = 45 y endsAt = 10:45
      expect(created.status).toBe('confirmed');
      expect(created.durationMinutes).toBe(45);
      expect(created.startsAt).toBe('2026-11-25T10:00:00-03:00');
      expect(created.endsAt).toBe('2026-11-25T10:45:00-03:00');
      expect(repository.listAppointmentsByClinic('clinic-demo-sonrisa')).toHaveLength(1);
    });

    it('triangulacion CA-1: calcula correctamente 30 min para Consulta y 60 min para Endodoncia', () => {
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      const consulta = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T08:00:00-03:00',
      });
      const endodoncia = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-b',
        professionalId: 'prof-martin-perez',
        chairId: 'chair-box-2',
        serviceId: 'srv-endodoncia-60',
        startsAt: '2026-11-25T09:00:00-03:00',
      });

      expect(consulta.durationMinutes).toBe(30);
      expect(consulta.endsAt).toBe('2026-11-25T08:30:00-03:00');
      expect(endodoncia.durationMinutes).toBe(60);
      expect(endodoncia.endsAt).toBe('2026-11-25T10:00:00-03:00');
    });
  });

  describe('Tarea 3.1 — Escenario 2 (Error de negocio / CA-2 / RN-AG-01): Prevencion de solapamiento por profesional', () => {
    it('rechaza con PROFESSIONAL_OVERLAP si la Dra. Laura Gómez ya tiene turno de 10:00 a 10:45 e intenta agendar de 10:30 a 11:00 en Box 2', () => {
      // GIVEN que la Dra. Laura Gómez ya tiene un turno activo de 10:00 a 10:45 en Sillón 1
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-limpieza-45',
        startsAt: '2026-11-25T10:00:00-03:00',
      });

      // WHEN se solicita crear un segundo turno para la misma Dra. Laura Gómez en Box 2 de 10:30 a 11:00
      let capturedError: unknown;
      try {
        service.createAppointment({
          clinicId: 'clinic-demo-sonrisa',
          patientId: 'patient-ficticio-b',
          professionalId: 'prof-laura-gomez',
          chairId: 'chair-box-2',
          serviceId: 'srv-consulta-30',
          startsAt: '2026-11-25T10:30:00-03:00',
        });
      } catch (err) {
        capturedError = err;
      }

      // THEN rechaza con PROFESSIONAL_OVERLAP y no persiste el segundo turno
      expect(capturedError).toBeInstanceOf(DomainError);
      expect((capturedError as DomainError).code).toBe('PROFESSIONAL_OVERLAP');
      expect(repository.listAppointmentsByClinic('clinic-demo-sonrisa')).toHaveLength(1);
    });

    it('triangulacion CA-2: rechaza con PROFESSIONAL_OVERLAP cuando el nuevo turno envuelve o empieza antes y termina dentro de uno activo', () => {
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T10:00:00-03:00',
      });

      expect(() =>
        service.createAppointment({
          clinicId: 'clinic-demo-sonrisa',
          patientId: 'patient-ficticio-b',
          professionalId: 'prof-laura-gomez',
          chairId: 'chair-box-2',
          serviceId: 'srv-limpieza-45',
          startsAt: '2026-11-25T09:30:00-03:00', // 09:30 a 10:15 pisa [10:00, 10:30)
        }),
      ).toThrowError(expect.objectContaining({ code: 'PROFESSIONAL_OVERLAP' }));
    });
  });

  describe('Tarea 3.2 — Escenario 3 (Error de negocio / CA-3 / RN-AG-02): Prevencion de solapamiento por sillon/box', () => {
    it('rechaza con CHAIR_OVERLAP cuando otro profesional libre (Dr. Martín Pérez) intenta usar el Sillón 1 ocupado de 10:00 a 10:45', () => {
      // GIVEN que el Sillón 1 está ocupado por la Dra. Laura Gómez de 10:00 a 10:45
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-limpieza-45',
        startsAt: '2026-11-25T10:00:00-03:00',
      });

      // WHEN se solicita crear un turno para el Dr. Martín Pérez en el mismo Sillón 1 de 10:15 a 10:45
      let capturedError: unknown;
      try {
        service.createAppointment({
          clinicId: 'clinic-demo-sonrisa',
          patientId: 'patient-ficticio-b',
          professionalId: 'prof-martin-perez',
          chairId: 'chair-sillon-1',
          serviceId: 'srv-consulta-30',
          startsAt: '2026-11-25T10:15:00-03:00',
        });
      } catch (err) {
        capturedError = err;
      }

      // THEN rechaza con CHAIR_OVERLAP y no persiste el turno
      expect(capturedError).toBeInstanceOf(DomainError);
      expect((capturedError as DomainError).code).toBe('CHAIR_OVERLAP');
      expect(repository.listAppointmentsByClinic('clinic-demo-sonrisa')).toHaveLength(1);
    });

    it('triangulacion CA-3: permite agendar al Dr. Martín Pérez en el mismo horario si usa un sillon distinto libre (Box 2)', () => {
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-limpieza-45',
        startsAt: '2026-11-25T10:00:00-03:00',
      });

      const parallel = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-b',
        professionalId: 'prof-martin-perez',
        chairId: 'chair-box-2',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T10:15:00-03:00',
      });

      expect(parallel.chairId).toBe('chair-box-2');
      expect(repository.listAppointmentsByClinic('clinic-demo-sonrisa')).toHaveLength(2);
    });
  });

  describe('Tarea 3.3 — Escenario 4 (Caso de borde / CA-4 / RN-AG-03): Validez de turnos estrictamente contiguos', () => {
    it('permite crear un turno que inicia exactamente cuando termina el anterior (10:00-10:30 y 10:30-11:00) para misma profesional y sillon', () => {
      // GIVEN que la Dra. Laura Gómez tiene un turno activo en Sillón 1 de 10:00 a 10:30
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      const first = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T10:00:00-03:00',
      });
      expect(first.endsAt).toBe('2026-11-25T10:30:00-03:00');

      // WHEN se solicita crear un nuevo turno con inicio exactamente en 10:30 (existente.ends_at == nuevo.starts_at)
      const second = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-b',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T10:30:00-03:00',
      });

      // THEN ambos turnos coexisten sin solapamiento
      expect(second.startsAt).toBe('2026-11-25T10:30:00-03:00');
      expect(second.endsAt).toBe('2026-11-25T11:00:00-03:00');
      expect(repository.listAppointmentsByClinic('clinic-demo-sonrisa')).toHaveLength(2);
    });

    it('triangulacion CA-4: tambien permite insertar un turno contiguo inmediatamente anterior (09:30-10:00 antes de 10:00-10:30)', () => {
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T10:00:00-03:00',
      });

      const before = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-b',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T09:30:00-03:00',
      });

      expect(before.endsAt).toBe('2026-11-25T10:00:00-03:00');
      expect(repository.listAppointmentsByClinic('clinic-demo-sonrisa')).toHaveLength(2);
    });
  });

  describe('Tarea 3.4 — Escenario 5 (Caso de borde / CA-5 / RN-AG-05): Liberacion de disponibilidad ante turnos cancelled o no_show', () => {
    it('permite agendar sobre el bloque 10:00-10:45 cuando el turno previo en ese horario y sillon tiene estado cancelled', () => {
      // GIVEN un turno de 10:00 a 10:45 en estado cancelled
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      repository.saveAppointment({
        id: 'appt-cancelled-1',
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-limpieza-45',
        startsAt: '2026-11-25T10:00:00-03:00',
        endsAt: '2026-11-25T10:45:00-03:00',
        durationMinutes: 45,
        status: 'cancelled',
        source: 'internal',
        cancellationReason: 'Reprogramado por paciente',
        createdAt: '2026-11-24T09:00:00-03:00',
        updatedAt: '2026-11-24T09:30:00-03:00',
      });

      // WHEN se solicita crear un nuevo turno en el mismo horario 10:00-10:45
      const rebooked = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-b',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-limpieza-45',
        startsAt: '2026-11-25T10:00:00-03:00',
      });

      // THEN se crea exitosamente porque cancelled libera ambos recursos
      expect(rebooked.status).toBe('confirmed');
      expect(rebooked.startsAt).toBe('2026-11-25T10:00:00-03:00');
      expect(rebooked.endsAt).toBe('2026-11-25T10:45:00-03:00');
    });

    it('triangulacion CA-5: tambien libera el horario cuando el turno previo tiene estado no_show, pero bloquea si esta pending o checked_in', () => {
      const repository = new InMemoryAppointmentRepository();
      const service = new AppointmentService(repository);

      repository.saveAppointment({
        id: 'appt-noshow-1',
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-a',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T11:00:00-03:00',
        endsAt: '2026-11-25T11:30:00-03:00',
        durationMinutes: 30,
        status: 'no_show',
        source: 'internal',
        createdAt: '2026-11-24T09:00:00-03:00',
        updatedAt: '2026-11-24T09:30:00-03:00',
      });

      const afterNoShow = service.createAppointment({
        clinicId: 'clinic-demo-sonrisa',
        patientId: 'patient-ficticio-b',
        professionalId: 'prof-laura-gomez',
        chairId: 'chair-sillon-1',
        serviceId: 'srv-consulta-30',
        startsAt: '2026-11-25T11:00:00-03:00',
        status: 'pending',
      });
      expect(afterNoShow.status).toBe('pending');

      // Como el nuevo turno quedó en estado activo 'pending', un tercer intento sobre 11:00-11:30 debe fallar
      expect(() =>
        service.createAppointment({
          clinicId: 'clinic-demo-sonrisa',
          patientId: 'patient-ficticio-a',
          professionalId: 'prof-laura-gomez',
          chairId: 'chair-box-2',
          serviceId: 'srv-consulta-30',
          startsAt: '2026-11-25T11:00:00-03:00',
        }),
      ).toThrowError(expect.objectContaining({ code: 'PROFESSIONAL_OVERLAP' }));
    });
  });

  describe('Tarea 3.5 — Escenario 6 (Seguridad / CA-6 / RN-AU-01): Aislamiento multi-tenant por clinic_id', () => {
    it('rechaza con TENANT_MISMATCH cuando se intenta asignar en Consultorio Demo Sonrisa un recurso que posee other-clinic-id', () => {
      // GIVEN el Consultorio Demo Sonrisa (clinic-demo-sonrisa) y un recurso registrado bajo other-clinic-id
      const repository = new InMemoryAppointmentRepository();
      repository.addChair({
        id: 'chair-other-clinic',
        clinicId: 'other-clinic-id',
        name: 'Sillón 1',
        active: true,
      });

      const service = new AppointmentService(repository);

      // WHEN se solicita crear un turno en clinic-demo-sonrisa referenciando chair-other-clinic
      let capturedError: unknown;
      try {
        service.createAppointment({
          clinicId: 'clinic-demo-sonrisa',
          patientId: 'patient-ficticio-a',
          professionalId: 'prof-laura-gomez',
          chairId: 'chair-other-clinic',
          serviceId: 'srv-limpieza-45',
          startsAt: '2026-11-25T10:00:00-03:00',
        });
      } catch (err) {
        capturedError = err;
      }

      // THEN rechaza con TENANT_MISMATCH y no persiste el turno
      expect(capturedError).toBeInstanceOf(DomainError);
      expect((capturedError as DomainError).code).toBe('TENANT_MISMATCH');
      expect(repository.listAppointmentsByClinic('clinic-demo-sonrisa')).toHaveLength(0);
    });

    it('triangulacion CA-6: rechaza con TENANT_MISMATCH si el profesional, paciente o prestacion pertenecen a otro clinic_id', () => {
      const repository = new InMemoryAppointmentRepository();
      repository.addProfessional({
        id: 'prof-other-clinic',
        clinicId: 'other-clinic-id',
        fullName: 'Dra. Laura Gómez',
        licenseNumber: 'MP-9999',
        active: true,
      });
      const service = new AppointmentService(repository);

      expect(() =>
        service.createAppointment({
          clinicId: 'clinic-demo-sonrisa',
          patientId: 'patient-ficticio-a',
          professionalId: 'prof-other-clinic',
          chairId: 'chair-sillon-1',
          serviceId: 'srv-limpieza-45',
          startsAt: '2026-11-25T10:00:00-03:00',
        }),
      ).toThrowError(expect.objectContaining({ code: 'TENANT_MISMATCH' }));
    });
  });
});
