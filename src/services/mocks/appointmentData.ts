export type AppointmentStatus = 'booked' | 'cancelled' | 'checked_in';

export interface Appointment {
  id: string;
  slotNumber: number;
  patientName: string;
  phoneNumber: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  status: AppointmentStatus;
  hospitalId: string;
}

// Mock data for today's appointments (2026-01-14 since today is 2026-01-13)
export const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    slotNumber: 1,
    patientName: 'Rahul Sharma',
    phoneNumber: '9876543210',
    startTime: '2026-01-14T09:00:00',
    endTime: '2026-01-14T09:30:00',
    status: 'booked',
    hospitalId: '1',
  },
  {
    id: 'APT002',
    slotNumber: 2,
    patientName: 'Priya Patel',
    phoneNumber: '9876543211',
    startTime: '2026-01-14T09:30:00',
    endTime: '2026-01-14T10:00:00',
    status: 'booked',
    hospitalId: '1',
  },
  {
    id: 'APT003',
    slotNumber: 3,
    patientName: 'Amit Kumar',
    phoneNumber: '9876543212',
    startTime: '2026-01-14T10:00:00',
    endTime: '2026-01-14T10:30:00',
    status: 'checked_in',
    hospitalId: '1',
  },
  {
    id: 'APT004',
    slotNumber: 4,
    patientName: 'Sunita Devi',
    phoneNumber: '9876543213',
    startTime: '2026-01-14T10:30:00',
    endTime: '2026-01-14T11:00:00',
    status: 'cancelled',
    hospitalId: '1',
  },
  {
    id: 'APT005',
    slotNumber: 5,
    patientName: 'Vikram Singh',
    phoneNumber: '9876543214',
    startTime: '2026-01-14T11:00:00',
    endTime: '2026-01-14T11:30:00',
    status: 'booked',
    hospitalId: '1',
  },
  {
    id: 'APT006',
    slotNumber: 6,
    patientName: 'Meera Joshi',
    phoneNumber: '9876543215',
    startTime: '2026-01-14T11:30:00',
    endTime: '2026-01-14T12:00:00',
    status: 'booked',
    hospitalId: '1',
  },
  {
    id: 'APT007',
    slotNumber: 7,
    patientName: 'Ravi Verma',
    phoneNumber: '9876543216',
    startTime: '2026-01-14T14:00:00',
    endTime: '2026-01-14T14:30:00',
    status: 'booked',
    hospitalId: '1',
  },
  {
    id: 'APT008',
    slotNumber: 8,
    patientName: 'Anita Gupta',
    phoneNumber: '9876543217',
    startTime: '2026-01-14T14:30:00',
    endTime: '2026-01-14T15:00:00',
    status: 'booked',
    hospitalId: '1',
  },
];
