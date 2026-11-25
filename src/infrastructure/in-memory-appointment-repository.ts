import type { AppointmentRepository } from '../domain/appointment-repository.js';
import type {
  Appointment,
  Chair,
  Clinic,
  Patient,
  Professional,
  Service,
} from '../domain/types.js';

/**
 * Adaptador transaccional en memoria con el Seed 100% ficticio definido en
 * `knowledge-base/04_modelo_de_datos.md` (cumplimiento estricto Ley 25.326).
 */
export class InMemoryAppointmentRepository implements AppointmentRepository {
  private readonly clinics = new Map<string, Clinic>();
  private readonly professionals = new Map<string, Professional>();
  private readonly chairs = new Map<string, Chair>();
  private readonly services = new Map<string, Service>();
  private readonly patients = new Map<string, Patient>();
  private readonly appointments = new Map<string, Appointment>();

  constructor(withDemoSeed = true) {
    if (withDemoSeed) {
      this.seedDemoData();
    }
  }

  private seedDemoData(): void {
    this.addClinic({
      id: 'clinic-demo-sonrisa',
      name: 'Consultorio Demo Sonrisa',
      slug: 'demo-sonrisa',
      timezone: 'America/Argentina/Buenos_Aires',
      bookingEnabled: true,
      active: true,
    });

    this.addChair({
      id: 'chair-sillon-1',
      clinicId: 'clinic-demo-sonrisa',
      name: 'Sillón 1',
      description: 'Planta Baja',
      active: true,
    });

    this.addChair({
      id: 'chair-box-2',
      clinicId: 'clinic-demo-sonrisa',
      name: 'Box 2',
      description: 'Planta Baja',
      active: true,
    });

    this.addProfessional({
      id: 'prof-laura-gomez',
      clinicId: 'clinic-demo-sonrisa',
      fullName: 'Dra. Laura Gómez',
      specialty: 'Odontología General',
      licenseNumber: 'MP-0001',
      defaultChairId: 'chair-sillon-1',
      active: true,
    });

    this.addProfessional({
      id: 'prof-martin-perez',
      clinicId: 'clinic-demo-sonrisa',
      fullName: 'Dr. Martín Pérez',
      specialty: 'Ortodoncia / Endodoncia',
      licenseNumber: 'MP-0002',
      defaultChairId: 'chair-box-2',
      active: true,
    });

    this.addService({
      id: 'srv-consulta-30',
      clinicId: 'clinic-demo-sonrisa',
      name: 'Consulta y diagnóstico',
      durationMinutes: 30,
      allowOnlineBooking: true,
      active: true,
    });

    this.addService({
      id: 'srv-limpieza-45',
      clinicId: 'clinic-demo-sonrisa',
      name: 'Limpieza dental (profilaxis)',
      durationMinutes: 45,
      allowOnlineBooking: true,
      active: true,
    });

    this.addService({
      id: 'srv-endodoncia-60',
      clinicId: 'clinic-demo-sonrisa',
      name: 'Endodoncia (tratamiento de conducto)',
      durationMinutes: 60,
      allowOnlineBooking: false,
      active: true,
    });

    this.addPatient({
      id: 'patient-ficticio-a',
      clinicId: 'clinic-demo-sonrisa',
      fullName: 'Paciente Ficticio A',
      phoneWhatsapp: '+5491100000001',
      active: true,
    });

    this.addPatient({
      id: 'patient-ficticio-b',
      clinicId: 'clinic-demo-sonrisa',
      fullName: 'Paciente Ficticio B',
      phoneWhatsapp: '+5491100000002',
      active: true,
    });
  }

  public addClinic(clinic: Clinic): void {
    this.clinics.set(clinic.id, { ...clinic });
  }

  public addProfessional(professional: Professional): void {
    this.professionals.set(professional.id, { ...professional });
  }

  public addChair(chair: Chair): void {
    this.chairs.set(chair.id, { ...chair });
  }

  public addService(service: Service): void {
    this.services.set(service.id, { ...service });
  }

  public addPatient(patient: Patient): void {
    this.patients.set(patient.id, { ...patient });
  }

  public getClinicById(id: string): Clinic | undefined {
    return this.clinics.get(id);
  }

  public getProfessionalById(id: string): Professional | undefined {
    return this.professionals.get(id);
  }

  public getChairById(id: string): Chair | undefined {
    return this.chairs.get(id);
  }

  public getServiceById(id: string): Service | undefined {
    return this.services.get(id);
  }

  public getPatientById(id: string): Patient | undefined {
    return this.patients.get(id);
  }

  public listAppointmentsByClinic(clinicId: string): Appointment[] {
    return Array.from(this.appointments.values()).filter(
      (appt) => appt.clinicId === clinicId,
    );
  }

  public saveAppointment(appointment: Appointment): Appointment {
    const stored = { ...appointment };
    this.appointments.set(stored.id, stored);
    return stored;
  }
}
