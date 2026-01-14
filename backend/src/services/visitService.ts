import { Visit } from '../models/Visit';
import { Token } from '../models/Token';
import { getAppointmentByPublicId } from './appointmentService';
import { getPatientByPatientId } from './patientService';
import { Types } from 'mongoose';

/**
 * Atomic token generation for a hospital on a specific date
 */
export const getNextToken = async (hospitalId: Types.ObjectId, date: Date): Promise<number> => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const tokenRecord = await Token.findOneAndUpdate(
    { hospitalId, date: startOfDay },
    { $inc: { currentToken: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return tokenRecord.currentToken;
};

export const createVisit = async (appointmentId: string, patientId: string) => {
  const appointment = await getAppointmentByPublicId(appointmentId);
  const patient = await getPatientByPatientId(patientId);

  // Get hospitalId from appointment (it's a ref to Hospital)
  const hospitalId = appointment.hospitalId;

  // Get next token atomically for this hospital and today
  const visitToken = await getNextToken(hospitalId as Types.ObjectId, new Date());

  const visit = new Visit({
    visitToken,
    patientId,
    hospitalId,
    doctorId: appointment.doctorId,
    status: 'waiting',
  });

  await visit.save();
  return visit;
};

export const searchVisitByTokenToday = async (tokenNumber: number, hospitalId: string) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const visits = await Visit.aggregate([
    {
      $match: {
        visitToken: tokenNumber,
        hospitalId: new Types.ObjectId(hospitalId),
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: 'patientId',
        as: 'patient'
      }
    },
    {
      $unwind: '$patient'
    },
    {
      $project: {
        __v: 0,
        'patient.__v': 0
      }
    }
  ]);

  return visits[0] || null;
};

export const getTodayVisitsForHospital = async (
  hospitalId: string, 
  page: number = 1, 
  limit: number = 10
) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const skip = (page - 1) * limit;

  const visits = await Visit.aggregate([
    {
      $match: {
        hospitalId: new Types.ObjectId(hospitalId),
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      }
    },
    {
      $lookup: {
        from: 'patients',
        localField: 'patientId',
        foreignField: 'patientId',
        as: 'patient'
      }
    },
    {
      $unwind: '$patient'
    },
    { $sort: { visitToken: 1 } },
    { $skip: skip },
    { $limit: limit },
    {
      $project: {
        __v: 0,
        'patient.__v': 0
      }
    }
  ]);

  const total = await Visit.countDocuments({
    hospitalId: new Types.ObjectId(hospitalId),
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });

  return {
    data: visits,
    total,
    page,
    limit
  };
};

export const updateVisitMedicalDetails = async (visitId: string, medicalDetails: any) => {
  const visit = await Visit.findByIdAndUpdate(
    visitId,
    {
      ...medicalDetails,
      status: 'done'
    },
    { new: true }
  ).select('-__v');

  if (!visit) {
    throw new Error('Visit not found');
  }

  return visit;
};

export const getPatientVisitsHistory = async (patientId: string) => {
  const visits = await Visit.find({
    patientId: patientId,
    status: 'done'
  })
    .sort({ createdAt: -1 })
    .select('-__v');

  return visits;
};

export const countPatientDoneVisits = async (patientId: string) => {
  return Visit.countDocuments({
    patientId: patientId,
    status: 'done'
  });
};
