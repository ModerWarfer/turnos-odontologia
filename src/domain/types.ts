export type AppointmentStatus =
  | 'pending'
  | 'confirmed'
  | 'checked_in'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type AppointmentSource = 'internal' | 'online_24_7';

export const ACTIVE_BLOCKING_STATUSES: ReadonlySet<AppointmentStatus> = new Set([
  'pending',
  'confirmed',
  'checked_in',
]);

export interface Clinic {
  id: string;
  name: string;
  slug: string;
  timezone: string;
  bookingEnabled: boolean;
  active: boolean;
}

export interface Professional {
  id: string;
  clinicId: string;
  fullName: string;
  specialty?: string;
  licenseNumber: string;
  defaultChairId?: string;
  active: boolean;
}

export interface Chair {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface Service {
  id: string;
  clinicId: string;
  name: string;
  durationMinutes: number;
  allowOnlineBooking: boolean;
  active: boolean;
}

export interface Patient {
  id: string;
  clinicId: string;
  fullName: string;
  dni?: string;
  phoneWhatsapp?: string;
  email?: string;
  active: boolean;
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  professionalId: string;
  chairId: string;
  serviceId: string;
  startsAt: string;
  endsAt: string;
  durationMinutes: number;
  status: AppointmentStatus;
  source: AppointmentSource;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentInput {
  clinicId: string;
  patientId: string;
  professionalId: string;
  chairId: string;
  serviceId: string;
  startsAt: string;
  status?: 'pending' | 'confirmed' | 'checked_in';
  source?: AppointmentSource;
}
