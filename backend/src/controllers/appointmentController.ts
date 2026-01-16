import { Request, Response } from 'express';
import {
  getTodaysAppointments as getTodaysAppointmentsService,
  getAppointmentByPublicId as getAppointmentByPublicIdService,
  updateAppointmentStatus as updateAppointmentStatusService,
} from '../services/appointmentService';
import { findHospitalObjectId } from '../services/hospitalService';

export const getTodaysAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId, mode } = req.query;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!hospitalId) {
      res.status(400).json({ success: false, message: 'Hospital ID is required' });
      return;
    }

    const hospital = await findHospitalObjectId(hospitalId as string);
    const result = await getTodaysAppointmentsService(hospital._id, { page, limit }, mode as string);

    res.status(200).json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching appointments', error: error.message });
  }
};

export const getAppointmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      res.status(400).json({ success: false, message: 'Appointment ID is required' });
      return;
    }

    const appointment = await getAppointmentByPublicIdService(appointmentId);

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error: any) {
    if (error.message === 'Appointment not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Error fetching appointment', error: error.message });
  }
};

export const checkInAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      res.status(400).json({ success: false, message: 'Appointment ID is required' });
      return;
    }

    const appointment = await updateAppointmentStatusService(appointmentId, 'checked_in');

    res.status(200).json({
      success: true,
      message: 'Appointment checked in successfully',
      data: appointment,
    });
  } catch (error: any) {
    if (error.message === 'Appointment not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Error checking in appointment', error: error.message });
  }
};
