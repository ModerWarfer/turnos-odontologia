import type {
  Appointment,
  Chair,
  Clinic,
  Patient,
  Professional,
  Service,
} from './types.js';

export interface AppointmentRepository {
  getClinicById(id: string): Clinic | undefined;
  getProfessionalById(id: string): Professional | undefined;
  getChairById(id: string): Chair | undefined;
  getServiceById(id: string): Service | undefined;
  getPatientById(id: string): Patient | undefined;
  listAppointmentsByClinic(clinicId: string): Appointment[];
  saveAppointment(appointment: Appointment): Appointment;
}
