import { Request, Response } from 'express';
import Lead from '../models/Lead';

export const createLead = async (req: Request, res: Response) => {
  try {
    const { name, email, phoneNumber, city, healthIssue } = req.body;
    const newLead = await Lead.create({
      name,
      email,
      phoneNumber,
      city,
      healthIssue
    });
    res.status(201).json({ _id: newLead._id });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getLead = async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findById(req.params.id).select('name email phoneNumber city');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(lead);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateLeadStatus = async (req: Request, res: Response) => {
  try {
    const { isConverted } = req.body;
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { isConverted },
      { new: true }
    );
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.status(200).json(lead);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
