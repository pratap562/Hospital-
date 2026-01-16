import { Request, Response } from 'express';
import {
  getPublicSlots as getPublicSlotsService,
  createSlotLock as createSlotLockService,
  releaseSlotLock as releaseSlotLockService,
  confirmBooking as confirmBookingService,
  ConfirmBookingData,
} from '../services/bookingService';

/**
 * Get available slots for a hospital (public endpoint)
 */
export const getPublicSlots = async (req: Request, res: Response): Promise<void> => {
  try {
    const { hospitalId } = req.params;
    const { date } = req.query;

    if (!hospitalId) {
      res.status(400).json({ success: false, message: 'Hospital ID is required' });
      return;
    }

    const slots = await getPublicSlotsService(hospitalId, date as string);

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error: any) {
    if (error.message === 'Invalid hospital ID') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Error fetching slots', error: error.message });
  }
};

/**
 * Lock a slot when user proceeds to payment
 */
export const lockSlot = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slotId } = req.body;

    if (!slotId) {
      res.status(400).json({ success: false, message: 'Slot ID is required' });
      return;
    }

    const result = await createSlotLockService(slotId);

    res.status(201).json({
      success: true,
      message: 'Slot locked successfully',
      data: result,
    });
  } catch (error: any) {
    if (error.message.includes('no longer available') || error.message === 'Slot not found') {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    if (error.message === 'Invalid slot ID') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Error locking slot', error: error.message });
  }
};

/**
 * Release a slot lock (when user cancels payment)
 */
export const releaseSlotLock = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lockId } = req.params;

    if (!lockId) {
      res.status(400).json({ success: false, message: 'Lock ID is required' });
      return;
    }

    const result = await releaseSlotLockService(lockId);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error: any) {
    if (error.message === 'Lock not found') {
      res.status(404).json({ success: false, message: error.message });
      return;
    }
    if (error.message === 'Cannot release a confirmed booking') {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Error releasing lock', error: error.message });
  }
};

/**
 * Confirm booking after successful payment
 */
export const confirmBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lockId, name, email, phoneNo, healthIssue, doctorId, doctorName } = req.body;

    if (!lockId || !name || !email || !phoneNo || !healthIssue || !doctorId || !doctorName) {
      res.status(400).json({ 
        success: false, 
        message: 'All fields are required: lockId, name, email, phoneNo, healthIssue, doctorId, doctorName' 
      });
      return;
    }

    const bookingData: ConfirmBookingData = {
      lockId,
      name,
      email,
      phoneNo,
      healthIssue,
      doctorId,
      doctorName,
    };

    const result = await confirmBookingService(bookingData);

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: result,
    });
  } catch (error: any) {
    if (error.message.includes('expired') || error.message === 'Lock not found or expired. Please try booking again.') {
      res.status(410).json({ success: false, message: error.message });
      return;
    }
    if (error.message === 'This booking has already been confirmed') {
      res.status(409).json({ success: false, message: error.message });
      return;
    }
    res.status(500).json({ success: false, message: 'Error confirming booking', error: error.message });
  }
};
