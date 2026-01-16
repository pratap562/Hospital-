import axios from 'axios';
import { mockHospitals, type Hospital } from './mocks/hospitalData';
import { mockSlots, type Slot } from './mocks/slotData';
import { mockMedicines } from './mocks/medicineData';
import { v4 as uuidv4 } from 'uuid';

// Check if API URL is defined
const API_URL = import.meta.env.VITE_API_URL || 'https://hospital-sagar-backend.onrender.com/';
const USE_MOCK = !API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Mock delay helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- Hospital Services ---

export const getHospitals = async (page: number = 1, limit: number = 10): Promise<{ data: Hospital[], total: number }> => {
  if (USE_MOCK) {
    await delay(500);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: mockHospitals.slice(start, end),
      total: mockHospitals.length,
    };
  }
  const response = await api.get(`/hospitals?page=${page}&limit=${limit}`);
  // Map _id to id for frontend consistency
  const hospitals = response.data.data.data || [];
  return {
    data: hospitals.map((h: any) => ({ ...h, id: h._id })),
    total: response.data.data.pagination?.total || hospitals.length
  };
};

export const createHospital = async (hospital: Omit<Hospital, 'id'>): Promise<Hospital> => {
  if (USE_MOCK) {
    await delay(500);
    const newHospital = { ...hospital, id: uuidv4() };
    mockHospitals.unshift(newHospital);
    return newHospital;
  }
  const response = await api.post('/hospitals', hospital);
  const data = response.data.data;
  return { ...data, id: data._id };
};

export const updateHospital = async (id: string, updates: Partial<Hospital>): Promise<Hospital> => {
  if (USE_MOCK) {
    await delay(500);
    const index = mockHospitals.findIndex((h) => h.id === id);
    if (index === -1) throw new Error('Hospital not found');
    mockHospitals[index] = { ...mockHospitals[index], ...updates };
    return mockHospitals[index];
  }
  const response = await api.put(`/hospitals/${id}`, updates);
  const data = response.data.data;
  return { ...data, id: data._id };
};

// --- Slot Services ---

export const getSlots = async (hospitalId: string, page: number = 1, limit: number = 100): Promise<Slot[]> => {
  if (USE_MOCK) {
    await delay(500);
    return mockSlots.filter((s) => s.hospitalId === hospitalId);
  }
  const response = await api.get(`/slots/hospital/${hospitalId}?page=${page}&limit=${limit}`);
  const slots = response.data.data || [];
  return slots.map((s: any) => ({
    ...s,
    id: s._id || s.id,
    currentBookings: s.bookedCount || 0
  }));
};

export const createSlots = async (
  hospitalId: string, 
  slotDuration: number, 
  maxCapacity: number, 
  startDate: Date,
  endDate: Date,
  startTimeStr: string,
  endTimeStr: string
): Promise<any> => {
  if (USE_MOCK) {
    await delay(800);
    
    const slotsCreated: Slot[] = [];
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);
    
    // Calculate total days
    const numberOfDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Generate slots for each day
    for (let d = 0; d < numberOfDays; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + d);
      
      let currentHour = startH;
      let currentMinute = startM;
      let slotNum = 1;
      
      while (currentHour < endH || (currentHour === endH && currentMinute < endM)) {
        const startTime = new Date(date);
        startTime.setHours(currentHour, currentMinute, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + slotDuration);
        
        if (endTime.getHours() > endH || (endTime.getHours() === endH && endTime.getMinutes() > endM)) {
          break;
        }

        const newSlot: Slot = {
          id: uuidv4(),
          hospitalId,
          slotNumber: slotNum++,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          maxCapacity,
          bookedCount: 0,
          isBooked: false
        };

        slotsCreated.push(newSlot);
        mockSlots.push(newSlot);

        // Move to next slot
        currentMinute += slotDuration;
        while (currentMinute >= 60) {
          currentMinute -= 60;
          currentHour += 1;
        }
      }
    }

    return { 
      success: true, 
      data: {
        slotsCreated: slotsCreated.length,
        days: numberOfDays,
        slotsPerDay: slotsCreated.length / numberOfDays
      }
    };
  }
  const response = await api.post('/slots', { 
    hospitalId, 
    slotDuration, 
    maxCapacity, 
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    startTime: startTimeStr,
    endTime: endTimeStr
  });
  return response.data;
};

export const deleteSlot = async (slotId: string): Promise<void> => {
  if (USE_MOCK) {
    await delay(500);
    const index = mockSlots.findIndex((s) => s.id === slotId);
    if (index === -1) throw new Error('Slot not found');
    if (mockSlots[index].bookedCount > 0) {
      throw new Error('Cannot delete slot with existing bookings');
    }
    mockSlots.splice(index, 1);
    return;
  }
  await api.delete(`/slots/${slotId}`);
};

export const deleteSlotsByDate = async (hospitalId: string, date: string): Promise<void> => {
  if (USE_MOCK) {
    await delay(500);
    for (let i = mockSlots.length - 1; i >= 0; i--) {
      const slot = mockSlots[i];
      if (slot.hospitalId === hospitalId && slot.startTime.startsWith(date)) {
        if (slot.bookedCount > 0) continue;
        mockSlots.splice(i, 1);
      }
    }
    return;
  }
  await api.delete(`/slots/hospital/${hospitalId}?date=${date}`);
};

// --- Public Booking APIs (for patient booking app) ---

export interface PublicSlot {
  id: string;
  hospitalId: string;
  startTime: string;
  endTime: string;
  slotDate: string;
  slotNumber: number;
  maxCapacity: number;
  bookedCount: number;
  activeLocksCount: number;
  availableCount: number;
  isFull: boolean;
}

export interface SlotLockResult {
  lockId: string;
  bookingAttemptId: string;
  expiresAt: string;
  slot: {
    id: string;
    startTime: string;
    endTime: string;
    slotNumber: number;
  };
}

export interface ConfirmBookingData {
  lockId: string;
  name: string;
  email: string;
  phoneNo: string;
  healthIssue: string;
  doctorId: string;
  doctorName: string;
}

export interface BookingConfirmationResult {
  success: boolean;
  appointmentId: string;
  appointment: {
    id: string;
    appointmentId: string;
    slotNumber: number;
    slotStartTime: string;
    slotEndTime: string;
    hospitalId: string;
  };
}

/**
 * Get available slots for a hospital (public endpoint with real-time availability)
 */
export const getPublicSlots = async (hospitalId: string, date?: string): Promise<PublicSlot[]> => {
  if (USE_MOCK) {
    await delay(500);
    const filtered = mockSlots.filter((s) => s.hospitalId === hospitalId);
    return filtered.map((s) => ({
      ...s,
      activeLocksCount: 0,
      availableCount: s.maxCapacity - s.bookedCount,
      isFull: s.bookedCount >= s.maxCapacity,
      slotDate: s.startTime.split('T')[0],
    }));
  }
  const params = date ? `?date=${date}` : '';
  const response = await api.get(`/public/booking/slots/${hospitalId}${params}`);
  return response.data.data;
};

/**
 * Lock a slot when proceeding to payment
 */
export const lockSlot = async (slotId: string): Promise<SlotLockResult> => {
  if (USE_MOCK) {
    await delay(500);
    const slot = mockSlots.find((s) => s.id === slotId);
    if (!slot) throw new Error('Slot not found');
    if (slot.bookedCount >= slot.maxCapacity) {
      throw new Error('Slot is no longer available. Please select another slot.');
    }
    return {
      lockId: uuidv4(),
      bookingAttemptId: uuidv4(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      slot: {
        id: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        slotNumber: slot.slotNumber || 1,
      },
    };
  }
  const response = await api.post('/public/booking/slots/lock', { slotId });
  return response.data.data;
};

/**
 * Release a slot lock (when user cancels payment)
 */
export const releaseSlotLock = async (lockId: string): Promise<void> => {
  if (USE_MOCK) {
    await delay(300);
    return;
  }
  await api.delete(`/public/booking/slots/lock/${lockId}`);
};

/**
 * Confirm booking after successful payment
 */
export const confirmBooking = async (data: ConfirmBookingData): Promise<BookingConfirmationResult> => {
  if (USE_MOCK) {
    await delay(800);
    const appointmentId = `APT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    return {
      success: true,
      appointmentId,
      appointment: {
        id: uuidv4(),
        appointmentId,
        slotNumber: 1,
        slotStartTime: new Date().toISOString(),
        slotEndTime: new Date().toISOString(),
        hospitalId: 'mock-hospital',
      },
    };
  }
  const response = await api.post('/public/booking/confirm', data);
  return response.data.data;
};

// User Management APIs
import { mockUsers, type User } from './mocks/userData';

export const getUsers = async (): Promise<User[]> => {
  if (USE_MOCK) {
    await delay(800);
    return [...mockUsers];
  }
  const response = await api.get('/users');
  // Backend returns { success: true, data: { data: User[], pagination: {...} } }
  // Mapping _id to id if necessary
  const users = response.data.data.data || [];
  return users.map((u: any) => ({
    ...u,
    id: u._id || u.id,
  }));
};

export const createUser = async (userData: Omit<User, 'id'> & { password?: string }): Promise<User> => {
  if (USE_MOCK) {
    await delay(1000);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...userData,
    };
    mockUsers.push(newUser);
    return newUser;
  }
  
  // Map frontend data to backend CreateUserData
  const backendData = {
    fullName: userData.fullName,
    email: userData.email,
    password: userData.password,
    userRoles: userData.userRoles,
    departments: userData.departments,
    specializations: userData.specializations,
    consultationFee: userData.consultationFee,
    extraLine: userData.extraLine,
  };

    console.log('starting>>>>>>>>>>>>>>>>>')


  const response = await api.post('/users', backendData);
  const user = response.data.data;
  console.log(user,'ussser>>>>>>>>>>>>>>>>>')
  return { ...user, id: user._id || user.id };
};

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  if (USE_MOCK) {
    await delay(800);
    const index = mockUsers.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    mockUsers[index] = { ...mockUsers[index], ...userData };
    return mockUsers[index];
  }

  // Map frontend data to backend UpdateUserData
  const backendData = {
    fullName: userData.fullName,
    email: userData.email,
    userRoles: userData.userRoles,
    departments: userData.departments,
    specializations: userData.specializations,
    consultationFee: userData.consultationFee,
    extraLine: userData.extraLine,
  };

  const response = await api.put(`/users/${id}`, backendData);
  const user = response.data.data;
  return { ...user, id: user._id || user.id };
};

export const changePassword = async (id: string, newPassword: string): Promise<void> => {
  if (USE_MOCK) {
    await delay(1000);
    console.log(`Password changed for user ${id} to ${newPassword}`);
    return;
  }
  await api.post(`/users/${id}/change-password`, { newPassword });
};

// --- Auth APIs ---
export const login = async (email: string, password: string): Promise<any> => {
  if (USE_MOCK) {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid email or password');
    return {
      user: {
        name: user.fullName,
        email: user.email,
        roles: user.userRoles
      }
    };
  }
  const response = await api.post('/users/login', { email, password });
  return response.data.data;
};

export const logout = async (): Promise<void> => {
  if (USE_MOCK) {
    await delay(500);
    return;
  }
  await api.post('/users/logout');
};

export const getCurrentUser = async (): Promise<any> => {
  if (USE_MOCK) {
    await delay(500);
    // Return first mock user as default in mock mode
    const user = mockUsers[0];
    return {
      user: {
        name: user.fullName,
        email: user.email,
        roles: user.userRoles
      }
    };
  }
  const response = await api.get('/users/me');
  return response.data.data;
};

// --- Appointment APIs ---
import { mockAppointments, type Appointment } from './mocks/appointmentData';
import { mockPatients, type Patient } from './mocks/patientData';

export interface ConfirmBookingData {
  lockId: string;
  name: string;
  email: string;
  phoneNo: string;
  healthIssue: string;
  doctorId: string;
  doctorName: string;
  duration?: number;
  amount?: number;
}

export const getTodaysAppointments = async (hospitalId: string, page: number = 1, limit: number = 10, mode: string = 'offline'): Promise<{ data: Appointment[], total: number }> => {
  if (USE_MOCK) {
    await delay(500);
    // Sort by startTime
    const sorted = [...mockAppointments]
      .filter(a => a.hospitalId === hospitalId && (!mode || a.mode === mode)) // Filter by mode if provided
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: sorted.slice(start, end),
      total: sorted.length,
    };
  }
  const response = await api.get(`/appointments/today`, { params: { hospitalId, page, limit, mode } });
  // Map backend response to frontend Appointment structure
  const { data, pagination } = response.data;
  return {
    data: data.map((apt: any) => ({
      ...apt,
      id: apt.appointmentId, // Map backend appointmentId to frontend id
      patientName: apt.name, // Map backend name to patientName
      phoneNumber: apt.phoneNo, // Map backend phoneNo to phoneNumber
      startTime: apt.slotStartTime,
      endTime: apt.slotEndTime,
    })),
    total: pagination.total,
  };
};

export const filterAppointmentById = async (appointmentId: string): Promise<Appointment | null> => {
  if (USE_MOCK) {
    await delay(300);
    return mockAppointments.find(a => a.id === appointmentId) || null;
  }
  const response = await api.get(`/appointments/${appointmentId}`);
  const apt = response.data.data;
  if (!apt) return null;
  return {
    ...apt,
    id: apt.appointmentId,
    patientName: apt.name,
    phoneNumber: apt.phoneNo,
    startTime: apt.slotStartTime,
    endTime: apt.slotEndTime,
  };
};

export const checkInAppointment = async (appointmentId: string): Promise<Appointment> => {
  if (USE_MOCK) {
    await delay(500);
    const index = mockAppointments.findIndex(a => a.id === appointmentId);
    if (index === -1) throw new Error('Appointment not found');
    mockAppointments[index].status = 'checked_in';
    return mockAppointments[index];
  }
  const response = await api.patch(`/appointments/${appointmentId}/check-in`);
  const apt = response.data.data;
  return {
    ...apt,
    id: apt.appointmentId,
    patientName: apt.name,
    phoneNumber: apt.phoneNo,
    startTime: apt.slotStartTime,
    endTime: apt.slotEndTime,
  };
};

// --- Patient APIs ---

export const searchPatientById = async (patientId: string): Promise<Patient | null> => {
  if (USE_MOCK) {
    await delay(400);
    return mockPatients.find(p => p.id === patientId) || null;
  }
  const response = await api.get(`/patients/${patientId}`);
  const patient = response.data.data;
  if (!patient) return null;
  return {
    ...patient,
    id: patient._id,
    phoneNumber: patient.phoneNo,
    address: {
      street: patient.address?.street || '',
      city: patient.address?.city || '',
      state: patient.address?.state || '',
    }
  };
};

export const createPatient = async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
  if (USE_MOCK) {
    await delay(600);
    const newPatient: Patient = {
      id: `PAT${String(mockPatients.length + 1).padStart(3, '0')}`,
      ...patientData,
    };
    mockPatients.push(newPatient);
    return newPatient;
  }
  
  // Transform frontend Patient data to backend format
  const backendData = {
    name: patientData.name,
    phoneNo: patientData.phoneNumber,
    age: patientData.age,
    sex: patientData.sex.toLowerCase(),
    dob: patientData.dob,
    address: patientData.address
  };
  
  const response = await api.post('/patients', backendData);
  const patient = response.data.data;
  return {
    ...patient,
    id: patient._id,
    phoneNumber: patient.phoneNo,
  };
};

export const createVisit = async (appointmentId: string, patientId: string): Promise<{ visitId: string }> => {
  if (USE_MOCK) {
    await delay(500);
    console.log(`Visit created for appointment ${appointmentId} with patient ${patientId}`);
    return { visitId: `VISIT${Date.now()}` };
  }
  const response = await api.post('/visits', { appointmentId, patientId });
  const visit = response.data.data;
  return { 
    ...visit,
    visitId: visit._id || visit.id, // Support both naming for backward compatibility
    id: visit._id || visit.id
  };
};

export const getPatients = async (page: number = 1, limit: number = 10): Promise<{ data: Patient[], total: number }> => {
  if (USE_MOCK) {
    await delay(500);
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      data: mockPatients.slice(start, end),
      total: mockPatients.length,
    };
  }
  const response = await api.get('/patients', { params: { page, limit } });
  const { data, total } = response.data;
  return {
    data: data.map((p: any) => ({
      ...p,
      id: p._id,
      phoneNumber: p.phoneNo,
      address: {
        street: p.address?.street || '',
        city: p.address?.city || '',
        state: p.address?.state || '',
      }
    })),
    total
  };
};

// --- Visit & Medical History APIs ---
import { mockVisits, type Visit, type MedicalHistory } from './mocks/visitData';
import { format } from 'date-fns';

export interface Metadata {
  treatments: string[];
  medicines: string[];
  diseases: string[];
  symptoms: string[];
}

const mapBackendVisit = (v: any): Visit => {
  const patient = v.patient || {};
  return {
    ...v,
    id: v._id || v.id,
    tokenNumber: v.visitToken,
    visitDate: format(new Date(v.createdAt), 'yyyy-MM-dd'),
    visitTime: format(new Date(v.createdAt), 'hh:mm a'),
    // Map patient details if provided by aggregation
    patientName: patient.name,
    phoneNumber: patient.phoneNo,
    age: patient.age,
    sex: patient.sex,
    dob: patient.dob,
    address: patient.address ? `${patient.address.street || ''}, ${patient.address.city || ''}` : v.address,
    // Map medical history fields if available
    medicalHistory: v.disease ? {
      disease: v.disease,
      diseaseDuration: v.diseaseDuration,
      presentSymptoms: v.presentSymptoms,
      previousTreatment: v.previousTreatment,
      vitals: v.vitals,
      otherProblems: v.otherProblems,
      medicinesGiven: v.medicinesGiven,
      advice: v.advice,
      followUpDate: v.followUpDate
    } : undefined
  };
};

export const searchVisitByToken = async (tokenNumber: number, hospitalId: string): Promise<Visit | null> => {
  if (USE_MOCK) {
    await delay(500);
    return mockVisits.find(v => v.tokenNumber === tokenNumber && v.hospitalId === hospitalId) || null;
  }
  try {
    const response = await api.get(`/visits/search`, { params: { tokenNumber, hospitalId } });
    const visit = response.data.data;
    if (!visit) return null;
    return mapBackendVisit(visit);
  } catch (error) {
    return null;
  }
};

export const getDoctorVisits = async (hospitalId: string, page: number, limit: number): Promise<{ data: Visit[], total: number }> => {
  if (USE_MOCK) {
    await delay(500);
    const filtered = mockVisits.filter(v => v.hospitalId === hospitalId);
    return {
      data: filtered.slice((page - 1) * limit, page * limit),
      total: filtered.length
    };
  }
  const response = await api.get(`/visits/today`, { params: { hospitalId, page, limit } });
  const { data, total } = response.data;
  
  // We need to fetch patient names for the list too if backend doesn't populate it
  // For now, let's assume we might need to populate or backend will eventually do it via aggregation
  // Optimization: Backend should ideally populate this. I'll add population to backend logic later if missing.
  
  return {
    data: data.map(mapBackendVisit),
    total
  };
};

export const getPatientHistory = async (patientId: string): Promise<Visit[]> => {
  if (USE_MOCK) {
    await delay(500);
    return mockVisits.filter(v => v.patientId === patientId && v.status === 'done');
  }
  const response = await api.get(`/visits/patient/${patientId}/history`);
  const visits = response.data.data;
  return visits.map(mapBackendVisit);
};

export const updateVisit = async (visitId: string, details: Partial<MedicalHistory>): Promise<Visit> => {
  if (USE_MOCK) {
    await delay(800);
    const index = mockVisits.findIndex(v => v.id === visitId);
    if (index === -1) throw new Error('Visit not found');
    
    mockVisits[index] = {
      ...mockVisits[index],
      status: 'done',
      medicalHistory: {
        ...mockVisits[index].medicalHistory,
        ...details as MedicalHistory
      }
    };
    return mockVisits[index];
  }
  // Transform medicalHistory flat structure from form to nested if needed or just send as is
  // The backend updateVisitMedicalDetails uses ...medicalDetails directly
  const response = await api.put(`/visits/${visitId}`, details);
  const visit = response.data.data;
  return mapBackendVisit(visit);
};

// --- Metadata APIs ---

export const getMetadata = async (): Promise<Metadata> => {
  if (USE_MOCK) {
    await delay(300);
    return {
      treatments: [
        "Nadi Pariksha", "Gastrointestinal Disorder", "Prakriti Parikshan",
        "Hair Fall", "Hypertension Problems", "Respiratory Disorders",
        "Urinary Disorders", "Joint Disorders", "Skin Disorder",
        "Eczema", "Fungal Infection", "Acne", "Vitiligo", "Diabetics"
      ],
      diseases: [
        "Diabetes", "Thyroid", "Joint Disorder", "Skin Disorder",
        "Hypertensions", "Digestive Problems", "Gynecological Problems", "Hair Fall Problems"
      ],
      medicines: mockMedicines,
      symptoms: ["Fever", "Cough", "Cold", "Pain", "Swelling", "Burning Sensation", "Itching", "Weakness"]
    };
  }
  const response = await api.get('/metadata');
  return response.data.data;
};

export const updateMetadata = async (metadata: Partial<Metadata>): Promise<Metadata> => {
  if (USE_MOCK) {
    await delay(500);
    return metadata as Metadata;
  }
  const response = await api.patch('/metadata', metadata);
  return response.data.data;
};

// --- Lead Services ---

export interface ILead {
  _id: string;
  name: string;
  email: string;
  phoneNumber: string;
  city: string;
  healthIssue?: string;
  isConverted: boolean;
}

export const getLeadById = async (id: string): Promise<ILead> => {
  if (USE_MOCK) {
    await delay(500);
    return {
      _id: id,
      name: 'John Doe (Lead)',
      email: 'john.lead@example.com',
      phoneNumber: '9876543210',
      city: 'Mumbai',
      healthIssue: 'Back Pain',
      isConverted: false,
    };
  }
  const response = await api.get(`/leads/${id}`);
  return response.data;
};

export const updateLeadStatus = async (id: string, isConverted: boolean): Promise<ILead> => {
  if (USE_MOCK) {
    await delay(500);
    return {
      _id: id,
      name: 'John Doe (Lead)',
      email: 'john.lead@example.com',
      phoneNumber: '9876543210',
      city: 'Mumbai',
      isConverted,
    };
  }
  const response = await api.patch(`/leads/${id}/status`, { isConverted });
  return response.data;
};

// --- Analytics Services ---

export interface HospitalAnalytics {
  name: string;
  city: string;
  visitCount: number;
}

export interface FrequencyAnalytics {
  disease?: string;
  treatment?: string;
  count: number;
}

export const getHospitalAnalytics = async (startDate?: string, endDate?: string): Promise<HospitalAnalytics[]> => {
  if (USE_MOCK) {
    await delay(500);
    return [
      { name: 'Sagar Ayurvedic Clinic', city: 'Mumbai', visitCount: 156 },
      { name: 'Ayush Wellness Center', city: 'Pune', visitCount: 89 },
      { name: 'Jeevan Hospital', city: 'Lucknow', visitCount: 45 },
    ];
  }
  const response = await api.get('/analytics/hospitals', { params: { startDate, endDate } });
  return response.data.data;
};

export const getDiseaseAnalytics = async (startDate?: string, endDate?: string): Promise<FrequencyAnalytics[]> => {
  if (USE_MOCK) {
    await delay(500);
    return [
      { disease: 'Hypertension', count: 120 },
      { disease: 'Diabetes', count: 95 },
      { disease: 'Digestive Problems', count: 67 },
      { disease: 'Joint Pain', count: 43 },
    ];
  }
  const response = await api.get('/analytics/diseases', { params: { startDate, endDate } });
  return response.data.data;
};

export const getTreatmentAnalytics = async (startDate?: string, endDate?: string): Promise<FrequencyAnalytics[]> => {
  if (USE_MOCK) {
    await delay(500);
    return [
      { treatment: 'Nadi Pariksha', count: 200 },
      { treatment: 'Brahmi Vati', count: 150 },
      { treatment: 'Shirodhara', count: 88 },
      { treatment: 'Panchakarma', count: 45 },
    ];
  }
  const response = await api.get('/analytics/treatments', { params: { startDate, endDate } });
  return response.data.data;
};
