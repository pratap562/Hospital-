import { Patient } from '../models/Patient';
import { Types } from 'mongoose';

export interface CreatePatientData {
  name: string;
  email?: string;
  phoneNo?: string;
  age?: number;
  sex?: 'male' | 'female' | 'other';
  dob?: Date;
  address?: {
    city?: string;
    state?: string;
    street?: string;
  };
}

export const getPatientById = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('Invalid patient ID');
  }
  const patient = await Patient.findById(id).select('-__v');
  if (!patient) {
    throw new Error('Patient not found');
  }
  return patient;
};

export const createPatient = async (patientData: CreatePatientData) => {
  const patient = new Patient({
    ...patientData
  });

  await patient.save();
  return patient;
};

export const listPatients = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;
  
  const patients = await Patient.find({})
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const total = await Patient.countDocuments({});

  // Add totalVisits for each patient (status 'done')
  const patientsWithVisits = await Promise.all(patients.map(async (p) => {
    const { countPatientDoneVisits } = await import('./visitService');
    const totalVisits = await countPatientDoneVisits(p._id.toString());
    return {
      ...p.toObject(),
      totalVisits
    };
  }));

  return {
    data: patientsWithVisits,
    total,
    page,
    limit
  };
};
