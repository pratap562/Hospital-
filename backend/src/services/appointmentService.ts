import { Appointment } from '../models/Appointment';
import { Types } from 'mongoose';
import { PaginationOptions, PaginatedResult } from './slotService';

export const getTodaysAppointments = async (
  hospitalObjectId: Types.ObjectId,
  options: PaginationOptions
): Promise<PaginatedResult<any>> => {
  const { page, limit } = options;
  const skip = (page - 1) * limit;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const appointments = await Appointment.find({
    hospitalId: hospitalObjectId,
    appointmentDate: {
      $gte: todayStart,
      $lte: todayEnd
    }
  })
    .sort({ slotStartTime: 1 })
    .skip(skip)
    .limit(limit)
    .select('-__v');

  const total = await Appointment.countDocuments({
    hospitalId: hospitalObjectId,
    appointmentDate: {
      $gte: todayStart,
      $lte: todayEnd
    }
  });

  return {
    data: appointments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getAppointmentByPublicId = async (appointmentId: string) => {
  const appointment = await Appointment.findOne({ appointmentId })
    .select('-__v');
    
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  
  return appointment;
};

export const updateAppointmentStatus = async (appointmentId: string, status: 'checked_in' | 'cancelled') => {
  const appointment = await Appointment.findOneAndUpdate(
    { appointmentId },
    { status },
    { new: true }
  );

  if (!appointment) {
    throw new Error('Appointment not found');
  }

  return appointment;
};

export const getAppointmentByObjectId = async (id: Types.ObjectId) => {
  const appointment = await Appointment.findById(id).select('-__v');
  if (!appointment) {
    throw new Error('Appointment not found');
  }
  return appointment;
};
